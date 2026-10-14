import * as console from 'console';
import type * as postcss from 'postcss';
import * as animationParser from '@hookun/parse-animation-shorthand';
import type {EsifyCSSResult, Imports, PluginMangler} from './types';
import {getMatchedImport} from './getMatchedImport';

export const transformDeclarations = (
    {root, transformResult, mangler, imports, rawPrefix}: {
        root: postcss.Root,
        transformResult: EsifyCSSResult,
        mangler: PluginMangler,
        imports: Imports,
        rawPrefix: string,
    },
): void => {
    const getRenamed = (name: string): string | undefined => {
        if (name.startsWith(rawPrefix)) {
            return name.slice(rawPrefix.length);
        }
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
            const animations: Array<string> = [];
            try {
                for (const animation of animationParser.parse(declaration.value)) {
                    const renamed = getRenamed(animation.name);
                    if (renamed) {
                        animation.name = renamed;
                    }
                    animations.push(animationParser.serialize(animation));
                }
            } catch (error: unknown) {
                console.error(error);
            }
            declaration.value = animations.join(',');
        }
    });
};
