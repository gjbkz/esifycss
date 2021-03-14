import type * as postcss from 'postcss';
import type {IEsifyCSSResult} from '../postcssPlugin/types';
import {PluginName} from '../postcssPlugin/plugin';

export const extractPluginResult = (
    postcssResult: postcss.Result,
): IEsifyCSSResult => {
    const pluginResult: IEsifyCSSResult = {
        className: {},
        id: {},
        keyframes: {},
    };
    for (const warning of postcssResult.warnings()) {
        if (warning.plugin === PluginName) {
            const result = JSON.parse(warning.text) as IEsifyCSSResult;
            Object.assign(pluginResult.className, result.className);
            Object.assign(pluginResult.id, result.id);
            Object.assign(pluginResult.keyframes, result.keyframes);
        }
    }
    return pluginResult;
};
