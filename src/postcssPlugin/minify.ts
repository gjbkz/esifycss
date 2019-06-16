import * as postcss from 'postcss';

export const minify = (
    root: postcss.Root,
) => {
    root.walk((node) => {
        switch (node.type) {
        case 'atrule':
        case 'rule':
            node.raws.before = node.raws.between = node.raws.after = '';
            break;
        case 'decl':
            node.raws.before = node.raws.after = '';
            node.raws.between = ':';
            break;
        case 'comment':
            node.remove();
            break;
        default:
        }
    });
};
