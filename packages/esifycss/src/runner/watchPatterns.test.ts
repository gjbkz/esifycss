import * as assert from 'node:assert/strict';
import * as fs from 'node:fs';
import {tmpdir} from 'node:os';
import * as path from 'node:path';
import {Writable} from 'node:stream';
import {test, type TestContext} from 'node:test';
import {setTimeout as delay} from 'node:timers/promises';
import {Session} from './Session';
import type {SessionOptions} from './types';

const fixture = async (t: TestContext) => {
    const directory = await fs.promises.mkdtemp(path.join(tmpdir(), 'esifycss patterns-'));
    let session: Session | undefined;
    t.after(async () => {
        await session?.stop();
        await fs.promises.rm(directory, {recursive: true, force: true});
    });
    const file = (name: string) => path.join(directory, name);
    const write = async (name: string, css = '.foo{color:red}') => {
        const destination = file(name);
        await fs.promises.mkdir(path.dirname(destination), {recursive: true});
        await fs.promises.writeFile(`${destination}.tmp`, css);
        await fs.promises.rename(`${destination}.tmp`, destination);
    };
    const start = async (options: SessionOptions = {}) => {
        const sink = new Writable({write(_chunk, _encoding, callback) { callback(); }});
        session = new Session({
            include: directory,
            helper: file('helper.js'),
            stdout: sink,
            stderr: sink,
            ...options,
        });
        await session.start();
    };
    return {file, write, start, directory};
};

test('include globs support braces, extglobs, hidden files, and multiple patterns', async (t) => {
    const {file, write, start} = await fixture(t);
    for (const name of ['styles/a.css', 'styles/.hidden.css', 'extra/deep/b.css', 'second.css', 'themes/dark/theme.css', 'themes/other/no.css', 'styles/no.txt', 'outside/no.css']) {
        await write(name);
    }
    await start({include: [file('{styles,extra}/**/*.css'), file('themes/@(dark|light)/*.css'), file('second.css')]});
    for (const name of ['styles/a.css', 'styles/.hidden.css', 'extra/deep/b.css', 'themes/dark/theme.css', 'second.css']) {
        assert.ok(fs.existsSync(file(`${name}.js`)), name);
    }
    assert.ok(!fs.existsSync(file('styles/no.txt.js')));
    assert.ok(!fs.existsSync(file('outside/no.css.js')));
    assert.ok(!fs.existsSync(file('themes/other/no.css.js')));
});

test('exclusions preserve glob, directory, regex, callback, and ignored options', async (t) => {
    const {file, write, start} = await fixture(t);
    const excluded = ['styles/no.css', 'styles/folder/drop.css', 'styles/regex.css',
        'styles/callback.css', 'styles/negative.css', 'styles/option.css'];
    for (const name of ['styles/keep.css', ...excluded]) await write(name);
    let receivedStats = false;
    await start({
        include: [file('styles/**/*.css'), `!${file('styles/negative.css')}`],
        exclude: [file('styles/folder') + path.sep, /regex\.css$/, (name: string, stats?: fs.Stats) => {
            if (path.basename(name) !== 'callback.css') return false;
            receivedStats ||= Boolean(stats?.isFile());
            return Boolean(stats?.isFile());
        }],
        chokidar: {ignored: ['**/no.css', file('styles/option.css')]},
    });
    assert.ok(fs.existsSync(file('styles/keep.css.js')));
    for (const name of excluded) assert.ok(!fs.existsSync(file(`${name}.js`)), name);
    assert.ok(receivedStats);
});

test('negative exclusion patterns keep explicitly included files', async (t) => {
    const {file, write, start} = await fixture(t);
    await write('keep.css');
    await write('skip.css');
    await start({exclude: [file('**/*.css'), `!${file('keep.css')}`]});
    assert.ok(fs.existsSync(file('keep.css.js')));
    assert.ok(!fs.existsSync(file('skip.css.js')));
});

test('cwd and custom extensions resolve matching files correctly', async (t) => {
    const {file, write, start, directory} = await fixture(t);
    await write('styles/a.scss');
    await write('styles/no.css');
    await write('styles/excluded.scss');
    await start({
        include: 'styles',
        extensions: ['.scss'],
        exclude: 'styles/excluded.scss',
        chokidar: {cwd: directory},
    });
    assert.ok(fs.existsSync(file('styles/a.scss.js')));
    assert.ok(!fs.existsSync(file('styles/no.css.js')));
    assert.ok(!fs.existsSync(file('styles/excluded.scss.js')));
});

test('disableGlobbing treats metacharacters in file names literally', async (t) => {
    const {file, write, start} = await fixture(t);
    await write('literal[1].css');
    await write('literal1.css');
    await start({include: file('literal[1].css'), chokidar: {disableGlobbing: true, depth: 0}});
    assert.ok(fs.existsSync(file('literal[1].css.js')));
    assert.ok(!fs.existsSync(file('literal1.css.js')));
});

test('watch depth limits directory traversal', async (t) => {
    const {file, write, start} = await fixture(t);
    await write('styles/root.css');
    await write('styles/deep/nested.css');
    await start({include: file('styles'), chokidar: {depth: 0}});
    assert.ok(fs.existsSync(file('styles/root.css.js')));
    assert.ok(!fs.existsSync(file('styles/deep/nested.css.js')));
});

test('watch discovers new directories and handles add, change, and unlink', {timeout: 10000}, async (t) => {
    const {file, write, start} = await fixture(t);
    await start({include: file('future/**/*.css'), watch: true});
    const generated = file('future/deep/new.css.js');
    const waitFor = async (ready: () => Promise<boolean>) => {
        const deadline = Date.now() + 5000;
        while (Date.now() < deadline) {
            if (await ready()) return;
            await delay(20);
        }
        assert.fail('Timed out waiting for the generated module');
    };
    const hasColor = async (color: string) => fs.existsSync(generated)
        && (await fs.promises.readFile(generated, 'utf8')).includes(`color:${color}`);
    await write('staged/deep/new.css');
    await fs.promises.rename(file('staged'), file('future'));
    await waitFor(() => hasColor('red'));
    await write('future/deep/second.css', '.second{color:purple}');
    await waitFor(async () => fs.existsSync(file('future/deep/second.css.js'))
        && (await fs.promises.readFile(file('future/deep/second.css.js'), 'utf8')).includes('color:purple'));
    await write('future/deep/new.css', '.foo{color:blue}');
    await waitFor(() => hasColor('blue'));
    await fs.promises.unlink(file('future/deep/new.css'));
    await waitFor(async () => !fs.existsSync(generated));
});

test('depth stays relative to each include root when a directory is created later', {timeout: 10000}, async (t) => {
    const {file, write, start} = await fixture(t);
    await write('present/root.css');
    await write('present/deep/skipped.css');
    await start({
        include: [file('present/**/*.css'), file('future/**/*.css')],
        chokidar: {depth: 0},
        watch: true,
    });
    assert.ok(fs.existsSync(file('present/root.css.js')));
    assert.ok(!fs.existsSync(file('present/deep/skipped.css.js')));
    await write('staged/deep/skipped.css');
    await write('staged/root.css');
    await fs.promises.rename(file('staged'), file('future'));
    const deadline = Date.now() + 5000;
    while (!fs.existsSync(file('future/root.css.js'))) {
        assert.ok(Date.now() < deadline, 'Timed out waiting for future/root.css');
        await delay(20);
    }
    assert.ok(!fs.existsSync(file('future/deep/skipped.css.js')));
});
