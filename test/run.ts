import test from 'ava';
import * as path from 'path';
import * as fs from 'fs';
import * as childProcess from 'child_process';
import * as stream from 'stream';

export interface ISpawnParameters {
    command: string,
    args?: Array<string>,
    options?: childProcess.SpawnOptionsWithoutStdio,
    stdout?: stream.Writable,
    stderr?: stream.Writable,
}

const spawn = (
    parameters: ISpawnParameters,
): Promise<void> => new Promise((resolve, reject) => {
    const subProcess = childProcess.spawn(
        parameters.command,
        parameters.args || [],
        parameters.options || {},
    )
    .once('error', reject)
    .once('exit', (code) => {
        if (code === 0) {
            resolve();
        } else {
            reject(new Error(`The command "${parameters.command}" exited with code ${code}.`));
        }
    });
    if (subProcess.stdout) {
        subProcess.stdout.pipe(parameters.stdout || process.stdout);
    }
    if (subProcess.stderr) {
        subProcess.stderr.pipe(parameters.stderr || process.stderr);
    }
});

const testDirectories = fs.readdirSync(__dirname)
.map((name) => path.join(__dirname, name))
.filter((filePath) => {
    try {
        return fs.statSync(path.join(filePath, 'pacakge.json')).isFile();
    } catch (error) {
        return false;
    }
});

for (const testDirectory of testDirectories) {
    test(path.basename(testDirectory), async (t) => {
        const options: childProcess.SpawnOptionsWithoutStdio = {
            cwd: testDirectory,
            shell: true,
        };
        await spawn({command: 'npm install', options});
        await spawn({command: 'npm run build', options});
        t.is(typeof options, 'object');
    });
}
