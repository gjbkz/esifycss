import * as path from 'path';
import {ISessionConfiguration, ISessionParameters} from './types';
import {plugin} from '../postcssPlugin/plugin';
import {ensureArray} from '../util/ensureArray';
import {getHash} from '../util/getHash';

export const getSessionConfiguration = (
    parameters: ISessionParameters,
): ISessionConfiguration => {
    const include = ensureArray(parameters.include || '**/*.css');
    const output = parameters.output || `helper.${getHash(include.join(','))}.css.js`;
    if (!path.extname(output)) {
        throw new Error(`output should have an extension (e.g. ".js", ".ts"): ${output}`);
    }
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
        postcssPlugins: [
            ...ensureArray(parameters.postcssPlugins),
            plugin(parameters.esifycssPluginParameter || {}),
        ],
        minifyScript: typeof parameters.minifyScript === 'undefined' ? true : Boolean(parameters.minifyScript),
    };
};
