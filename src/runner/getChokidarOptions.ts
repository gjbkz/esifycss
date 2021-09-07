import type {WatchOptions} from 'chokidar';
import type {ISessionOptions, IReadonlyWatchOptions} from './types';
import {ensureArray} from '../util/ensureArray';

export const getChokidarOptions = (
    {chokidar: chokidarOptions = {}, exclude}: ISessionOptions,
): IReadonlyWatchOptions => {
    const options: WatchOptions = {
        ...chokidarOptions,
        ignoreInitial: false,
        alwaysStat: true,
    };
    const ignored = [
        ...ensureArray(chokidarOptions.ignored as Array<string>),
        ...ensureArray(exclude),
    ];
    if (0 < ignored.length) {
        options.ignored = ignored;
    }
    return options;
};
