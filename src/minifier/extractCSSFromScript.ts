import * as acorn from 'acorn';
import * as acornWalk from 'acorn-walk';
import * as dynamicImport from 'acorn-dynamic-import';
import {IParseResult} from './types';
const Parser = acorn.Parser.extend(dynamicImport.default || dynamicImport);
acornWalk.base[dynamicImport.DynamicImportKey] = () => {
    // noop
};

export const extractCSSFromObjectExpression = (
    objectExpression: acornWalk.IObjectExpression,
    cssKey: string,
): string | null => {
    const {properties} = objectExpression;
    if (properties.length === 1) {
        const [{key, value}] = properties;
        if (key.type === 'Identifier' && key.name === cssKey && typeof value === 'object' && value.type === 'Literal') {
            const css = value.value;
            return typeof css === 'string' ? css : null;
        }
    }
    return null;
};

export const extractCSSFromScript = (
    props: {
        code: string,
        cssKey: string,
    },
): Array<IParseResult> => {
    const ranges: Array<IParseResult> = [];
    const ast = Parser.parse(props.code, {sourceType: 'module'});
    acornWalk.simple(ast, {
        ObjectExpression: (objectExpression) => {
            const css = extractCSSFromObjectExpression(objectExpression, props.cssKey);
            if (css) {
                ranges.push({css, start: objectExpression.start, end: objectExpression.end});
            }
        },
    });
    return ranges;
};
