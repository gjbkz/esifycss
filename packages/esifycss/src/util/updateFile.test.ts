import * as path from 'path';
import * as fs from 'fs';
import {test} from 'node:test';
import * as assert from 'node:assert/strict';
import {createTemporaryDirectory} from './createTemporaryDirectory';
import {wait} from './wait';
import {updateFile} from './updateFile';

test('create a file', async () => {
    const testDirectory = await createTemporaryDirectory();
    const filePath = path.join(testDirectory, 'file');
    await updateFile(filePath, filePath);
    assert.strictEqual(await fs.promises.readFile(filePath, 'utf8'), filePath);
});

test('create a directory and a file', async () => {
    const testDirectory = await createTemporaryDirectory();
    const filePath = path.join(testDirectory, 'dir', 'file');
    await updateFile(filePath, filePath);
    assert.strictEqual(await fs.promises.readFile(filePath, 'utf8'), filePath);
});

test('do nothing if the source is same', async () => {
    const testDirectory = await createTemporaryDirectory();
    const filePath = path.join(testDirectory, 'dir', 'file');
    await updateFile(filePath, filePath.repeat(2));
    assert.strictEqual(await fs.promises.readFile(filePath, 'utf8'), filePath.repeat(2));
    const stats1 = await fs.promises.stat(filePath);
    await wait(50);
    await updateFile(filePath, filePath);
    const stats2 = await fs.promises.stat(filePath);
    assert.strictEqual(stats1.mtimeMs < stats2.mtimeMs, true);
    await wait(50);
    await updateFile(filePath, filePath);
    const stats3 = await fs.promises.stat(filePath);
    assert.strictEqual(stats3.mtimeMs, stats2.mtimeMs);
});
