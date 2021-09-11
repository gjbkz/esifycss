import * as path from 'path';
import type * as postcss from 'postcss';
import type {EsifyCSSResult} from '../postcssPlugin/types';

const getCSS = (
    node: postcss.ChildNode,
): string => {
    const css = node.toString();
    return css.endsWith('}') ? css : `${css};`;
};

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
        helper?: string | null,
        /** The main contents of the output script. */
        result: EsifyCSSResult,
        /** The root node will be splitted into rules that can be passed to insertRule. */
        root: postcss.Root,
        cssKey: string,
    },
): Generator<string> {
    if (helper) {
        let helperPath = path.relative(path.dirname(output), helper);
        helperPath = helperPath && helperPath.replace(/\.ts$/, '');
        if (!path.isAbsolute(helperPath)) {
            helperPath = `./${path.normalize(helperPath)}`.replace(/^\.\/\.\./, '..');
        }
        yield `import {addStyle} from '${helperPath.split(path.sep).join('/')}';`;
        yield `addStyle([${root.nodes.map((node) => `{${cssKey}: ${JSON.stringify(getCSS(node))}}`).join(',')}]);`;
    }
    yield `export const className = ${JSON.stringify(result.className, null, 4)};`;
    yield `export const id = ${JSON.stringify(result.id, null, 4)};`;
    yield `export const keyframes = ${JSON.stringify(result.keyframes, null, 4)};`;
};
