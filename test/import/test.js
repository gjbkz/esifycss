const path = require('path');
const os = require('os');
const t = require('tap');
const afs = require('@nlib/afs');
const postcss = require('postcss');
const esifycss = require('../../lib');
const {getExports} = require('../util');

t.test('es', async (t) => {
    const directory = await afs.mkdtemp(path.join(os.tmpdir(), 'es'));
    await afs.deploy(directory, {
        'foo.css': [
            '@import "./bar/bar.css" baz;',
            '.foo {--color: red}',
            'baz.bar.foo {--color2: green}',
        ].join('\n'),
        'bar': {
            'bar.css': '.bar {--color: blue}',
        },
    });
    const dest = path.join(directory, 'output.css');
    await esifycss.start({
        patterns: path.join(directory, '**/*.css'),
        base: directory,
        dest,
    });
    const fooJS = await afs.readFile(path.join(directory, 'foo.css.js'), 'utf8');
    const barJS = await afs.readFile(path.join(directory, 'bar/bar.css.js'), 'utf8');
    const fooExported = getExports(fooJS);
    t.match(fooExported, {
        classes: {foo: '_foo_css_foo'},
        properties: {color: 'red', color2: 'green'},
        default: {
            classes: {name: 'classes'},
            properties: {name: 'properties'},
        },
    });
    const barExported = getExports(barJS);
    t.match(barExported, {
        classes: {bar: '_bar_bar_css_bar'},
        properties: {color: 'blue'},
        default: {
            classes: {name: 'classes'},
            properties: {name: 'properties'},
        },
    });
    const outputCSS = await afs.readFile(dest, 'utf8');
    const cssAST = postcss.parse(outputCSS);
    t.equal(cssAST.nodes[0].selector, `.${barExported.classes.bar}`);
    t.match(cssAST.nodes[0].nodes[0], {
        prop: '--color',
        value: barExported.properties.color,
    });
    t.equal(cssAST.nodes[1].selector, `.${fooExported.classes.foo}`);
    t.match(cssAST.nodes[1].nodes[0], {
        prop: '--color',
        value: fooExported.properties.color,
    });
    t.equal(cssAST.nodes[2].selector, `.${barExported.classes.bar}.${fooExported.classes.foo}`);
    t.match(cssAST.nodes[2].nodes[0], {
        prop: '--color2',
        value: fooExported.properties.color2,
    });
});
