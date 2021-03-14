import type {
    IPluginOptions,
    IPluginConfiguration,
    IPluginMangler,
} from './types';
import {createIdentifier} from '../util/createIdentifier';

export const getPluginMangler = (
    {
        mangle = true,
        identifier = createIdentifier(),
    }: IPluginOptions,
): IPluginMangler => {
    if (mangle) {
        return (id, type, name) => `_${identifier(`${id}-${type}-${name}`).toString(36)}`;
    } else {
        return (id, type, name) => `${name}_${identifier(`${id}-${type}-${name}`).toString(36)}`;
    }
};

export const getPluginConfiguration = (
    parameters: IPluginOptions = {},
): IPluginConfiguration => ({
    mangler: parameters.mangler || getPluginMangler(parameters),
    rawPrefix: parameters.rawPrefix || 'raw-',
});
