import type {Node} from 'acorn';
import type {IProgram, IObjectExpression, IArrayExpression} from './walker';

export const isProgramNode = (node: Node): node is IProgram => node.type === 'Program';
export const isObjectExpression = (node: Node): node is IObjectExpression => node.type === 'ObjectExpression';
export const isArrayExpression = (node: Node): node is IArrayExpression => node.type === 'ArrayExpression';
