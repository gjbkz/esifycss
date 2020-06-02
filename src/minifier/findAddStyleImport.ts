import * as path from 'path';
import * as acorn from 'acorn';
import {IImportDeclaration} from './walker';
import {isProgramNode} from './ast';

export const normalizeHelperId = (
    id: string,
) => path.normalize(id).replace(/\.ts$/, '');

export const findAddStyleImport = (
    ast: acorn.Node,
    helperId: string,
): {name: string, node: IImportDeclaration} => {
    if (!isProgramNode(ast)) {
        throw new Error('InvalidNode');
    }
    for (const node of ast.body) {
        if (node.type === 'ImportDeclaration') {
            if (normalizeHelperId(node.source.value) === normalizeHelperId(helperId)) {
                const {specifiers = []} = node;
                if (specifiers.length === 1) {
                    return {name: specifiers[0].local.name, node};
                }
            }
        }
    }
    throw new Error('NoAddStyle');
};
