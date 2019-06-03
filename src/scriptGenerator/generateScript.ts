import * as path from 'path';
import * as postcss from 'postcss';
import {IEsifyCSSResult} from '../postcssPlugin/types';
import {IHelperScript} from './types';

export const generateScript = (
    dest: string,
    helperScript: IHelperScript,
    result: IEsifyCSSResult,
    root?: postcss.Root,
): string => {
    if (!root) {
        throw new Error(`No root: ${root}`);
    }
    const helperScriptPath = helperScript.path
    .replace(/\.ts$/, '')
    .replace(/\/index$/, '');
    return [
        `import {addStyle} from '${path.relative(path.dirname(dest), helperScriptPath).replace(/^([^./])/, './$1')}';`,
        ...(root.nodes || []).map((node) => `addStyle(/* begin(css) */${JSON.stringify(node.toString())}/* end(css) */);`),
        `export const className = ${JSON.stringify(result.class, null, 4)};`,
        `export const id = ${JSON.stringify(result.id, null, 4)};`,
        `export const keyframes = ${JSON.stringify(result.keyframes, null, 4)};`,
        '',
    ].join('\n');
};
