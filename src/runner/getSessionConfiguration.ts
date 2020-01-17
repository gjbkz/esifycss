import {ISessionConfiguration, ISessionOptions} from './types';
import {plugin} from '../postcssPlugin/plugin';
import {ensureArray} from '../util/ensureArray';
import {getChokidarOptions} from './getChokidarOptions';
import {getOutputOption} from './getOutputOption';
import {getExtensionOption} from './getExtensionOption';

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
