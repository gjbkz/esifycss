import * as path from 'path';
import * as fs from 'fs';
import {test} from 'node:test';
import * as assert from 'node:assert/strict';
import {createTemporaryDirectory} from './createTemporaryDirectory';
import {deleteFile} from './deleteFile';
import {updateFile} from './updateFile';

const {stat, mkdir} = fs.promises;

test('delete a file', async () => {
    const testDirectory = await createTemporaryDirectory();
    const filePath = path.join(testDirectory, 'file');
    await updateFile(filePath, filePath);
    assert.strictEqual((await stat(filePath)).isFile(), true);
    await deleteFile(filePath);
    await assert.rejects(async () => {
        await stat(filePath);
    }, {code: 'ENOENT'});
});

test('delete an empty directory', async () => {
    const testDirectory = await createTemporaryDirectory();
    const directory = path.join(testDirectory, 'dir');
    await mkdir(directory);
    assert.strictEqual((await stat(directory)).isDirectory(), true);
    await deleteFile(directory);
    await assert.rejects(async () => {
        await stat(directory);
    }, {code: 'ENOENT'});
});

test('delete a directory', async () => {
    const testDirectory = await createTemporaryDirectory();
    const rootDirectory = path.join(testDirectory, 'dir1');
    const directory = path.join(rootDirectory, 'dir2');
    await mkdir(directory, {recursive: true});
    const filePath = path.join(directory, 'file');
    await updateFile(path.join(directory, 'file'), directory);
    assert.strictEqual((await stat(filePath)).isFile(), true);
    await deleteFile(rootDirectory);
    await assert.rejects(async () => {
        await stat(filePath);
    }, {code: 'ENOENT'});
    await assert.rejects(async () => {
        await stat(directory);
    }, {code: 'ENOENT'});
    await assert.rejects(async () => {
        await stat(rootDirectory);
    }, {code: 'ENOENT'});
});
