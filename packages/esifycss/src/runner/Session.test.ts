import * as events from 'events';
import * as fs from 'fs';
import * as path from 'path';
import * as stream from 'stream';
import {setTimeout as delay} from 'node:timers/promises';
import * as animationParser from '@hookun/parse-animation-shorthand';
import {test, type TestContext as NodeTestContext} from 'node:test';
import * as assert from 'node:assert/strict';
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

const createContext = async (t: NodeTestContext): Promise<TestContext> => {
    const context: TestContext = {directory: await createTemporaryDirectory()};
    t.after(async () => {
        await context.session?.stop();
        await fs.promises.rm(context.directory, {recursive: true, force: true});
    });
    return context;
};

interface Test {
    parameters: Partial<SessionOptions>,
    files: Array<{
        path: string,
        content: Array<string>,
        test: (
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
                test: ({className, id, keyframes, root}) => {
                    assert.deepStrictEqual(Object.keys(id), []);
                    assert.deepStrictEqual(Object.keys(className), ['foo']);
                    assert.deepStrictEqual(Object.keys(keyframes), []);
                    const [ruleNode, anotherNode] = root.nodes as Array<postcss.Rule>;
                    assert.ok(!anotherNode);
                    assert.strictEqual(ruleNode.type, 'rule');
                    assert.strictEqual(ruleNode.selector, `.${className.foo}`);
                    const [declaration, anotherDeclaration] = ruleNode.nodes;
                    assert.ok(!anotherDeclaration);
                    assert.strictEqual(declaration.type, 'decl');
                    assert.strictEqual((declaration as postcss.Declaration).prop, 'color');
                    assert.strictEqual((declaration as postcss.Declaration).value, 'red');
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
                test: ({className, id, keyframes, root}) => {
                    assert.deepStrictEqual(Object.keys(id), []);
                    assert.deepStrictEqual(Object.keys(className), ['foo']);
                    assert.deepStrictEqual(Object.keys(keyframes), []);
                    const [ruleNode, anotherNode] = root.nodes as Array<postcss.Rule>;
                    assert.ok(!anotherNode);
                    assert.strictEqual(ruleNode.type, 'rule');
                    assert.strictEqual(ruleNode.selector, `.${className.foo}`);
                    const [declaration, anotherDeclaration] = ruleNode.nodes;
                    assert.ok(!anotherDeclaration);
                    assert.strictEqual(declaration.type, 'decl');
                    assert.strictEqual((declaration as postcss.Declaration).prop, 'color');
                    assert.strictEqual((declaration as postcss.Declaration).value, 'blue');
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
                test: ({className, id, keyframes, root}) => {
                    assert.deepStrictEqual(Object.keys(id), ['bar']);
                    assert.deepStrictEqual(Object.keys(className), ['foo']);
                    assert.deepStrictEqual(Object.keys(keyframes), ['foo', 'bar']);
                    assert.strictEqual(root.nodes.length, 3);
                    assert.strictEqual(root.nodes[0].type, 'atrule');
                    assert.strictEqual((root.nodes[0] as postcss.AtRule).name, 'keyframes');
                    assert.strictEqual((root.nodes[0] as postcss.AtRule).params, keyframes.foo);
                    assert.strictEqual(root.nodes[1].type, 'atrule');
                    assert.strictEqual((root.nodes[1] as postcss.AtRule).name, 'keyframes');
                    assert.strictEqual((root.nodes[1] as postcss.AtRule).params, keyframes.bar);
                    {
                        const node = root.nodes[2] as postcss.Rule;
                        assert.strictEqual(node.type, 'rule');
                        assert.strictEqual(node.selector, `.${className.foo}#${id.bar}`);
                        const declarations = node.nodes as Array<postcss.Declaration>;
                        assert.strictEqual(declarations.length, 1);
                        assert.strictEqual(declarations[0].prop, 'animation');
                        assert.deepStrictEqual(
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
                test: ({className, id, keyframes}) => {
                    assert.deepStrictEqual(Object.keys(id), ['bar']);
                    assert.deepStrictEqual(Object.keys(className), ['foo', 'baz']);
                    assert.deepStrictEqual(Object.keys(keyframes), []);
                },
            },
        ],
    },
] as Array<Test>).forEach(({parameters, files}, index) => {
    test(`#${index}`, async (t) => {
    const context = await createContext(t);
        await Promise.all(files.map(async (file) => {
            const filePath = path.join(context.directory, file.path);
            await updateFile(filePath, file.content.join('\n'));
        }));
        const helper = path.join(context.directory, 'helper.js');
        const writable = new stream.Writable({
            write(chunk, _encoding, callback) {
                console.log(`${chunk}`.trim());
                callback();
            },
        });
        const session = new Session({
            ...parameters,
            include: context.directory,
            helper,
            watch: false,
            stdout: writable,
            stderr: writable,
        });
        context.session = session;
        await session.start();
        const identifiers = new Map<string, string>();
        await Promise.all(files.map(async (file) => {
            const name = `${file.path}${path.extname(helper)}`;
            const result = await runCode(path.join(context.directory, name));
            for (const map of [result.className, result.id, result.keyframes]) {
                for (const [key, value] of Object.entries(map)) {
                    if (value) {
                        assert.strictEqual(identifiers.has(value), false, `${key}: ${value} is conflicted`);
                        identifiers.set(value, key);
                    }
                }
            }
            file.test(result);
        }));
    });
});

test('ignore output even if it is covered by the "include" pattern.', async (t) => {
    const context = await createContext(t);
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
            path.join(context.directory, file.path),
            file.content.join('\n'),
        );
    }));
    const cssPath = path.join(context.directory, 'output.css');
    const writable = new stream.Writable({
        write(chunk, _encoding, callback) {
            console.log(`${chunk}`.trim());
            callback();
        },
    });
    const session = new Session({
        css: cssPath,
        include: context.directory,
        watch: false,
        stdout: writable,
        stderr: writable,
    });
    context.session = session;
    await session.start();
    await assert.rejects(async () => {
        await fs.promises.stat(`${cssPath}.js`);
    }, {code: 'ENOENT'});
    /** this call may include the output */
    await session.start();
    await assert.rejects(async () => {
        await fs.promises.stat(`${cssPath}.js`);
    }, {code: 'ENOENT'});
    const outputScriptPath1 = path.join(context.directory, 'input1.css.js');
    const outputScript1 = await fs.promises.readFile(outputScriptPath1, 'utf-8');
    console.log(`==== outputScript1 ====\n${outputScript1.trim()}\n===================`);
    assert.strictEqual(outputScript1.includes('addStyle'), false);
    const result1 = await runCode(outputScriptPath1);
    assert.deepStrictEqual(result1.className, {
        a1: '_0',
        b1: '_1',
    });
    const outputScriptPath2 = path.join(context.directory, 'input2.css.js');
    const outputScript2 = await fs.promises.readFile(outputScriptPath2, 'utf-8');
    console.log(`==== outputScript2 ====\n${outputScript2.trim()}\n===================`);
    assert.strictEqual(outputScript2.includes('addStyle'), false);
    const result2 = await runCode(outputScriptPath2);
    assert.deepStrictEqual(result2.className, {
        a2: '_2',
        b2: '_3',
    });
    const resultCSS = await fs.promises.readFile(cssPath, 'utf8');
    console.log(`==== resultCSS ====\n${resultCSS}\n===================`);
    const root = postcss.parse(resultCSS);
    console.log(root.toJSON());
    assert.ok(root.nodes.find((node) => isRule(node) && node.selector === `.${result1.className.a1}`));
    assert.ok(root.nodes.find((node) => isRule(node) && node.selector === `.${result1.className.b1}`));
    assert.ok(root.nodes.find((node) => isRule(node) && node.selector === `.${result2.className.a2}`));
    assert.ok(root.nodes.find((node) => isRule(node) && node.selector === `.${result2.className.b2}`));
});

test('watch', async (t) => {
    const context = await createContext(t);
    const cssPath = path.join(context.directory, '/components/style.css');
    const helper = path.join(context.directory, 'helper.js');
    const codePath = `${cssPath}${path.extname(helper)}`;
    const {messageListener, waitForMessage} = createMessageListener();
    const writable = new stream.Writable({
        write(chunk, _encoding, callback) {
            const message = `${chunk}`.trim();
            messageListener.emit('message', message);
            console.log(message);
            callback();
        },
    });
    context.session = new Session({
        helper,
        watch: true,
        include: context.directory,
        stdout: writable,
        stderr: writable,
    });
    await updateFile(cssPath, [
        '@keyframes foo {0%{color:gold}100%{color:green}}',
        '.foo#bar {animation: 1s 0.5s linear infinite foo}',
    ].join(''));
    await context.session.start();
    const result1 = await runCode(codePath);
    const updated = waitForMessage(`written: ${codePath}`);
    await updateFile(cssPath, [
        '@keyframes foo {0%{color:gold}100%{color:green}}',
        '.foo#bar {animation: 2s 1s linear infinite foo}',
    ].join(''));
    await updated;
    const result2 = await runCode(codePath);
    const deleted = waitForMessage(`deleted: ${codePath}`);
    await deleteFile(cssPath);
    await deleted;
    await assert.rejects(async () => await fs.promises.stat(codePath), {code: 'ENOENT'});
    assert.deepStrictEqual(result1.className, result2.className);
    assert.deepStrictEqual(result1.id, result2.id);
    assert.deepStrictEqual(result1.keyframes, result2.keyframes);
    const nodes1 = result1.root.nodes || [];
    const nodes2 = result2.root.nodes || [];
    {
        const atRule1 = nodes1[0] as postcss.AtRule;
        const atRule2 = nodes2[0] as postcss.AtRule;
        assert.strictEqual(atRule1.name, 'keyframes');
        assert.strictEqual(atRule2.name, 'keyframes');
        assert.strictEqual(atRule1.params, `${result1.keyframes.foo}`);
        assert.strictEqual(atRule1.params, `${result1.keyframes.foo}`);
    }
    {
        const rule1 = nodes1[1] as postcss.Rule;
        const rule2 = nodes2[1] as postcss.Rule;
        assert.strictEqual(rule1.selector, `.${result1.className.foo}#${result1.id.bar}`);
        assert.strictEqual(rule2.selector, `.${result1.className.foo}#${result1.id.bar}`);
        const declarations1 = (rule1.nodes || []) as Array<postcss.Declaration>;
        const declarations2 = (rule2.nodes || []) as Array<postcss.Declaration>;
        assert.strictEqual(declarations1.length, 1);
        assert.strictEqual(declarations1[0].prop, 'animation');
        assert.strictEqual(declarations2.length, 1);
        assert.strictEqual(declarations2[0].prop, 'animation');
        assert.deepStrictEqual(
            animationParser.parse(declarations1[0].value),
            animationParser.parse(`1s 0.5s linear infinite ${result1.keyframes.foo}`),
        );
        assert.deepStrictEqual(
            animationParser.parse(declarations2[0].value),
            animationParser.parse(`2s 1s linear infinite ${result1.keyframes.foo}`),
        );
    }
});

test('watch-css', async (t) => {
    const context = await createContext(t);
    const cssPath1 = path.join(context.directory, '/components/style1.css');
    const cssPath2 = path.join(context.directory, '/components/style2.css');
    const cssOutputPath = path.join(context.directory, 'output.css');
    const updateCSS = async (file: string, lines: Array<string>): Promise<void> => {
        // Publish complete fixture contents so watchers cannot read a truncated file.
        const temporary = `${file}.tmp`;
        await updateFile(temporary, lines.join(''));
        await fs.promises.rename(temporary, file);
    };
    const waitForCSS = async (ready: (css: string) => boolean): Promise<string> => {
        const deadline = Date.now() + 5000;
        let css = '';
        while (Date.now() < deadline) {
            css = await fs.promises.readFile(cssOutputPath, 'utf-8');
            if (ready(css)) {
                return css;
            }
            await delay(20);
        }
        assert.fail(`Timed out waiting for expected CSS. Last output: ${css}`);
    };
    const writable = new stream.Writable({
        write(chunk, _encoding, callback) {
            const message = `${chunk}`.trim();
            console.log(message);
            callback();
        },
    });
    context.session = new Session({
        css: cssOutputPath,
        watch: true,
        include: context.directory,
        stdout: writable,
        stderr: writable,
    });
    await updateCSS(cssPath1, [
        '@keyframes foo1 {0%{color:gold}100%{color:green}}',
        '.foo1#bar {animation: 1s 0.5s linear infinite foo1}',
    ]);
    await updateCSS(cssPath2, [
        '@keyframes foo2 {0%{color:gold}100%{color:pink}}',
        '.foo2#bar {animation: 1s 0.5s linear infinite foo2}',
    ]);
    await context.session.start().catch((error: Error) => assert.fail(error));
    const outputCss1 = await waitForCSS((css) => css.includes('color:green') && css.includes('color:pink'));
    console.log('outputCss1', outputCss1);
    assert.strictEqual(outputCss1.includes('color:green'), true);
    assert.strictEqual(outputCss1.includes('color:pink'), true);
    const root1 = postcss.parse(outputCss1);
    assert.strictEqual(root1.nodes.length, 4);
    await updateCSS(cssPath1, [
        '@keyframes bar1 {0%{color:gold}100%{color:blue}}',
        '.bar1#bar {animation: 2s 1s linear infinite bar1}',
    ]);
    const outputCss2 = await waitForCSS((css) => !css.includes('color:green')
        && css.includes('color:blue') && css.includes('color:pink'));
    console.log('outputCss2', outputCss2);
    assert.strictEqual(outputCss2.includes('color:green'), false);
    assert.strictEqual(outputCss2.includes('color:blue'), true);
    assert.strictEqual(outputCss2.includes('color:pink'), true);
    const root2 = postcss.parse(outputCss2);
    assert.strictEqual(root2.nodes.length, 4);
    await updateCSS(cssPath2, [
        '@keyframes bar2 {0%{color:gold}100%{color:red}}',
        '.bar2#bar {animation: 1s 0.5s linear infinite bar2}',
    ]);
    const outputCss3 = await waitForCSS((css) => !css.includes('color:green')
        && !css.includes('color:pink') && css.includes('color:blue') && css.includes('color:red'));
    console.log('outputCss3', outputCss3);
    assert.strictEqual(outputCss3.includes('color:green'), false);
    assert.strictEqual(outputCss3.includes('color:pink'), false);
    assert.strictEqual(outputCss3.includes('color:blue'), true);
    assert.strictEqual(outputCss3.includes('color:red'), true);
    const root3 = postcss.parse(outputCss3);
    assert.strictEqual(root3.nodes.length, 4);
});
