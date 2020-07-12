import * as postcss from 'postcss';

interface INodeRaws extends postcss.NodeRaws {
    value?: {
        value: string,
        raw: string,
    },
    ownSemicolon?: string,
}

export const minify = (
    root: postcss.Root,
): postcss.Root => {
    Object.assign(root.raws, {semicolon: false, after: ''});
    root.walk((node) => {
        switch (node.type) {
        case 'comment':
            node.remove();
            break;
        case 'atrule':
            Object.assign(node.raws, {before: '', between: '', afterName: ' '});
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
            const {value} = node.raws as INodeRaws;
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
