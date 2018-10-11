const path = require('path');
const os = require('os');
const t = require('tap');
const afs = require('@nlib/afs');
const postcss = require('postcss');
const esifycss = require('../../lib');
const {getExports} = require('../util');

t.test('outputDir', async (t) => {
    const directory = await afs.mkdtemp(path.join(os.tmpdir(), 'es'));
    await afs.deploy(directory, {
        'foo.css': [
            '.foo {--color: red}',
            '@media print {}',
        ].join('\n'),
        'bar': {
            'bar.css': '.bar {--color: blue}',
        },
    });
    const dest = path.join(directory, 'output.css');
    const baseDir = directory;
    const outputDir = path.join(directory, 'intermediates');
    await esifycss.start({
        patterns: path.join(directory, '*.css'),
        base: directory,
        dest,
        baseDir,
        outputDir,
    });
    await t.rejects(afs.readFile(path.join(outputDir, 'bar/bar.css.js')));
    const outputJS = await afs.readFile(path.join(outputDir, 'foo.css.js'), 'utf8');
    const exported = getExports(outputJS);
    t.match(exported, {
        classes: {foo: '_foo_css_foo'},
        properties: {color: 'red'},
        default: {
            classes: {name: 'classes'},
            properties: {name: 'properties'},
        },
    });
    const outputCSS = await afs.readFile(dest, 'utf8');
    const cssAST = postcss.parse(outputCSS);
    t.equal(cssAST.nodes[0].selector, `.${exported.classes.foo}`);
    t.match(cssAST.nodes[0].nodes[0], {
        prop: '--color',
        value: exported.properties.color,
    });
});
