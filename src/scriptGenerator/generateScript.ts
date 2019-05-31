import {IEsifyCSSResult} from '../postcssPlugin/types';
import {IHelperScript} from './types';

export const generateScript = (
    helperScript: IHelperScript,
    result: IEsifyCSSResult,
    css: string,
): string => {
    const helperScriptPath = helperScript.path
    .replace(/\.ts$/, '')
    .replace(/\/index$/, '');
    return [
        `import {addStyle} from '${helperScriptPath}';`,
        `addStyle(${JSON.stringify(css)});`,
        `export const className = ${JSON.stringify(result.class, null, 4)};`,
        `export const id = ${JSON.stringify(result.id, null, 4)};`,
        `export const keyframes = ${JSON.stringify(result.keyframes, null, 4)};`,
        '',
    ].join('\n');
};
