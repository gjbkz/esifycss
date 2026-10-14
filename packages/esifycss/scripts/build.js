// SPDX-License-Identifier: Apache-2.0
const {spawnSync} = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
process.chdir(root);
const run = (file, args = []) => {
    const result = spawnSync(process.execPath, [file, ...args], {stdio: 'inherit'});
    if (result.error) throw result.error;
    if (result.status !== 0) process.exit(result.status || 1);
};
const tsc = require.resolve('typescript/bin/tsc');
fs.rmSync('lib', {recursive: true, force: true});
for (const name of fs.readdirSync('src/helper')) {
    if (name.endsWith('.js')) fs.rmSync(path.join('src/helper', name));
}
run('scripts/generate-index.js');
run(tsc, ['--project', 'tsconfig.build.json']);
fs.copyFileSync('src/minifier/walker.d.ts', 'lib/minifier/walker.d.ts');
fs.rmSync('lib/helper', {recursive: true, force: true});
fs.cpSync('src/helper', 'lib/helper', {recursive: true});
run(tsc, ['--project', 'tsconfig.helper.json']);
fs.cpSync('lib/helper', 'src/helper', {recursive: true});
for (const name of fs.readdirSync('lib/bin')) {
    if (name.endsWith('.js')) {
        const file = path.join('lib/bin', name);
        fs.chmodSync(file, fs.statSync(file).mode | 0o100);
    }
}
for (const [directory, noMangle] of [['01-mangle', false], ['02-no-mangle', true]]) {
    const destination = path.join('sample', directory);
    fs.rmSync(destination, {recursive: true, force: true});
    fs.cpSync('sample/00-src', destination, {recursive: true});
    run('lib/bin/esifycss.js', [
        ...(noMangle ? ['--noMangle'] : []),
        '--helper', path.join(destination, 'helper.js'), `${destination}/**/*.css`,
    ]);
}
