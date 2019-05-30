import {IEsifyCSSResult} from '../postcssPlugin/types';

export const generateScript = (
    result: IEsifyCSSResult,
    css: string,
): string => [
    'import {addStyle} from \'esifycss/dom\';',
    `addStyle(${JSON.stringify(css)});`,
    `export const className = ${JSON.stringify(result.class, null, 4)};`,
    `export const id = ${JSON.stringify(result.id, null, 4)};`,
    `export const keyframes = ${JSON.stringify(result.keyframes, null, 4)};`,
    '',
].join('\n');
