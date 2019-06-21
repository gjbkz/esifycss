import * as postcss from 'postcss';
import {IPluginOptions} from './types';
import {getPluginConfiguration} from './getPluginConfiguration';
import {createTransformer} from './createTransformer';

/**
 * PostCSS plugin for EsifyCSS
 */
export const pluginName = 'esifycss';
export const plugin = postcss.plugin(
    pluginName,
    (parameters?: IPluginOptions) => {
        const transform = createTransformer(getPluginConfiguration(parameters));
        return async (
            root: postcss.Root,
            result: postcss.Result,
        ): Promise<void> => {
            result.warn(JSON.stringify(await transform(root, result)));
        };
    },
);
