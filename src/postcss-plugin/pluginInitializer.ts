import * as postcss from 'postcss';
import {IPluginParameter} from './types';
import {getPluginConfiguration} from './getPluginConfiguration';

export const pluginInitializer: postcss.PluginInitializer<IPluginParameter> = (parameters?: IPluginParameter) => {
    const {
        output,
        mangler,
    } = getPluginConfiguration(parameters);
    return async (
        root: postcss.Root,
        result: postcss.Result,
    ): Promise<void> => {
        await process.stdout.write(JSON.stringify({output, mangler}, null, 2));
        await process.stdout.write(JSON.stringify({root, result}, null, 2));
    };
};
