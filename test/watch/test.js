const path = require('path');
const os = require('os');
const t = require('tap');
const afs = require('@nlib/afs');
const postcss = require('postcss');
const esifycss = require('../../lib');
const {getExports} = require('../util');

t.test('watch', {timeout: 5000}, (t) => {
    let watcher;
    t.afterEach((done) => {
        if (watcher) {
            watcher.close();
            watcher = null;
        }
        done();
    });
    t.test('watcher', {timeout: 3000}, async (t) => {
        const directory = await afs.mkdtemp(path.join(os.tmpdir(), t.name));
        await afs.deploy(directory, {
            'foo.css': '.foo {--color: red}',
        });
        const dest = path.join(directory, 'output.css');
        watcher = await esifycss.watch({
            patterns: path.join(directory, '**/*.css'),
            base: directory,
            dest,
        });
        const target = path.join(directory, 'foo.css');
        let count = 0;
        await new Promise((resolve, reject) => {
            watcher
            .on('error', reject)
            .on('esifycss:file', (file) => {
                if (path.basename(file) === 'foo.css') {
                    count += 1;
                }
            })
            .on('esifycss:output', () => {
                if (1 < count) {
                    resolve();
                } else {
                    afs.updateFile(target, '.foo {--color: gold}').catch(reject);
                }
            });
        });
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
    t.end();
});
