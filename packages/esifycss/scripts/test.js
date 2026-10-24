// SPDX-License-Identifier: Apache-2.0
const {readdirSync} = require('node:fs');
const path = require('node:path');
const {spawnSync} = require('node:child_process');

const files = readdirSync('src', {recursive: true})
    .filter((file) => file.endsWith('.test.ts'))
    .sort()
    .map((file) => path.join('src', file));
if (files.length === 0) {
    throw new Error('No unit tests found');
}
const result = spawnSync(process.execPath, [
    '--require', 'ts-node/register', '--test', '--test-timeout=120000', ...files,
], {stdio: 'inherit'});
if (result.error) {
    throw result.error;
}
process.exitCode = result.status ?? 1;
