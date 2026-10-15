import * as path from 'path';
import * as fs from 'fs';
import ava from 'ava';
import {createTemporaryDirectory} from './createTemporaryDirectory';
import {deleteFile} from './deleteFile';
import {updateFile} from './updateFile';

const {stat, mkdir} = fs.promises;

ava('delete a file', async (t) => {
    const testDirectory = await createTemporaryDirectory();
    const filePath = path.join(testDirectory, 'file');
    await updateFile(filePath, filePath);
    t.true((await stat(filePath)).isFile());
    await deleteFile(filePath);
    await t.throwsAsync(async () => {
        await stat(filePath);
    }, {code: 'ENOENT'});
});

ava('delete an empty directory', async (t) => {
    const testDirectory = await createTemporaryDirectory();
    const directory = path.join(testDirectory, 'dir');
    await mkdir(directory);
    t.true((await stat(directory)).isDirectory());
    await deleteFile(directory);
    await t.throwsAsync(async () => {
        await stat(directory);
    }, {code: 'ENOENT'});
});

ava('delete a directory', async (t) => {
    const testDirectory = await createTemporaryDirectory();
    const rootDirectory = path.join(testDirectory, 'dir1');
    const directory = path.join(rootDirectory, 'dir2');
    await mkdir(directory, {recursive: true});
    const filePath = path.join(directory, 'file');
    await updateFile(path.join(directory, 'file'), directory);
    t.true((await stat(filePath)).isFile());
    await deleteFile(rootDirectory);
    await t.throwsAsync(async () => {
        await stat(filePath);
    }, {code: 'ENOENT'});
    await t.throwsAsync(async () => {
        await stat(directory);
    }, {code: 'ENOENT'});
    await t.throwsAsync(async () => {
        await stat(rootDirectory);
    }, {code: 'ENOENT'});
});
