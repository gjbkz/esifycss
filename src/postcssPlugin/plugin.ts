import type {Plugin, Root} from 'postcss';
import type {PluginOptions} from './types';
import {getPluginConfiguration} from './getPluginConfiguration';
import {createTransformer} from './createTransformer';

export const PluginName = 'esifycss';

/**
 * PostCSS plugin for EsifyCSS
 */
export const plugin = Object.assign(
    (props?: PluginOptions): Plugin => {
        const transform = createTransformer(getPluginConfiguration(props));
        const cache = new WeakMap<Root, string>();
        return {
            postcssPlugin: PluginName,
            Root: async (root, {result}) => {
                let cached = cache.get(root);
                if (!cached) {
                    cached = JSON.stringify(await transform(root, result));
                    cache.set(root, cached);
                }
                result.warn(cached);
            },
        };
    },
    {postcss: true},
);
