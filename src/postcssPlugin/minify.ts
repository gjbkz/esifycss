import {Root} from 'postcss';

export const minify = (
    root: Root,
): Root => {
    Object.assign(root.raws, {semicolon: false, after: ''});
    root.walk((node) => {
        switch (node.type) {
        case 'comment':
            node.remove();
            break;
        case 'atrule':
            if (node.name === 'charset') {
                /**
                 * https://www.w3.org/TR/CSS2/syndata.html#x57
                 * > User agents must ignore any @charset rule not at the beginning of the style sheet.
                 * https://www.w3.org/TR/css-syntax-3/#charset-rule
                 * > However, there is no actual at-rule named @charset.
                 */
                node.remove();
            } else {
                Object.assign(node.raws, {before: '', between: '', afterName: ' '});
            }
            break;
        case 'rule':
            node.selector = node.selector
            .replace(/\s+/g, ' ')
            .replace(/\s*([,>~+])\s*/g, '$1')
            .trim();
            Object.assign(node.raws, {before: '', between: '', semicolon: false, after: '', ownSemicolon: ''});
            break;
        case 'decl': {
            Object.assign(node.raws, {before: '', between: ':', semicolon: true, after: '', ownSemicolon: ''});
            const value = node.raws.value as {raw: string, value: string} | undefined;
            if (value) {
                value.raw = value.value;
            }
            break;
        }
        default:
        }
    });
    return root;
};
