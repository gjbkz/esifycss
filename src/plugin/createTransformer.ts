import postcss = require('postcss');
import {IPluginParameter} from './types';
import {getPluginConfiguration} from './getPluginConfiguration';

export const createTransformer = (
    parameters: IPluginParameter,
): postcss.Transformer => {
    const {
        output,
        mangler,
    } = getPluginConfiguration(parameters);
    return async (
        root: postcss.Root,
        result: postcss.Result,
    ): Promise<void> => {

    };
};
