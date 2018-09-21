const path = require('path');
const os = require('os');
const t = require('tap');
const afs = require('@nlib/afs');
const postcss = require('postcss');
const esifycss = require('../../lib');
const {getExports} = require('../util');

t.test('watch', async (t) => {
    const directory = await afs.mkdtemp(path.join(os.tmpdir(), t.name));
    await afs.deploy(directory, {
        'foo.css': '.foo {--color: red}',
    });
    const dest = path.join(directory, 'output.css');
    const watcher = await esifycss.watch({
        patterns: path.join(directory, '*.css'),
        base: directory,
        dest,
    });
    await new Promise((resolve, reject) => {
        let timer;
        watcher
        .on('error', reject)
        .on('esifycss:output', () => {
            clearTimeout(timer);
            timer = setTimeout(resolve, 500);
        });
        afs.writeFilep(path.join(directory, 'foo.css'), '.foo {--color: gold}')
        .catch(reject);
    });
    watcher.close();
    await t.rejects(afs.readFile(path.join(directory, 'bar/bar.css.js')));
    const outputJS = await afs.readFile(path.join(directory, 'foo.css.js'), 'utf8');
    const exported = getExports(outputJS);
    t.match(exported, {
        classes: {foo: '_foo_css_foo'},
        properties: {color: 'gold'},
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
