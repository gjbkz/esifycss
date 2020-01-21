import * as acorn from 'acorn';
import * as acornWalk from 'acorn-walk';

export const isProgramNode = (
    node: acorn.Node,
): node is acornWalk.IProgram => node.type === 'Program';

export const isObjectExpression = (
    node: acorn.Node,
): node is acornWalk.IObjectExpression => node.type === 'ObjectExpression';

export const isArrayExpression = (
    node: acorn.Node,
): node is acornWalk.IArrayExpression => node.type === 'ArrayExpression';
