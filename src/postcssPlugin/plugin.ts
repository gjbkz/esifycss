import type {Plugin} from 'postcss';
import type {IPluginOptions} from './types';
import {getPluginConfiguration} from './getPluginConfiguration';
import {createTransformer} from './createTransformer';

export const PluginName = 'esifycss';

/**
 * PostCSS plugin for EsifyCSS
 */
export const plugin = Object.assign(
    (
        props?: IPluginOptions,
    ): Plugin => {
        const transform = createTransformer(getPluginConfiguration(props));
        return {
            postcssPlugin: PluginName,
            Root: async (root, {result}) => {
                result.warn(JSON.stringify(await transform(root, result)));
            },
        };
    },
    {postcss: true},
);
