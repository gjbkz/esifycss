// SPDX-License-Identifier: Apache-2.0
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const vm = require('node:vm');
const {rollup} = require('rollup');
const {embedCSSPlugin} = require('../lib');

const fixture = async (t, files) => {
    const base = path.join(__dirname, 'temp');
    await fs.mkdir(base, {recursive: true});
    const directory = await fs.mkdtemp(path.join(base, 'fixture-'));
    t.after(() => fs.rm(directory, {recursive: true, force: true}));
    for (const [name, contents] of Object.entries(files)) {
        await fs.mkdir(path.dirname(path.join(directory, name)), {recursive: true});
        await fs.writeFile(path.join(directory, name), contents);
    }
    return directory;
};
const bundle = async (t, directory, options = {}, input = 'entry.js') => {
    const build = await rollup({input: path.join(directory, input), plugins: [embedCSSPlugin(options)]});
    t.after(() => build.close());
    return build;
};
const execute = (code) => {
    const rules = [];
    const style = {parentNode: null, sheet: {
        cssRules: rules,
        insertRule(rule, index) { rules.splice(index, 0, rule); },
    }};
    const context = {document: {
        createElement(name) { assert.equal(name, 'style'); return style; },
        head: {appendChild(node) { node.parentNode = this; }},
    }};
    vm.runInNewContext(code, context);
    return {result: context.result, rules};
};

test('workspace uses local esifycss and preserves plugin exports', () => {
    assert.equal(require.resolve('esifycss'), path.resolve(__dirname, '../../esifycss/lib/index.js'));
    assert.equal(require('../lib').default, embedCSSPlugin);
});

test('embedded CSS runs in IIFE, UMD, and CJS bundles', async (t) => {
    const directory = await fixture(t, {
        'entry.js': "import {className, id, keyframes} from './style.css'; globalThis.result = {className, id, keyframes};",
        'style.css': '@keyframes spin {to {opacity: 0}} .button {animation: spin 1s} #panel {color: red}',
    });
    const build = await bundle(t, directory);
    for (const format of ['iife', 'umd', 'cjs']) {
        const {output} = await build.generate({format, name: 'Fixture'});
        const {result, rules} = execute(output[0].code);
        assert.match(result.className.button, /^_/);
        assert.match(result.id.panel, /^_/);
        assert.match(result.keyframes.spin, /^_/);
        assert.ok(rules.some(rule => rule.includes(`.${result.className.button}`)));
        assert.ok(rules.some(rule => rule.includes(`#${result.id.panel}`)));
        assert.ok(rules.some(rule => rule.includes(`@keyframes ${result.keyframes.spin}`)));
    }
});

test('CSS extraction emits the requested asset without a DOM dependency', async (t) => {
    const directory = await fixture(t, {
        'entry.js': "import {className} from './style.css'; globalThis.result = className;",
        'style.css': '.button {color: red}',
    });
    for (const [css, fileName] of [[true, 'esifycssOutput.css'], ['styles.css', 'styles.css']]) {
        const build = await bundle(t, directory, {css});
        const {output} = await build.generate({format: 'es'});
        const asset = output.find(item => item.type === 'asset');
        const chunk = output.find(item => item.type === 'chunk');
        assert.equal(asset.fileName, fileName);
        const context = {};
        vm.runInNewContext(chunk.code, context);
        assert.ok(asset.source.includes(`.${context.result.button}`));
        assert.ok(asset.source.includes('color:red'));
        assert.ok(!chunk.code.includes('addStyle'));
    }
});

test('dynamic imports are processed in ES and System bundles', async (t) => {
    const directory = await fixture(t, {
        'entry.js': "import './style.css'; globalThis.load = () => import('./lazy.js');",
        'lazy.js': "import {className} from './lazy.css'; export const name = className.lazy;",
        'style.css': '.button {color: red}',
        'lazy.css': '.lazy {color: blue}',
    });
    const build = await bundle(t, directory, {css: 'styles.css'});
    for (const format of ['es', 'system']) {
        const {output} = await build.generate({format, dir: 'output'});
        assert.ok(output.filter(item => item.type === 'chunk').length >= 2);
        const asset = output.find(item => item.type === 'asset');
        assert.ok(asset.source.includes('color:red'));
        assert.ok(asset.source.includes('color:blue'));
    }
});

test('include/exclude filters and no-mangle options are retained', async (t) => {
    const directory = await fixture(t, {
        'entry.js': "import {className} from './style.css'; globalThis.result = className;",
        'style.css': '.button {color: red}',
        'skip.css': '.skip {color: blue}',
    });
    const plugin = embedCSSPlugin({include: /style\.css$/, exclude: /skip\.css$/, esifycssPluginParameter: {mangle: false}});
    plugin.buildStart.call({}, {input: path.join(directory, 'entry.js')});
    assert.equal(await plugin.load.call({}, path.join(directory, 'skip.css')), null);
    const build = await bundle(t, directory, {include: /style\.css$/, esifycssPluginParameter: {mangle: false}});
    const {output} = await build.generate({format: 'iife'});
    const {result, rules} = execute(output[0].code);
    assert.match(result.button, /^button_/);
    assert.ok(rules.some(rule => rule.includes(`.${result.button}`)));
});
