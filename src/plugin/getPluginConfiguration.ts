import {
    IPluginParameter,
    IPluginConfiguration,
    IPluginOutput,
    IPluginMangler,
} from './types';

export const getPluginOutput = (
    output: IPluginParameter['output'],
): IPluginOutput => {
    if (typeof output === 'string') {
        return async (_roots): Promise<void> => {
        };
    }
    if (typeof output === 'function') {
        return output;
    }
    return (): void => {};
};

export const getPluginMangler = (
    _mangle?: boolean,
): IPluginMangler => (
    id: string,
    className: string,
): string => `_${id}_${className}`;

export const getPluginConfiguration = (
    parameters: IPluginParameter = {},
): IPluginConfiguration => ({
    output: getPluginOutput(parameters.output),
    mangler: parameters.mangler || getPluginMangler(parameters.mangle),
});
