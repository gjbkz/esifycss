import * as assert from 'node:assert/strict';
import {spawn, spawnSync} from 'node:child_process';
import {once} from 'node:events';
import * as fs from 'node:fs';
import {tmpdir} from 'node:os';
import * as path from 'node:path';
import {test, type TestContext} from 'node:test';
import {setTimeout as delay} from 'node:timers/promises';
import {version} from '../../package.json';

const cli = path.resolve('lib/bin/esifycss.js');
const run = (args: Array<string>, cwd?: string) => {
    const result = spawnSync(process.execPath, [cli, ...args], {
        cwd,
        encoding: 'utf8',
        timeout: 10000,
    });
    assert.ifError(result.error);
    return result;
};
const createDirectory = (t: TestContext): string => {
    const directory = fs.mkdtempSync(path.join(tmpdir(), 'esifycss cli-'));
    t.after(() => fs.rmSync(directory, {recursive: true, force: true}));
    return directory;
};

test('CLI prints help and the package version', () => {
    const help = run(['--help']);
    assert.strictEqual(help.status, 0, help.stderr);
    for (const flag of ['--helper', '--css', '--ext', '--config', '--exclude', '--noMangle', '--watch']) {
        assert.ok(help.stdout.includes(flag), flag);
    }
    const result = run(['--version']);
    assert.strictEqual(result.status, 0, result.stderr);
    assert.strictEqual(result.stdout.trim(), version);
});

test('CLI rejects missing inputs and unknown options', () => {
    const missing = run([]);
    assert.strictEqual(missing.status, 1);
    assert.match(missing.stderr, /missing required argument/);
    const unknown = run(['--unknown']);
    assert.strictEqual(unknown.status, 1);
    assert.match(unknown.stderr, /unknown option/);
});

test('CLI accepts multiple inputs, helper, extension, and noMangle', (t) => {
    const directory = createDirectory(t);
    fs.writeFileSync(path.join(directory, 'first.css'), '.first{color:red}');
    fs.writeFileSync(path.join(directory, 'second.css'), '.second{color:blue}');
    const result = run(['first.css', 'second.css', '--helper', 'helper.ts', '--ext', '.js', '--noMangle'], directory);
    assert.strictEqual(result.status, 0, result.stderr);
    assert.ok(fs.existsSync(path.join(directory, 'helper.ts')));
    assert.match(fs.readFileSync(path.join(directory, 'first.css.js'), 'utf8'), /"first":\s*"first_\d+"/);
    assert.match(fs.readFileSync(path.join(directory, 'second.css.js'), 'utf8'), /"second":\s*"second_\d+"/);
});

test('CLI loads relative configuration and excludes input files', (t) => {
    const directory = createDirectory(t);
    fs.mkdirSync(path.join(directory, 'input'));
    fs.writeFileSync(path.join(directory, 'input', 'keep.css'), '.keep{color:red}');
    fs.writeFileSync(path.join(directory, 'input', 'skip.css'), '.skip{color:blue}');
    fs.writeFileSync(path.join(directory, 'config.json'), JSON.stringify({
        helper: 'configured.ts',
        ext: '.ts',
        esifycssPluginParameter: {mangle: false},
    }));
    const result = run(['input', '--helper', 'overridden.js', '--config', 'config.json', '--exclude', 'input/skip.css'], directory);
    assert.strictEqual(result.status, 0, result.stderr);
    assert.ok(fs.existsSync(path.join(directory, 'configured.ts')));
    assert.ok(!fs.existsSync(path.join(directory, 'overridden.js')));
    assert.ok(!fs.existsSync(path.join(directory, 'input', 'skip.css.ts')));
    assert.match(fs.readFileSync(path.join(directory, 'input', 'keep.css.ts'), 'utf8'), /"keep":\s*"keep_\d+"/);
});

test('CLI extracts CSS to the requested output', (t) => {
    const directory = createDirectory(t);
    fs.writeFileSync(path.join(directory, 'style.css'), '.foo{color:red}');
    const result = run(['style.css', '--css', 'output.css'], directory);
    assert.strictEqual(result.status, 0, result.stderr);
    assert.match(fs.readFileSync(path.join(directory, 'output.css'), 'utf8'), /color:red/);
    assert.doesNotMatch(fs.readFileSync(path.join(directory, 'style.css.js'), 'utf8'), /addStyle/);
});

test('CLI rejects conflicting CSS and helper outputs', (t) => {
    const directory = createDirectory(t);
    fs.writeFileSync(path.join(directory, 'style.css'), '.foo{color:red}');
    const result = run(['style.css', '--helper', 'helper.js', '--css', 'output.css'], directory);
    assert.strictEqual(result.status, 1);
    assert.match(result.stderr, /can't use options.helper/);
});

test('CLI watch keeps running and updates generated modules', async (t) => {
    const directory = fs.mkdtempSync(path.join(tmpdir(), 'esifycss cli-'));
    fs.writeFileSync(path.join(directory, 'style.css'), '.foo{color:red}');
    const child = spawn(process.execPath, [cli, 'style.css', '--watch', '--helper', 'helper.js'], {
        cwd: directory,
        stdio: ['ignore', 'ignore', 'pipe'],
    });
    let errors = '';
    child.stderr.on('data', (chunk) => { errors += String(chunk); });
    t.after(async () => {
        if (child.exitCode === null && child.signalCode === null) {
            const exited = once(child, 'exit');
            child.kill();
            await exited;
        }
        fs.rmSync(directory, {recursive: true, force: true});
    });
    await once(child, 'spawn');
    const waitForColor = async (color: string) => {
        const file = path.join(directory, 'style.css.js');
        const deadline = Date.now() + 5000;
        while (Date.now() < deadline) {
            assert.strictEqual(child.exitCode, null, errors);
            if (fs.existsSync(file) && fs.readFileSync(file, 'utf8').includes(`color:${color}`)) {
                return;
            }
            await delay(20);
        }
        assert.fail(`Timed out waiting for ${color}: ${errors}`);
    };
    await waitForColor('red');
    const temporary = path.join(directory, 'style.css.tmp');
    fs.writeFileSync(temporary, '.foo{color:blue}');
    fs.renameSync(temporary, path.join(directory, 'style.css'));
    await waitForColor('blue');
});
