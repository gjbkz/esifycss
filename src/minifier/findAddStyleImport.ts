import * as path from 'path';
import * as acorn from 'acorn';
import * as acornWalk from 'acorn-walk';
import {isProgramNode} from './ast';

export const findAddStyleImport = (
    ast: acorn.Node,
    helperId: string,
): {name: string, node: acornWalk.IImportDeclaration} => {
    if (!isProgramNode(ast)) {
        throw new Error('InvalidNode');
    }
    for (const node of ast.body) {
        if (node.type === 'ImportDeclaration') {
            if (path.normalize(node.source.value) === path.normalize(helperId)) {
                const {specifiers = []} = node;
                if (specifiers.length === 1) {
                    return {name: specifiers[0].local.name, node};
                }
            }
        }
    }
    throw new Error('NoAddStyle');
};
