import * as postcss from 'postcss';
import {IEsifyCSSResult, IImports, IPluginMangler} from './types';

export const mangleKeyFrames = (
    {id, root, mangler}: {
        id: string,
        root: postcss.Root,
        mangler: IPluginMangler,
        imports: IImports,
    },
): IEsifyCSSResult['keyframes'] => {
    const keyframes: IEsifyCSSResult['keyframes'] = {};
    root.walkAtRules((rule) => {
        const {name} = rule;
        if (name === 'keyframes') {
            const {params: value} = rule;
            const after = mangler(id, name, value);
            rule.params = keyframes[value] = after;
        }
    });
    return keyframes;
};
