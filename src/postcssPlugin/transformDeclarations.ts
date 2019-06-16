import * as postcss from 'postcss';
import {IEsifyCSSResult, IImports, IPluginMangler} from './types';
import {parseAnimationShorthand} from '../parser/parseAnimationShorthand';
import {serializeCSSAnimationShorthand} from '../parser/serializeAnimationShorthand';
import {getMatchedImport} from './getMatchedImport';

export const transformDeclarations = (
    {root, transformResult, mangler, imports}: {
        root: postcss.Root,
        transformResult: IEsifyCSSResult,
        mangler: IPluginMangler,
        imports: IImports,
    },
): void => {
    const getRenamed = (name: string): string | undefined => {
        const imported = getMatchedImport(name, imports);
        if (imported) {
            return mangler(imported.from, 'keyframes', imported.key);
        }
        return transformResult.keyframes[name];
    };
    root.walkDecls((declaration) => {
        const {prop} = declaration;
        if (prop === 'animation-name') {
            const renamed = getRenamed(declaration.value);
            if (renamed) {
                declaration.value = renamed;
            }
        } else if (prop === 'animation') {
            const animation = parseAnimationShorthand(declaration.value);
            const renamed = getRenamed(animation.name);
            if (renamed) {
                animation.name = renamed;
                declaration.value = serializeCSSAnimationShorthand(animation);
            }
        }
    });
};
