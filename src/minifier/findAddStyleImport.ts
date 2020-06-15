import * as path from 'path';
import * as acorn from 'acorn';
import {IImportDeclaration, IVariableDeclaration, IFunctionDeclaration} from './walker';
import {isProgramNode} from './ast';

export const normalizeHelperId = (
    id: string,
) => path.normalize(id).replace(/\.ts$/, '');

export const findAddStyleImport = (
    ast: acorn.Node,
    helperId: string,
    localName?: string,
): {name: string, node: IImportDeclaration | IVariableDeclaration | IFunctionDeclaration} => {
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
    if (localName) {
        for (const node of ast.body) {
            switch (node.type) {
            case 'VariableDeclaration': {
                const {declarations} = node;
                if (declarations.length === 1 && declarations[0].id.name === localName) {
                    return {name: localName, node};
                }
                break;
            }
            case 'FunctionDeclaration':
                if (node.id.name === localName) {
                    return {name: localName, node};
                }
                break;
            default:
            }
        }
    }
    throw new Error('NoAddStyle');
};
