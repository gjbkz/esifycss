import * as path from 'path';
import * as postcss from 'postcss';
import {IEsifyCSSResult} from '../postcssPlugin/types';

export const generateScript = (
    /**
     * Returns a (TypeScript-compatible) JavaScript code that exports className,
     * id, keyframes. The script contains addStyle(...) lines that insert CSS rules
     * to the document.
     */
    props: {
        /** The destination of the output. The relative path to the helper script is calculated from this value. */
        output: string,
        /** Path to the helperScript which is required to get a relative path to the helper script. */
        helper: string | null,
        /** The main contents of the output script. */
        result: IEsifyCSSResult,
        /** The root node will be splitted into rules that can be passed to insertRule. */
        root?: postcss.Root,
    },
): string => {
    if (!props.root) {
        throw new Error(`No root: ${props.root}`);
    }
    const lines = [
        `export const className = ${JSON.stringify(props.result.className, null, 4)};`,
        `export const id = ${JSON.stringify(props.result.id, null, 4)};`,
        `export const keyframes = ${JSON.stringify(props.result.keyframes, null, 4)};`,
    ];
    if (props.helper) {
        const helperPath = path.relative(path.dirname(props.output), props.helper)
        .replace(/\.ts$/, '')
        .replace(/^([^./])/, './$1')
        .split(path.sep).join('/');
        lines.unshift(
            `import {addStyle} from '${helperPath}';`,
            `addStyle([${(props.root.nodes || []).map((node) => `{esifycss: ${JSON.stringify(node.toString())}}`).join(',')}]);`,
        );
    } else {
        lines.unshift(
            `[${(props.root.nodes || []).map((node) => `{esifycss: ${JSON.stringify(node.toString())}}`).join(',')}];`,
        );
    }
    lines.push('');
    return lines.join('\n');
};
