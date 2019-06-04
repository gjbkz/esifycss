import * as postcss from 'postcss';
import {IEsifyCSSResult} from '../postcssPlugin/types';
import {pluginName} from '../postcssPlugin/plugin';

export const extractPluginResult = (
    postcssResult: postcss.Result,
): IEsifyCSSResult => {
    const pluginResult: IEsifyCSSResult = {
        class: {},
        id: {},
        keyframes: {},
    };
    for (const warning of postcssResult.warnings()) {
        if (warning.plugin === pluginName) {
            const result = JSON.parse(warning.text) as IEsifyCSSResult;
            Object.assign(pluginResult.class, result.class);
            Object.assign(pluginResult.id, result.id);
            Object.assign(pluginResult.keyframes, result.keyframes);
        }
    }
    return pluginResult;
};
