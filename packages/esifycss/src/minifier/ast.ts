import type {Node} from 'acorn';
import type {Program, ObjectExpression, ArrayExpression} from './walker';

export const isProgramNode = (node: Node | null | undefined): node is Program => node?.type === 'Program';
export const isObjectExpression = (node: Node | null | undefined): node is ObjectExpression => node?.type === 'ObjectExpression';
export const isArrayExpression = (node: Node | null | undefined): node is ArrayExpression => node?.type === 'ArrayExpression';
