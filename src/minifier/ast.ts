import * as acorn from 'acorn';
import {IProgram, IObjectExpression, IArrayExpression} from './walker';

export const isProgramNode = (
    node: acorn.Node,
): node is IProgram => node.type === 'Program';

export const isObjectExpression = (
    node: acorn.Node,
): node is IObjectExpression => node.type === 'ObjectExpression';

export const isArrayExpression = (
    node: acorn.Node,
): node is IArrayExpression => node.type === 'ArrayExpression';
