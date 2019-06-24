import * as path from 'path';
import anyTest, {TestInterface} from 'ava';
import * as stream from 'stream';
import * as events from 'events';
import {ISessionOptions} from './types';
import {writeFile, readFile, deleteFile, stat} from '../util/fs';
import {Session} from './Session';
import {createTemporaryDirectory} from '../util/createTemporaryDirectory';

const test = anyTest as TestInterface<{
    directory: string,
    session?: Session,
}>;

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
        await Promise.all(files.map((file) => writeFile(
            path.join(t.context.directory, file.path),
            file.content.join('\n'),
        )));
        const helper = path.join(t.context.directory, 'helper.js');
        const session = t.context.session = new Session({
            ...parameters,
            helper,
            include: files.map((file) => path.join(t.context.directory, file.path)),
        });
        await session.start();
        await Promise.all(files.map(async (file) => {
            const codePath = path.join(
                t.context.directory,
                `${file.path}${path.extname(helper)}`,
            );
            const code = await readFile(codePath, 'utf8');
            t.truthy(code);
        }));
    });
});

test('#watch', async (t) => {
    const cssPath = path.join(t.context.directory, '/components/style.css');
    const helper = path.join(t.context.directory, 'helper.js');
    const codePath = `${cssPath}${path.extname(helper)}`;
    await writeFile(cssPath, '.foo {color: red}');
    const messageListener = new events.EventEmitter();
    const session = new Session({
        helper,
        watch: true,
        include: [cssPath],
        stdout: new stream.Writable({
            write(chunk, _encoding, callback) {
                messageListener.emit('message', `${chunk}`);
                callback();
            },
        }),
    });
    Object.assign(t.context, {session});
    const waitForMessage = (
        expected: string | RegExp,
    ) => new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => reject(new Error('timeout')), 1000);
        const onData = (message: string) => {
            if (typeof expected === 'string' ? message.includes(expected) : expected.test(message)) {
                clearTimeout(timeoutId);
                resolve();
            }
        };
        messageListener.on('message', onData);
    });
    await session.start();
    const code1 = await readFile(codePath, 'utf8');
    await writeFile(cssPath, '.foo {color: green}');
    await waitForMessage(`written: ${cssPath}`);
    await new Promise((resolve) => setTimeout(resolve, 200));
    const code2 = await readFile(codePath, 'utf8');
    t.true(code1 !== code2);
    await deleteFile(cssPath);
    await waitForMessage(`deleted: ${codePath}`);
    await t.throwsAsync(() => stat(codePath), {code: 'ENOENT'});
});
