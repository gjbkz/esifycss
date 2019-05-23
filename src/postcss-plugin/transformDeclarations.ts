import * as postcss from 'postcss';
import {IEsifyCSSResult} from './types';

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
            console.log(declaration);
        }
    });
};
