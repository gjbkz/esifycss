import * as path from 'path';
import anyTest, {TestInterface} from 'ava';
import {createTemporaryDirectory} from './createTemporaryDirectory';
import {writeFile, readFile, deleteFile, stat} from './fs';

const test = anyTest as TestInterface<{
    directory: string,
}>;

test.beforeEach(async (t) => {
    t.context.directory = await createTemporaryDirectory();
});

interface IWriteFileTest {
    filePath: string,
    content: Buffer,
}

([
    {filePath: '/foo/bar', content: Buffer.from('hello')},
    {filePath: '/foo/bar/baz', content: Buffer.from('foo/bar/baz')},
] as Array<IWriteFileTest>).forEach(({filePath, content}) => {
    test(`writeFile('${filePath}', Buffer.from('${content}'))`, async (t) => {
        const absoluteFilePath = path.join(t.context.directory, filePath);
        await writeFile(absoluteFilePath, content);
        const actual = await readFile(absoluteFilePath);
        t.true(actual.equals(content));
        await deleteFile(absoluteFilePath);
        await t.throwsAsync(async () => {
            await stat(absoluteFilePath);
        }, {code: 'ENOENT'});
        await deleteFile(t.context.directory);
        await t.throwsAsync(async () => {
            await stat(t.context.directory);
        }, {code: 'ENOENT'});
    });
});
