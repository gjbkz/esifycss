import {ISessionOptions, IReadonlyWatchOptions} from './types';
import {ensureArray} from '../util/ensureArray';

export const getChokidarOptions = (
    parameters: ISessionOptions,
): IReadonlyWatchOptions => ({
    useFsEvents: false,
    ...parameters.chokidar,
    ignored: [
        ...ensureArray(parameters.chokidar && parameters.chokidar.ignored),
        ...ensureArray(parameters.exclude),
    ],
    ignoreInitial: false,
});
