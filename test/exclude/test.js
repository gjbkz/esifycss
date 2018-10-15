const path = require('path');
const os = require('os');
const t = require('tap');
const afs = require('@nlib/afs');
const postcss = require('postcss');
const esifycss = require('../../lib');
const {getExports} = require('../util');

t.test('exclude', async (t) => {
    const directory = await afs.mkdtemp(path.join(os.tmpdir(), 'es'));
    await afs.deploy(directory, {
        'foo.css': [
            '.foo {--color: red}',
            '@media print {}',
        ].join('\n'),
        'bar': {
            'bar.css': '.bar {--color: blue}',
        },
        'baz.css': '.baz {--color: gold}',
    });
    const dest = path.join(directory, 'output.css');
    await esifycss.start({
        include: path.join(directory, '*.css'),
        exclude: '**/baz.css',
        base: directory,
        dest,
    });
    await t.rejects(afs.readFile(path.join(directory, 'bar/bar.css.js'), 'utf8'));
    await t.rejects(afs.readFile(path.join(directory, 'baz.css.js'), 'utf8'));
    const outputJS = await afs.readFile(path.join(directory, 'foo.css.js'), 'utf8');
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
    t.equal(outputCSS.match(/baz/), null);
    t.equal(cssAST.nodes[0].selector, `.${exported.classes.foo}`);
    t.match(cssAST.nodes[0].nodes[0], {
        prop: '--color',
        value: exported.properties.color,
    });
});
