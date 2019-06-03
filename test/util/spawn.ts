import * as childProcess from 'child_process';
import {ISpawnParameters} from './types';

export const spawn = (
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
