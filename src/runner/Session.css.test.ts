import * as path from 'path';
import * as postcss from 'postcss';
import anyTest, {TestInterface} from 'ava';
import {writeFile, readFile} from '../util/fs';
import {Session} from './Session';
import {createTemporaryDirectory} from '../util/createTemporaryDirectory';
import {runCode} from '../util/runCode.for-test';

interface ITestContext {
    directory: string,
    session?: Session,
}

const test = anyTest as TestInterface<ITestContext>;
const isRule = (input: postcss.ChildNode): input is postcss.Rule => input.type === 'rule';

test.beforeEach(async (t) => {
    t.context.directory = await createTemporaryDirectory();
});

test.afterEach(async (t) => {
    if (t.context.session) {
        await t.context.session.stop();
    }
});

test('#css', async (t) => {
    const files = [
        {
            path: 'input1.css',
            content: [
                '.a1 {color: a1}',
                '.b1 {color: b1}',
            ],
        },
        {
            path: 'input2.css',
            content: [
                '@charset "utf-8";',
                '.a2 {color: a2}',
                '.b2 {color: b2}',
            ],
        },
    ];
    await Promise.all(files.map(async (file) => {
        await writeFile(
            path.join(t.context.directory, file.path),
            file.content.join('\n'),
        );
    }));
    const cssPath = path.join(t.context.directory, 'output.css');
    const session = t.context.session = new Session({
        css: cssPath,
        include: t.context.directory,
        watch: false,
    });
    await session.start();
    const result1 = await runCode(path.join(t.context.directory, 'input1.css.js'));
    t.deepEqual(result1.className, {
        a1: '_0',
        b1: '_1',
    });
    const result2 = await runCode(path.join(t.context.directory, 'input2.css.js'));
    t.deepEqual(result2.className, {
        a2: '_2',
        b2: '_3',
    });
    const resultCSS = await readFile(cssPath, 'utf8');
    t.log(`==== resultCSS ====\n${resultCSS}\n===================`);
    const root = postcss.parse(resultCSS);
    t.log(root.toJSON());
    t.truthy(root.nodes.find((node) => isRule(node) && node.selector === `.${result1.className.a1}`));
    t.truthy(root.nodes.find((node) => isRule(node) && node.selector === `.${result1.className.b1}`));
    t.truthy(root.nodes.find((node) => isRule(node) && node.selector === `.${result2.className.a2}`));
    t.truthy(root.nodes.find((node) => isRule(node) && node.selector === `.${result2.className.b2}`));
});
