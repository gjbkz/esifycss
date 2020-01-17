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
    const {nodes: [rule1, rule2, rule3, rule4, rule5] = []} = postcss.parse(resultCSS);
    t.is(typeof rule5, 'undefined');
    t.is(rule1.type, 'rule');
    if (isRule(rule1)) {
        t.is(rule1.selector, '._0');
    }
    t.is(rule2.type, 'rule');
    if (isRule(rule2)) {
        t.is(rule2.selector, '._1');
    }
    t.is(rule3.type, 'rule');
    if (isRule(rule3)) {
        t.is(rule3.selector, '._2');
    }
    t.is(rule4.type, 'rule');
    if (isRule(rule4)) {
        t.is(rule4.selector, '._3');
    }
});
