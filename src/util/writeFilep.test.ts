import * as path from 'path';
import * as fs from 'fs';
import ava from 'ava';
import {createTemporaryDirectory} from './createTemporaryDirectory';
import {writeFilep} from './writeFilep';
const {readFile} = fs.promises;

ava('create a file', async (t) => {
    const testDirectory = await createTemporaryDirectory();
    const filePath = path.join(testDirectory, 'file');
    await writeFilep(filePath, filePath);
    t.is(await readFile(filePath, 'utf8'), filePath);
});

ava('create a directory and a file', async (t) => {
    const testDirectory = await createTemporaryDirectory();
    const filePath = path.join(testDirectory, 'dir', 'file');
    await writeFilep(filePath, filePath);
    t.is(await readFile(filePath, 'utf8'), filePath);
});
