import * as path from 'path';
import * as fs from 'fs';
import ava from 'ava';
import {createTemporaryDirectory} from './createTemporaryDirectory';
import {wait} from './wait';
import {updateFile} from './updateFile';

ava('create a file', async (t) => {
    const testDirectory = await createTemporaryDirectory();
    const filePath = path.join(testDirectory, 'file');
    await updateFile(filePath, filePath);
    t.is(await fs.promises.readFile(filePath, 'utf8'), filePath);
});

ava('create a directory and a file', async (t) => {
    const testDirectory = await createTemporaryDirectory();
    const filePath = path.join(testDirectory, 'dir', 'file');
    await updateFile(filePath, filePath);
    t.is(await fs.promises.readFile(filePath, 'utf8'), filePath);
});

ava('do nothing if the source is same', async (t) => {
    const testDirectory = await createTemporaryDirectory();
    const filePath = path.join(testDirectory, 'dir', 'file');
    await updateFile(filePath, filePath.repeat(2));
    t.is(await fs.promises.readFile(filePath, 'utf8'), filePath.repeat(2));
    const stats1 = await fs.promises.stat(filePath);
    await wait(50);
    await updateFile(filePath, filePath);
    const stats2 = await fs.promises.stat(filePath);
    t.true(stats1.mtimeMs < stats2.mtimeMs);
    await wait(50);
    await updateFile(filePath, filePath);
    const stats3 = await fs.promises.stat(filePath);
    t.is(stats3.mtimeMs, stats2.mtimeMs);
});
