import * as path from 'path';
import anyTest, {TestInterface, ExecutionContext} from 'ava';
import * as postcss from 'postcss';
import * as scss from 'postcss-scss';
import * as parser from '@hookun/parse-animation-shorthand';
import {ISessionOptions} from './types';
import {writeFile} from '../util/fs';
import {Session} from './Session';
import {createTemporaryDirectory} from '../util/createTemporaryDirectory';
import {runCode, IRunCodeResult} from '../util/runCode.for-test';

interface ITestContext {
    directory: string,
    session?: Session,
}

const test = anyTest as TestInterface<ITestContext>;

test.beforeEach(async (t) => {
    t.context.directory = await createTemporaryDirectory();
});

test.afterEach(async (t) => {
    if (t.context.session) {
        await t.context.session.stop();
    }
});

interface ITest {
    parameters: Partial<ISessionOptions>,
    files: Array<{
        path: string,
        content: Array<string>,
        test: (
            t: ExecutionContext<ITestContext>,
            result: IRunCodeResult,
        ) => void,
    }>,
}

([
    {
        parameters: {},
        files: [
            {
                path: '/components/style.css',
                content: [
                    '@keyframes foo {0%{color: red}100%{color:green}}',
                    '.foo#bar {animation: 1s 0.5s linear infinite foo}',
                ],
                test: (t, {className, id, keyframes, root}) => {
                    t.deepEqual(Object.keys(id), ['bar']);
                    t.deepEqual(Object.keys(className), ['foo']);
                    t.deepEqual(Object.keys(keyframes), ['foo']);
                    const nodes = root.nodes || [];
                    t.is(nodes.length, 2);
                    {
                        const node = nodes[0] as postcss.AtRule;
                        t.is(node.type, 'atrule');
                        t.is(node.name, 'keyframes');
                        t.is(node.params, keyframes.foo);
                    }
                    {
                        const node = nodes[1] as postcss.Rule;
                        t.is(node.type, 'rule');
                        t.is(node.selector, `.${className.foo}#${id.bar}`);
                        const declarations = (node.nodes || []) as Array<postcss.Declaration>;
                        t.is(declarations.length, 1);
                        t.is(declarations[0].prop, 'animation');
                        t.deepEqual(
                            parser.parse(declarations[0].value),
                            parser.parse(`1s 0.5s linear infinite ${keyframes.foo}`),
                        );
                    }
                },
            },
        ],
    },
    {
        parameters: {
            postcssOptions: {parser: scss.parse},
            extensions: ['.scss', '.css'],
        },
        files: [
            {
                path: '/components/style.scss',
                content: [
                    '.foo#bar {&>.baz {color: red}}',
                ],
                test: (t, {className, id, keyframes}) => {
                    t.deepEqual(Object.keys(id), ['bar']);
                    t.deepEqual(Object.keys(className), ['foo', 'baz']);
                    t.deepEqual(Object.keys(keyframes), []);
                },
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
        const helper = path.join(t.context.directory, 'helper.js');
        const session = t.context.session = new Session({
            ...parameters,
            include: t.context.directory,
            helper,
            watch: false,
        });
        await session.start();
        const identifiers = new Map<string, string>();
        await Promise.all(files.map(async (file) => {
            const name = `${file.path}${path.extname(helper)}`;
            const result = await runCode(path.join(t.context.directory, name));
            for (const map of [result.className, result.id, result.keyframes]) {
                for (const [key, value] of Object.entries(map)) {
                    if (value) {
                        t.false(identifiers.has(value), `${key}: ${value} is conflicted`);
                        identifiers.set(value, key);
                    }
                }
            }
            file.test(t, result);
        }));
    });
});
