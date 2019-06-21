import * as path from 'path';
import {ISessionConfiguration, ISessionParameters} from './types';
import {plugin} from '../postcssPlugin/plugin';
import {ensureArray} from '../util/ensureArray';
import {getHash} from '../util/getHash';

export const getSessionConfiguration = (
    parameters: ISessionParameters,
): ISessionConfiguration => {
    const include = ensureArray(parameters.include || '**/*.css');
    const helper = parameters.helper || `helper.${getHash(include.join(','))}.css.js`;
    if (!path.extname(helper)) {
        throw new Error(`helper should have an extension (e.g. ".js", ".ts"): ${helper}`);
    }
    return {
        watch: Boolean(parameters.watch),
        helper,
        ext: path.extname(helper),
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
        postcssPlugins: [
            ...ensureArray(parameters.postcssPlugins),
            plugin(parameters.esifycssPluginParameter || {}),
        ],
    };
};
