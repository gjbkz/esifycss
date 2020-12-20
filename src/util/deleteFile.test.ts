import * as path from 'path';
import * as fs from 'fs';
import ava from 'ava';
import {createTemporaryDirectory} from './createTemporaryDirectory';
import {deleteFile} from './deleteFile';

ava('delete a file', async (t) => {
    const testDirectory = await createTemporaryDirectory();
    const filePath = path.join(testDirectory, 'file');
    await fs.promises.writeFile(filePath, filePath);
    t.true((await fs.promises.stat(filePath)).isFile());
    await deleteFile(filePath);
    await t.throwsAsync(async () => {
        await fs.promises.stat(filePath);
    }, {code: 'ENOENT'});
});

ava('delete an empty directory', async (t) => {
    const testDirectory = await createTemporaryDirectory();
    const directory = path.join(testDirectory, 'dir');
    await fs.promises.mkdir(directory);
    t.true((await fs.promises.stat(directory)).isDirectory());
    await deleteFile(directory);
    await t.throwsAsync(async () => {
        await fs.promises.stat(directory);
    }, {code: 'ENOENT'});
});

ava('delete a directory', async (t) => {
    const testDirectory = await createTemporaryDirectory();
    const rootDirectory = path.join(testDirectory, 'dir1');
    const directory = path.join(rootDirectory, 'dir2');
    await fs.promises.mkdir(directory, {recursive: true});
    const filePath = path.join(directory, 'file');
    await fs.promises.writeFile(path.join(directory, 'file'), directory);
    t.true((await fs.promises.stat(filePath)).isFile());
    await deleteFile(rootDirectory);
    await t.throwsAsync(async () => {
        await fs.promises.stat(filePath);
    }, {code: 'ENOENT'});
    await t.throwsAsync(async () => {
        await fs.promises.stat(directory);
    }, {code: 'ENOENT'});
    await t.throwsAsync(async () => {
        await fs.promises.stat(rootDirectory);
    }, {code: 'ENOENT'});
});
