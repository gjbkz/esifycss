import * as path from 'path';
import anyTest, {TestInterface} from 'ava';
import {createDirectoryFor} from './createDirectoryFor';
import {createTemporaryDirectory} from './createTemporaryDirectory';
import {stat} from './fs';

const test = anyTest as TestInterface<{
    directory: string,
}>;

test.beforeEach(async (t) => {
    t.context.directory = await createTemporaryDirectory();
});

interface ITest {
    input: string,
}

([
    {input: '/foo'},
    {input: '/foo/bar/baz'},
] as Array<ITest>).forEach(({input}) => {
    test(`createDirectoryFor(${JSON.stringify(input)})`, async (t) => {
        const absoluteInput = path.join(t.context.directory, input);
        const actual = createDirectoryFor(absoluteInput);
        t.true(absoluteInput.startsWith(actual));
        const stats = await stat(actual);
        t.true(stats.isDirectory());
    });
});
