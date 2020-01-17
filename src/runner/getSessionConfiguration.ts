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

export const getOutputOption = (
    {helper, css}: ISessionOptions,
    include: Array<string>,
): ISessionConfiguration['output'] => {
    let output: ISessionOutput | undefined;
    if (css) {
        if (helper) {
            throw new Error(`You can't use options.helper (${helper}) with options.css (${css})`);
        }
        output = {type: 'css', path: css};
    } else {
        const scriptPath = helper || `helper.${getHash(include.join(','))}.css.js`;
        output = {type: 'script', path: scriptPath};
    }
    return output;
};

export const getExtensionOption = (
    parameters: ISessionOptions,
    output: ISessionConfiguration['output'],
): string => {
    let {ext} = parameters;
    if (!ext) {
        if (output.type === 'script') {
            ext = path.extname(output.path);
        }
        if (!ext) {
            ext = '.js';
        }
    }
    return ext;
};

export const getSessionConfiguration = (
    parameters: ISessionOptions,
): ISessionConfiguration => {
    const include = ensureArray(parameters.include || '*');
    const output = getOutputOption(parameters, include);
    return {
        watch: Boolean(parameters.watch),
        output,
        path: include,
        extensions: new Set(parameters.extensions || ['.css']),
        ext: getExtensionOption(parameters, output),
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
