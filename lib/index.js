const path = require('path');
const chokidar = require('chokidar');
const {promisify} = require('util');
const glob = promisify(require('glob'));
const afs = require('@nlib/afs');
const postcss = require('postcss');

const listFiles = async (patterns) => {
    const options = {
        nodir: true,
        ignore: '**/node_modules/**',
    };
    const results = await Promise.all(patterns.map((pattern) => glob(pattern, options)));
    return [].concat(...results);
};

class Cache extends Map {}

class Labeler extends Map {

    label(value) {
        if (!this.has(value)) {
            this.set(value, {label: this.size, count: 0});
        }
        const item = this.get(value);
        item.count += 1;
        return item.label;
    }

    sort() {
        const sorted = [...this].sort(([keyA, {count: a}], [keyB, {count: b}]) => (a === b ? keyA < keyB : a < b) ? 1 : -1);
        const mapper = [];
        sorted.forEach(([, {label}], index) => {
            mapper[label] = index;
        });
        return {sorted, mapper};
    }

}

const getCSSAST = async (file, css, config) => {
    const processOptions = {from: file, ...config.processOptions};
    return config.plugins
    ? (await postcss(config.plugins).process(css, processOptions)).root
    : postcss.parse(css, processOptions);
};

const getDependencies = (ast, id) => {
    const directory = path.dirname(id);
    const dependencies = new Map();
    let count = 0;
    ast.walkAtRules((node) => {
        if (node.name !== 'import') {
            return;
        }
        node.params.trim()
        .replace(/^(['"])([^\s'"]+)\1\s*([^\s]*)$/, (match, quote, target, givenName) => {
            count += 1;
            const name = givenName || `$${count}`;
            dependencies.set(name, afs.absolutify(target, directory));
            node.remove();
        });
    });
    return dependencies;
};

const minify = (ast) => {
    const {raws} = ast;
    for (const key of ['before', 'between', 'after']) {
        const value = raws[key];
        if (value) {
            raws[key] = value.replace(/\s/g, '');
        }
    }
    return ast;
};

const processCSSAST = ({file, ast, dependencies}, config) => {
    const classes = {};
    const properties = {};
    ast.walk((node) => {
        minify(node);
        if (node.type === 'rule') {
            node.selector = node.selector.replace(/([$_a-zA-Z0-9-]*)?\.=?(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/g, (match, imported, className) => {
                if (imported && dependencies.has(imported)) {
                    const sourceId = dependencies.get(imported);
                    const {classes: sourceClasses} = config.cache.get(sourceId);
                    return `.${sourceClasses[className]}`;
                } else {
                    if (!classes[className]) {
                        classes[className] = config.mangler(file, className);
                    }
                    return `.${classes[className]}`;
                }
            });
            node.raws.before = '\n';
        } else if (node.type === 'decl' && node.prop.startsWith('--')) {
            const propertyName = node.prop.slice(2);
            properties[propertyName] = node.value;
        }
    });
    return {classes, properties};
};

const processCSS = async (file, config) => {
    const css = await afs.readFile(file, 'utf8');
    const hash = afs.getHash(css);
    const cached = config.cache.get(file);
    if (cached && hash === cached.hash) {
        return cached;
    }
    const ast = await getCSSAST(file, css, config);
    const dependencies = getDependencies(ast, file);
    for (const [, file] of dependencies) {
        await processCSS(file, config);
    }
    const {classes, properties} = processCSSAST({file, ast, dependencies}, config);
    if (config.onParse) {
        await config.onParse({
            file,
            ast,
            classes: Object.assign({}, classes),
            properties: Object.assign({}, properties),
        });
    }
    const result = {file, hash, ast, classes, dependencies, properties};
    afs.updateFile(`${file}${config.ext}`, config.generateDefinition(result));
    config.cache.set(file, result);
    return result;
};

// options.mangler
// options.mangle
// options.labeler
// options.base
const getMangler = (options) => {
    let {mangler} = options;
    if (!mangler) {
        if (options.mangle) {
            const labeler = options.labeler || new Labeler();
            mangler = (file, className) => `_${labeler.label(`${file}/${className}`).toString(36)}`;
        } else {
            const base = options.base || process.cwd();
            mangler = (file, className) => [
                path.relative(base, file).replace(/^(\w)/, '_$1').replace(/[^\w]+/g, '_'),
                className,
            ].join('_');
        }
    }
    return mangler;
};

const getGenerator = (options) => {
    let {generator} = options;
    if (!generator) {
        generator = options.classesOnly
        ? ({classes}) => [
            `export const classes = ${JSON.stringify(classes)};`,
            'export default classes;',
        ].join('\n')
        : ({classes, properties}) => [
            `export const classes = ${JSON.stringify(classes)};`,
            `export const properties = ${JSON.stringify(properties)};`,
            'export default {classes, properties};',
        ].join('\n');
    }
    return generator;
};

const concat = (files, {cache}) => files.map((file) => cache.get(file).ast.toString()).join('\n');

const start = async (options) => {
    const configFile = options.config
    ? afs.absolutify(options.config)
    : await afs.findUp('esifycss.config.js');
    const config = Object.assign(
        {ext: options.typescript ? '.ts' : '.js'},
        configFile ? require(configFile) : {},
        options,
        {
            config: configFile,
            mangler: getMangler(options),
            generateDefinition: getGenerator(options),
            cache: new Cache(),
        },
    );
    const patterns = [].concat(config.patterns).filter(Boolean);
    if (patterns.length === 0) {
        patterns.push('**/*.css');
    }
    const files = await listFiles(patterns);
    const generate = (file) => processCSS(file, config);
    await Promise.all(files.map(generate));
    if (config.watch) {
        chokidar.watch(files, Object.assign(config.chokidar, {disableGlobbing: true}))
        .on('update', generate);
    }
    if (config.dest) {
        await afs.writeFile(config.dest, concat(files, config));
    }
};

Object.assign(exports, {
    listFiles,
    start,
    Cache,
});
