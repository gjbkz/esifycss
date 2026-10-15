// SPDX-License-Identifier: Apache-2.0
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
process.env.PARCEL_WORKERS = '2';
const Bundler = require('parcel-bundler');
const plugin = require('../lib');

async function fixture(t, files) {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'esifycss-parcel-'));
    t.after(() => fs.rm(directory, {recursive: true, force: true}));
    for (const [name, code] of Object.entries(files)) await fs.writeFile(path.join(directory, name), code);
    return directory;
}
async function build(directory, input = 'entry.js') {
    const bundler = new Bundler(path.join(directory, input), {
        outDir: path.join(directory, 'output'), watch: false, cache: false,
        hmr: false, minify: false, sourceMaps: false, logLevel: 0,
        autoInstall: false, throwErrors: true,
    });
    plugin(bundler);
    return bundler.bundle();
}
function execute(code) {
    const rules = [];
    const style = {parentNode: null, sheet: {cssRules: rules, insertRule(rule, index) {rules.splice(index, 0, rule);}}};
    const context = {document: {createElement() {return style;}, head: {appendChild(node) {node.parentNode = this;}}}};
    context.window = context;
    vm.runInNewContext(code, context);
    return {result: context.result, rules};
}

test('plugin exports and core workspace resolution are preserved', () => {
    assert.equal(plugin, plugin.default);
    assert.equal(plugin, plugin.esifyCSSPlugin);
    assert.equal(require.resolve('esifycss'), path.resolve(__dirname, '../../esifycss/lib/index.js'));
});

test('Parcel 1 embeds CSS with unique class, id, and animation names across workers', async t => {
    const directory = await fixture(t, {
        'entry.js': "import * as a from './a.css'; import * as b from './b.css'; globalThis.result = {a, b};",
        'a.css': '@keyframes spin {to {opacity: 0}} .button {animation: spin 1s} #panel {color: red}',
        'b.css': '@keyframes spin {to {opacity: 1}} .button {animation: spin 2s} #panel {color: blue}',
    });
    const bundle = await build(directory);
    const {result: {a, b}, rules} = execute(await fs.readFile(bundle.name, 'utf8'));
    const identifiers = [a.className.button, a.id.panel, a.keyframes.spin, b.className.button, b.id.panel, b.keyframes.spin];
    assert.equal(new Set(identifiers).size, 6);
    assert.ok(rules.some(rule => rule.includes(`.${a.className.button}`)));
    assert.ok(rules.some(rule => rule.includes(`#${b.id.panel}`) && rule.includes('color:blue')));
    assert.ok(rules.some(rule => rule.includes(`@keyframes ${a.keyframes.spin}`)));
});

test('config is read for each project without process-global session leakage', async t => {
    const directory = await fixture(t, {
        '.esifycssrc': JSON.stringify({esifycssPluginParameter: {mangle: false}}),
        'entry.js': "import {className} from './a.css'; globalThis.result = className;",
        'a.css': '.button {color: red}',
    });
    const bundle = await build(directory);
    const {result, rules} = execute(await fs.readFile(bundle.name, 'utf8'));
    assert.match(result.button, /^button_/);
    assert.ok(rules.some(rule => rule.includes(`.${result.button}`)));
});

test('CSS is processed in dynamically imported Parcel bundles', async t => {
    const directory = await fixture(t, {
        'entry.js': "import './a.css'; globalThis.load = () => import('./lazy.js');",
        'lazy.js': "import {className} from './b.css'; export const name = className.button;",
        'a.css': '.button {color: red}', 'b.css': '.button {color: blue}',
    });
    const bundle = await build(directory);
    const files = [];
    const visit = node => {if (node.type === 'js') files.push(node.name); for (const child of node.childBundles) visit(child);};
    visit(bundle);
    assert.ok(files.length >= 2);
    const output = (await Promise.all(files.map(file => fs.readFile(file, 'utf8')))).join('\n');
    assert.ok(output.includes('color:red'));
    assert.ok(output.includes('color:blue'));
});
