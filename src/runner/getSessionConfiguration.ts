import * as path from 'path';
import {ISessionConfiguration, ISessionParameters} from './types';
import {ensureArray} from '../util/ensureArray';
import {getHash} from '../util/getHash';

export const getSessionConfiguration = (
    parameters: ISessionParameters,
): ISessionConfiguration => {
    if (!path.extname(parameters.output)) {
        throw new Error(`output should have an extension (e.g. ".js", ".ts"): ${parameters.output}`);
    }
    const include = ensureArray(parameters.include);
    const output = parameters.output || `helper.${getHash(include.join(','))}.css.js`;
    return {
        watch: Boolean(parameters.watch),
        output,
        ext: path.extname(output),
        path: include,
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
