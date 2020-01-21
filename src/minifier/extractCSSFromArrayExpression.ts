import * as acornWalk from 'acorn-walk';
import {isArrayExpression, isObjectExpression} from './ast';
import {ICSSRange} from './types';

export const extractCSSFromArrayExpression = (
    node: acornWalk.INode,
    cssKey: string,
): Array<ICSSRange> => {
    if (!isArrayExpression(node)) {
        throw new Error(`NotAnArray: ${node.type}`);
    }
    const result: Array<ICSSRange> = [];
    for (const item of node.elements) {
        if (!isObjectExpression(item)) {
            throw new Error(`InvalidElement: ${item.type}`);
        }
        const {properties} = item;
        if (properties.length !== 1) {
            throw new Error(`UnexpectedMultipleProperty: ${JSON.stringify(properties, null, 2)}`);
        }
        const [{key, value}] = properties;
        if (key.name !== cssKey) {
            throw new Error(`InvalidKey: ${JSON.stringify(key)}`);
        }
        if (typeof value !== 'object' || value.type !== 'Literal') {
            throw new Error(`NonLiteral: ${JSON.stringify(value)}`);
        }
        const css = value.value;
        if (typeof css === 'string') {
            result.push({css, start: item.start, end: item.end});
        } else {
            throw new Error(`InvalidCSSType: ${JSON.stringify(css)}`);
        }
    }
    return result;
};
