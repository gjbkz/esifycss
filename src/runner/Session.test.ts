import * as path from 'path';
import * as acorn from 'acorn';
import anyTest, {TestInterface} from 'ava';
import {createTemporaryDirectory} from '../util/createTemporaryDirectory';
import {ISessionParameters} from './types';
import {writeFile, readFile} from '../util/fs';
import {Session} from './Session';

const test = anyTest as TestInterface<{
    directory: string,
}>;

test.beforeEach(async (t) => {
    t.context.directory = await createTemporaryDirectory();
});

interface ITest {
    parameters: Partial<ISessionParameters>,
    files: Array<{
        path: string,
        content: Array<string>,
    }>,
}

([
    {
        parameters: {},
        files: [
            {
                path: '/components/style.css',
                content: [
                    '.foo {color: red}',
                ],
            },
        ],
    },
] as Array<ITest>).forEach(({parameters, files}, index) => {
    test(`#${index}`, async (t) => {
        await Promise.all(files.map(async (file) => {
            await writeFile(
                path.join(t.context.directory, file.path),
                file.content.join('\n'),
            );
        }));
        const output = path.join(t.context.directory, 'output.js');
        const session = new Session({
            ...parameters,
            output,
            include: files.map((file) => path.join(t.context.directory, file.path)),
        });
        await session.start();
        await Promise.all(files.map(async (file) => {
            const codePath = path.join(
                t.context.directory,
                `${file.path}${path.extname(output)}`,
            );
            const code = await readFile(codePath, 'utf8');
            t.truthy(code);
            const ast = acorn.parse(code, {sourceType: 'module'});
            t.truthy(ast);
            t.log(code);
        }));
    });
});
