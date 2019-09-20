import * as path from 'path';
import anyTest, {TestInterface, ExecutionContext} from 'ava';
import * as stream from 'stream';
import * as events from 'events';
import * as postcss from 'postcss';
import {ISessionOptions} from './types';
import {writeFile, deleteFile, stat} from '../util/fs';
import {Session} from './Session';
import {createTemporaryDirectory} from '../util/createTemporaryDirectory';
import {parseAnimationShorthand} from '../parser/parseAnimationShorthand';
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
                            parseAnimationShorthand(declarations[0].value),
                            parseAnimationShorthand(`1s 0.5s linear infinite ${keyframes.foo}`),
                        );
                    }
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

test('#watch', async (t) => {
    const cssPath = path.join(t.context.directory, '/components/style.css');
    const helper = path.join(t.context.directory, 'helper.js');
    const codePath = `${cssPath}${path.extname(helper)}`;
    await writeFile(cssPath, [
        '@keyframes foo {0%{color: red}100%{color:green}}',
        '.foo#bar {animation: 1s 0.5s linear infinite foo}',
    ].join(''));
    const messageListener = new events.EventEmitter();
    const session = new Session({
        helper,
        watch: true,
        include: t.context.directory,
        stdout: new stream.Writable({
            write(chunk, _encoding, callback) {
                messageListener.emit('message', `${chunk}`);
                callback();
            },
        }),
    });
    Object.assign(t.context, {session});
    const waitForMessage = async (
        expected: string | RegExp,
    ) => {
        await new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => reject(new Error('timeout')), 1000);
            const onData = (message: string) => {
                if (typeof expected === 'string' ? message.includes(expected) : expected.test(message)) {
                    clearTimeout(timeoutId);
                    resolve();
                }
            };
            messageListener.on('message', onData);
        });
    };
    await session.start();
    const result1 = await runCode(codePath);
    await writeFile(cssPath, [
        '@keyframes foo {0%{color: red}100%{color:green}}',
        '.foo#bar {animation: 2s 1s linear infinite foo}',
    ].join(''));
    await waitForMessage(`written: ${codePath}`);
    const result2 = await runCode(codePath);
    await deleteFile(cssPath);
    await waitForMessage(`deleted: ${codePath}`);
    await t.throwsAsync(async () => {
        await stat(codePath);
    }, {code: 'ENOENT'});
    t.deepEqual(result1.className, result2.className);
    t.deepEqual(result1.id, result2.id);
    t.deepEqual(result1.keyframes, result2.keyframes);
    const nodes1 = result1.root.nodes || [];
    const nodes2 = result2.root.nodes || [];
    {
        const atRule1 = nodes1[0] as postcss.AtRule;
        const atRule2 = nodes2[0] as postcss.AtRule;
        t.is(atRule1.name, 'keyframes');
        t.is(atRule2.name, 'keyframes');
        t.is(atRule1.params, result1.keyframes.foo);
        t.is(atRule1.params, result1.keyframes.foo);
    }
    {
        const rule1 = nodes1[1] as postcss.Rule;
        const rule2 = nodes2[1] as postcss.Rule;
        t.is(rule1.selector, `.${result1.className.foo}#${result1.id.bar}`);
        t.is(rule2.selector, `.${result1.className.foo}#${result1.id.bar}`);
        const declarations1 = (rule1.nodes || []) as Array<postcss.Declaration>;
        const declarations2 = (rule2.nodes || []) as Array<postcss.Declaration>;
        t.is(declarations1.length, 1);
        t.is(declarations1[0].prop, 'animation');
        t.is(declarations2.length, 1);
        t.is(declarations2[0].prop, 'animation');
        t.deepEqual(
            parseAnimationShorthand(declarations1[0].value),
            parseAnimationShorthand(`1s 0.5s linear infinite ${result1.keyframes.foo}`),
        );
        t.deepEqual(
            parseAnimationShorthand(declarations2[0].value),
            parseAnimationShorthand(`2s 1s linear infinite ${result1.keyframes.foo}`),
        );
    }
});
