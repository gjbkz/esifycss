import * as acorn from 'acorn';
import * as acornWalk from 'acorn-walk';
import {isProgramNode} from './ast';

export const findAddStyleImport = (
    ast: acorn.Node,
    importName: string,
): {name: string, node: acornWalk.IImportDeclaration} => {
    if (!isProgramNode(ast)) {
        throw new Error('InvalidNode');
    }
    for (const node of ast.body) {
        if (node.type === 'ImportDeclaration') {
            const {specifiers = []} = node;
            const addStyleSpecifier = specifiers.find(({imported}) => imported.name === importName);
            if (addStyleSpecifier) {
                return {name: addStyleSpecifier.local.name, node};
            }
        }
    }
    throw new Error('NoAddStyle');
};
