import type {WatchOptions} from 'chokidar';
import {ensureArray} from '../util/ensureArray';
import type {SessionOptions, ReadonlyWatchOptions} from './types';

export const getChokidarOptions = (
    {chokidar: chokidarOptions = {}, exclude, css}: SessionOptions,
): ReadonlyWatchOptions => {
    const options: WatchOptions = {
        ...chokidarOptions,
        ignoreInitial: false,
        alwaysStat: true,
    };
    const ignored = [
        ...ensureArray(chokidarOptions.ignored as Array<string>),
        ...ensureArray(exclude),
    ];
    if (css) {
        ignored.push(css);
    }
    if (0 < ignored.length) {
        options.ignored = ignored;
    }
    return options;
};
