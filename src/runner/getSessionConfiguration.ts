import * as path from 'path';
import {ISessionConfiguration, ISessionOptions, IReadonlyWatchOptions, ISessionOutput} from './types';
import {plugin} from '../postcssPlugin/plugin';
import {ensureArray} from '../util/ensureArray';
import {getHash} from '../util/getHash';

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

export const getSessionConfiguration = (
    parameters: ISessionOptions,
): ISessionConfiguration => {
    const include = ensureArray(parameters.include || '*');
    const extensions = new Set(parameters.extensions || ['.css']);
    let {ext} = parameters;
    let output: ISessionOutput | undefined;
    if (parameters.css) {
        if (parameters.helper) {
            throw new Error(`You can't use options.helper (${parameters.helper}) with options.css (${parameters.css})`);
        }
        output = {type: 'css', path: parameters.css};
    } else {
        output = {
            type: 'script',
            path: parameters.helper || `helper.${getHash(include.join(','))}.css.js`,
        };
        if (!path.extname(output.path)) {
            throw new Error(`options.helper should have an extension (e.g. ".js", ".ts"): ${output.path}`);
        }
        ext = path.extname(output.path);
    }
    return {
        watch: Boolean(parameters.watch),
        output,
        extensions,
        ext: ext || '.js',
        path: include,
        chokidar: getChokidarOptions(parameters),
        stdout: parameters.stdout || process.stdout,
        stderr: parameters.stderr || process.stderr,
        postcssPlugins: [
            ...ensureArray(parameters.postcssPlugins),
            plugin(parameters.esifycssPluginParameter || {}),
        ],
        postcssOptions: parameters.postcssOptions || {},
    };
};
