import * as postcss from 'postcss';
import {IEsifyCSSResult} from './types';
import {parseAnimationShorthand} from '../parser/parseAnimationShorthand';
import {serializeCSSAnimationShorthand} from '../parser/serializeAnimationShorthand';

export const transformDeclarations = (
    root: postcss.Root,
    transformResult: IEsifyCSSResult,
): void => {
    root.walkDecls((declaration) => {
        const {prop} = declaration;
        if (prop === 'animation-name') {
            const renamed = transformResult.keyframes[declaration.value];
            if (renamed) {
                declaration.value = renamed;
            }
        } else if (prop === 'animation') {
            const animation = parseAnimationShorthand(declaration.value);
            const renamed = transformResult.keyframes[animation.name];
            if (renamed) {
                animation.name = renamed;
                declaration.value = serializeCSSAnimationShorthand(animation);
            }
        }
    });
};
