import * as postcss from 'postcss';

interface INodeRaws extends postcss.NodeRaws {
    value?: {
        value: string,
        raw: string,
    },
}

export const removeSpaces = ({raws}: {raws: INodeRaws}) => {
    if (raws.before) {
        raws.before = raws.before.trim();
    }
    if (raws.after) {
        raws.after = raws.after.trim();
    }
    if (raws.between) {
        raws.between = raws.between.trim();
    }
    if (raws.afterName) {
        raws.afterName = ' ';
    }
    if (raws.left) {
        raws.left = raws.left.trim();
    }
    if (raws.right) {
        raws.right = raws.right.trim();
    }
    if (raws.important) {
        raws.important = raws.important.trim();
    }
    if (raws.semicolon) {
        raws.semicolon = false;
    }
    if (raws.value) {
        raws.value.raw = raws.value.value;
    }
};

export const minify = (
    root: postcss.Root,
) => {
    root.walkComments((comment) => comment.remove());
    removeSpaces(root);
    root.walk(removeSpaces);
};
