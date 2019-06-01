import * as path from 'path';
import {ISessionConfiguration, ISessionParameters} from './types';
import {ensureArray} from '../util/ensureArray';

export const getSessionConfiguration = (
    parameters: ISessionParameters,
): ISessionConfiguration => {
    if (!path.extname(parameters.output)) {
        throw new Error(`output should have an extension (e.g. ".js", ".ts"): ${parameters.output}`);
    }
    return {
        watch: Boolean(parameters.watch),
        output: parameters.output,
        path: ensureArray(parameters.include),
        chokidar: {
            ...parameters.chokidar,
            ignored: [
                ...ensureArray(parameters.chokidar && parameters.chokidar.ignored),
                ...ensureArray(parameters.exclude),
            ],
            ignoreInitial: false,
            useFsEvents: false,
        },
        stdout: parameters.stdout || process.stdout,
        stderr: parameters.stderr || process.stderr,
        pluginParameters: parameters.pluginParameters || {},
    };
};
