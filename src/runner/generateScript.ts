import * as path from 'path';
import type * as postcss from 'postcss';
import type {EsifyCSSResult} from '../postcssPlugin/types';

export const generateScript = function* (
    /**
     * Returns a (TypeScript-compatible) JavaScript code that exports className,
     * id, keyframes. The script contains addStyle(...) lines that insert CSS rules
     * to the document.
     */
    {output, helper, result, root, cssKey}: {
        /** The destination of the output. The relative path to the helper script is calculated from this value. */
        output: string,
        /** Path to the helperScript which is required to get a relative path to the helper script. */
        helper: string,
        /** The main contents of the output script. */
        result: EsifyCSSResult,
        /** The root node will be splitted into rules that can be passed to insertRule. */
        root: postcss.Root,
        cssKey: string,
    },
): Generator<string> {
    let helperPath = path.relative(path.dirname(output), helper);
    helperPath = helperPath && helperPath.replace(/\.ts$/, '');
    if (!path.isAbsolute(helperPath)) {
        helperPath = `./${path.normalize(helperPath)}`.replace(/^\.\/\.\./, '..');
    }
    yield `import {addStyle} from '${helperPath.split(path.sep).join('/')}';`;
    yield `addStyle([${root.nodes.map((node) => {
        let css = node.toString();
        css = css.endsWith('}') ? css : `${css};`;
        return `{${cssKey}: ${JSON.stringify(css)}}`;
    }).join(',')}]);`;
    yield `export const className = ${JSON.stringify(result.className, null, 4)};`;
    yield `export const id = ${JSON.stringify(result.id, null, 4)};`;
    yield `export const keyframes = ${JSON.stringify(result.keyframes, null, 4)};`;
};
