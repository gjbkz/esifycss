import * as events from 'events';
import * as fs from 'fs';
import * as path from 'path';
import * as stream from 'stream';
import * as animationParser from '@hookun/parse-animation-shorthand';
import type {ExecutionContext, TestFn} from 'ava';
import anyTest from 'ava';
import * as postcss from 'postcss';
import * as scss from 'postcss-scss';
import {deleteFile} from '..';
import {createTemporaryDirectory} from '../util/createTemporaryDirectory';
import type {RunCodeResult} from '../util/runCode.for-test';
import {runCode} from '../util/runCode.for-test';
import {updateFile} from '../util/updateFile';
import {Session} from './Session';
import type {SessionOptions} from './types';

interface TestContext {
    directory: string,
    session?: Session,
}

const test = anyTest as TestFn<TestContext>;
const isRule = (input: postcss.ChildNode): input is postcss.Rule => input.type === 'rule';
const createMessageListener = () => {
    const messageListener = new events.EventEmitter();
    const waitForMessage = async (
        expected: RegExp | string,
    ) => await new Promise<void>((resolve, reject) => {
        const timeoutId = setTimeout(() => reject(new Error(`Timeout: waiting ${expected}`)), 1000);
        const onData = (message: string) => {
            if (typeof expected === 'string' ? message.includes(expected) : expected.test(message)) {
                clearTimeout(timeoutId);
                messageListener.removeListener('message', onData);
                resolve();
            }
        };
        messageListener.on('message', onData);
    });
    return {messageListener, waitForMessage};
};

test.beforeEach(async (t) => {
    t.context.directory = await createTemporaryDirectory();
});

test.afterEach(async (t) => {
    if (t.context.session) {
        await t.context.session.stop();
    }
});

interface Test {
    parameters: Partial<SessionOptions>,
    files: Array<{
        path: string,
        content: Array<string>,
        test: (
            t: ExecutionContext<TestContext>,
            result: RunCodeResult,
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
                    '.foo {color: red}',
                ],
                test: (t, {className, id, keyframes, root}) => {
                    t.deepEqual(Object.keys(id), []);
                    t.deepEqual(Object.keys(className), ['foo']);
                    t.deepEqual(Object.keys(keyframes), []);
                    const [ruleNode, anotherNode] = root.nodes as Array<postcss.Rule>;
                    t.falsy(anotherNode);
                    t.like(ruleNode, {
                        type: 'rule',
                        selector: `.${className.foo}`,
                    });
                    const [declaration, anotherDeclaration] = ruleNode.nodes;
                    t.falsy(anotherDeclaration);
                    t.like(declaration, {
                        type: 'decl',
                        prop: 'color',
                        value: 'red',
                    });
                },
            },
        ],
    },
    {
        parameters: {},
        files: [
            {
                path: '/components/style.css',
                content: [
                    '@charset "UTF-8";',
                    '.foo {color: blue}',
                ],
                test: (t, {className, id, keyframes, root}) => {
                    t.deepEqual(Object.keys(id), []);
                    t.deepEqual(Object.keys(className), ['foo']);
                    t.deepEqual(Object.keys(keyframes), []);
                    const [ruleNode, anotherNode] = root.nodes as Array<postcss.Rule>;
                    t.falsy(anotherNode);
                    t.like(ruleNode, {
                        type: 'rule',
                        selector: `.${className.foo}`,
                    });
                    const [declaration, anotherDeclaration] = ruleNode.nodes;
                    t.falsy(anotherDeclaration);
                    t.like(declaration, {
                        type: 'decl',
                        prop: 'color',
                        value: 'blue',
                    });
                },
            },
        ],
    },
    {
        parameters: {},
        files: [
            {
                path: '/components/style.css',
                content: [
                    '@keyframes foo {0%{color: red}100%{color:green}}',
                    '@keyframes bar {0%{color: red}100%{color:green}}',
                    '.foo#bar {animation: 1s 0.5s linear infinite foo, 1s 0.5s ease 5 bar}',
                ],
                test: (t, {className, id, keyframes, root}) => {
                    t.deepEqual(Object.keys(id), ['bar']);
                    t.deepEqual(Object.keys(className), ['foo']);
                    t.deepEqual(Object.keys(keyframes), ['foo', 'bar']);
                    t.is(root.nodes.length, 3);
                    t.like(root.nodes[0], {
                        type: 'atrule',
                        name: 'keyframes',
                        params: keyframes.foo,
                    });
                    t.like(root.nodes[1], {
                        type: 'atrule',
                        name: 'keyframes',
                        params: keyframes.bar,
                    });
                    {
                        const node = root.nodes[2] as postcss.Rule;
                        t.like(node, {
                            type: 'rule',
                            selector: `.${className.foo}#${id.bar}`,
                        });
                        const declarations = node.nodes as Array<postcss.Declaration>;
                        t.is(declarations.length, 1);
                        t.is(declarations[0].prop, 'animation');
                        t.deepEqual(
                            animationParser.parse(declarations[0].value),
                            animationParser.parse([
                                `1s 0.5s linear infinite ${keyframes.foo}`,
                                `1s 0.5s ease 5 ${keyframes.bar}`,
                            ].join(',')),
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
] as Array<Test>).forEach(({parameters, files}, index) => {
    test.serial(`#${index}`, async (t) => {
        await Promise.all(files.map(async (file) => {
            const filePath = path.join(t.context.directory, file.path);
            await updateFile(filePath, file.content.join('\n'));
        }));
        const helper = path.join(t.context.directory, 'helper.js');
        const writable = new stream.Writable({
            write(chunk, _encoding, callback) {
                t.log(`${chunk}`.trim());
                callback();
            },
        });
        const session = t.context.session = new Session({
            ...parameters,
            include: t.context.directory,
            helper,
            watch: false,
            stdout: writable,
            stderr: writable,
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

test('ignore output even if it is covered by the "include" pattern.', async (t) => {
    const files = [
        {
            path: 'input1.css',
            content: [
                '.a1 {color: a1; width: 10%}',
                '.b1 {color: b1; width: 20%}',
            ],
        },
        {
            path: 'input2.css',
            content: [
                '@charset "utf-8";',
                '.a2 {color: a2; width: 30%}',
                '.b2 {color: b2; width: 40%}',
            ],
        },
    ];
    await Promise.all(files.map(async (file) => {
        await updateFile(
            path.join(t.context.directory, file.path),
            file.content.join('\n'),
        );
    }));
    const cssPath = path.join(t.context.directory, 'output.css');
    const writable = new stream.Writable({
        write(chunk, _encoding, callback) {
            t.log(`${chunk}`.trim());
            callback();
        },
    });
    const session = t.context.session = new Session({
        css: cssPath,
        include: t.context.directory,
        watch: false,
        stdout: writable,
        stderr: writable,
    });
    await session.start();
    await t.throwsAsync(async () => {
        await fs.promises.stat(`${cssPath}.js`);
    }, {code: 'ENOENT'});
    /** this call may include the output */
    await session.start();
    await t.throwsAsync(async () => {
        await fs.promises.stat(`${cssPath}.js`);
    }, {code: 'ENOENT'});
    const outputScriptPath1 = path.join(t.context.directory, 'input1.css.js');
    const outputScript1 = await fs.promises.readFile(outputScriptPath1, 'utf-8');
    t.log(`==== outputScript1 ====\n${outputScript1.trim()}\n===================`);
    t.false(outputScript1.includes('addStyle'));
    const result1 = await runCode(outputScriptPath1);
    t.deepEqual(result1.className, {
        a1: '_0',
        b1: '_1',
    });
    const outputScriptPath2 = path.join(t.context.directory, 'input2.css.js');
    const outputScript2 = await fs.promises.readFile(outputScriptPath2, 'utf-8');
    t.log(`==== outputScript2 ====\n${outputScript2.trim()}\n===================`);
    t.false(outputScript2.includes('addStyle'));
    const result2 = await runCode(outputScriptPath2);
    t.deepEqual(result2.className, {
        a2: '_2',
        b2: '_3',
    });
    const resultCSS = await fs.promises.readFile(cssPath, 'utf8');
    t.log(`==== resultCSS ====\n${resultCSS}\n===================`);
    const root = postcss.parse(resultCSS);
    t.log(root.toJSON());
    t.truthy(root.nodes.find((node) => isRule(node) && node.selector === `.${result1.className.a1}`));
    t.truthy(root.nodes.find((node) => isRule(node) && node.selector === `.${result1.className.b1}`));
    t.truthy(root.nodes.find((node) => isRule(node) && node.selector === `.${result2.className.a2}`));
    t.truthy(root.nodes.find((node) => isRule(node) && node.selector === `.${result2.className.b2}`));
});

test('watch', async (t) => {
    const cssPath = path.join(t.context.directory, '/components/style.css');
    const helper = path.join(t.context.directory, 'helper.js');
    const codePath = `${cssPath}${path.extname(helper)}`;
    const {messageListener, waitForMessage} = createMessageListener();
    const writable = new stream.Writable({
        write(chunk, _encoding, callback) {
            const message = `${chunk}`.trim();
            messageListener.emit('message', message);
            t.log(message);
            callback();
        },
    });
    t.context.session = new Session({
        helper,
        watch: true,
        include: t.context.directory,
        stdout: writable,
        stderr: writable,
    });
    await updateFile(cssPath, [
        '@keyframes foo {0%{color:gold}100%{color:green}}',
        '.foo#bar {animation: 1s 0.5s linear infinite foo}',
    ].join(''));
    t.context.session.start().catch(t.fail);
    await waitForMessage(`written: ${codePath}`);
    const result1 = await runCode(codePath);
    await updateFile(cssPath, [
        '@keyframes foo {0%{color:gold}100%{color:green}}',
        '.foo#bar {animation: 2s 1s linear infinite foo}',
    ].join(''));
    await waitForMessage(`written: ${codePath}`);
    const result2 = await runCode(codePath);
    await deleteFile(cssPath);
    await waitForMessage(`deleted: ${codePath}`);
    await t.throwsAsync(async () => await fs.promises.stat(codePath), {code: 'ENOENT'});
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
        t.is(atRule1.params, `${result1.keyframes.foo}`);
        t.is(atRule1.params, `${result1.keyframes.foo}`);
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
            animationParser.parse(declarations1[0].value),
            animationParser.parse(`1s 0.5s linear infinite ${result1.keyframes.foo}`),
        );
        t.deepEqual(
            animationParser.parse(declarations2[0].value),
            animationParser.parse(`2s 1s linear infinite ${result1.keyframes.foo}`),
        );
    }
});

test('watch-css', async (t) => {
    const cssPath1 = path.join(t.context.directory, '/components/style1.css');
    const cssPath2 = path.join(t.context.directory, '/components/style2.css');
    const cssOutputPath = path.join(t.context.directory, 'output.css');
    const {messageListener, waitForMessage} = createMessageListener();
    const writable = new stream.Writable({
        write(chunk, _encoding, callback) {
            const message = `${chunk}`.trim();
            messageListener.emit('message', message);
            t.log(message);
            callback();
        },
    });
    t.context.session = new Session({
        css: cssOutputPath,
        watch: true,
        include: t.context.directory,
        stdout: writable,
        stderr: writable,
    });
    await updateFile(cssPath1, [
        '@keyframes foo1 {0%{color:gold}100%{color:green}}',
        '.foo1#bar {animation: 1s 0.5s linear infinite foo1}',
    ].join(''));
    await updateFile(cssPath2, [
        '@keyframes foo2 {0%{color:gold}100%{color:pink}}',
        '.foo2#bar {animation: 1s 0.5s linear infinite foo2}',
    ].join(''));
    await t.context.session.start().catch(t.fail);
    const outputCss1 = await fs.promises.readFile(cssOutputPath, 'utf-8');
    t.log('outputCss1', outputCss1);
    t.true(outputCss1.includes('color:green'));
    t.true(outputCss1.includes('color:pink'));
    const root1 = postcss.parse(outputCss1);
    t.is(root1.nodes.length, 4);
    await updateFile(cssPath1, [
        '@keyframes bar1 {0%{color:gold}100%{color:blue}}',
        '.bar1#bar {animation: 2s 1s linear infinite bar1}',
    ].join(''));
    await waitForMessage(`written: ${cssOutputPath}`);
    const outputCss2 = await fs.promises.readFile(cssOutputPath, 'utf-8');
    t.log('outputCss2', outputCss2);
    t.false(outputCss2.includes('color:green'));
    t.true(outputCss2.includes('color:blue'));
    t.true(outputCss2.includes('color:pink'));
    const root2 = postcss.parse(outputCss2);
    t.is(root2.nodes.length, 4);
    await updateFile(cssPath2, [
        '@keyframes bar2 {0%{color:gold}100%{color:red}}',
        '.bar2#bar {animation: 1s 0.5s linear infinite bar2}',
    ].join(''));
    await waitForMessage(`written: ${cssOutputPath}`);
    const outputCss3 = await fs.promises.readFile(cssOutputPath, 'utf-8');
    t.log('outputCss3', outputCss3);
    t.false(outputCss3.includes('color:green'));
    t.false(outputCss3.includes('color:pink'));
    t.true(outputCss3.includes('color:blue'));
    t.true(outputCss3.includes('color:red'));
    const root3 = postcss.parse(outputCss3);
    t.is(root3.nodes.length, 4);
});
