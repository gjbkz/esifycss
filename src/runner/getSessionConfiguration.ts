import * as path from 'path';
import {ISessionConfiguration, ISessionParameters} from './types';
import {ensureArray} from '../util/ensureArray';

export const getSessionConfiguration = (
    {
        output,
        include,
        exclude,
        chokidar = {},
        watch = false,
        stdout = process.stdout,
        stderr = process.stderr,
        pluginParameters = {},
    }: ISessionParameters,
): ISessionConfiguration => {
    if (!path.extname(output)) {
        throw new Error(`output should have an extension (e.g. ".js", ".ts"): ${output}`);
    }
    return {
        watch,
        output,
        path: ensureArray(include),
        chokidar: {
            ...chokidar,
            ignored: [
                ...ensureArray(chokidar.ignored),
                ...ensureArray(exclude),
            ],
            ignoreInitial: false,
        },
        stdout,
        stderr,
        pluginParameters,
    };
};
