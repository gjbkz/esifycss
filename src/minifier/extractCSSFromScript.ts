import * as acorn from 'acorn';
import * as acornWalk from 'acorn-walk';
import * as dynamicImport from 'acorn-dynamic-import';
import {IParseResult} from './types';
const Parser = acorn.Parser.extend(dynamicImport.default || dynamicImport);
acornWalk.base[dynamicImport.DynamicImportKey] = () => {
    // noop
};

export const extractCSSFromScript = (
    script: string,
): Array<IParseResult> => {
    const results: Array<IParseResult> = [];
    const ast = Parser.parse(script, {sourceType: 'module'});
    acornWalk.simple(ast, {
        ObjectExpression: (node) => {
            const properties = node.properties || [];
            if (properties.length === 1) {
                const property = properties[0];
                const {key} = property;
                if (key && key.type === 'Identifier' && key.name === 'esifycss') {
                    const v = property.value;
                    const css = typeof v === 'object' && v.type === 'Literal' && v.value;
                    if (typeof css === 'string') {
                        results.push({
                            css,
                            start: node.start,
                            end: node.end,
                        });
                    }
                }
            }
        },
    });
    return results;
};
