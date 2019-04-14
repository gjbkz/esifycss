import {ISessionConfiguration, ISessionParameters} from './types';
import {ensureArray} from '../util/ensureArray';

export const getSessionConfiguration = (
    {
        include,
        exclude,
        chokidar = {},
        watch = false,
        stdout = process.stdout,
        stderr = process.stderr,
    }: ISessionParameters,
): ISessionConfiguration => ({
    watch,
    path: ensureArray(include),
    chokidar: {
        ...chokidar,
        ignored: [
            ...ensureArray(chokidar.ignored),
            ...ensureArray(exclude),
        ],
    },
    stdout,
    stderr,
});
