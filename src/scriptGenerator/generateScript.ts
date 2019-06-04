import * as path from 'path';
import * as postcss from 'postcss';
import {IEsifyCSSResult} from '../postcssPlugin/types';
import {IHelperScript} from './types';

/**
 * Returns a (TypeScript-compatible) JavaScript code that exports className,
 * id, keyframes. The script contains addStyle(...) lines that insert CSS rules
 * to the document.
 * @param outputFilePath
 * The destination of the output. The relative path to the helper script is
 * calculated from this value.
 * @param helperScript
 * helperScript.path is required to get a relative path to the helper script.
 * @param esifycssResult
 * The main contents of the output script.
 * @param postcssRoot
 * The root node will be splitted into rules that can be passed to insertRule.
 */
export const generateScript = (
    outputFilePath: string,
    helperScript: IHelperScript,
    esifycssResult: IEsifyCSSResult,
    postcssRoot?: postcss.Root,
): string => {
    if (!postcssRoot) {
        throw new Error(`No root: ${postcssRoot}`);
    }
    const helperScriptPath = helperScript.path
    .replace(/\.ts$/, '')
    .replace(/\/index$/, '');
    return [
        `import {addStyle} from '${path.relative(path.dirname(outputFilePath), helperScriptPath).replace(/^([^./])/, './$1')}';`,
        ...(postcssRoot.nodes || []).map((node) => `addStyle(/* begin(css) */${JSON.stringify(node.toString())}/* end(css) */);`),
        `export const className = ${JSON.stringify(esifycssResult.class, null, 4)};`,
        `export const id = ${JSON.stringify(esifycssResult.id, null, 4)};`,
        `export const keyframes = ${JSON.stringify(esifycssResult.keyframes, null, 4)};`,
        '',
    ].join('\n');
};
