import * as acorn from 'acorn';
import * as acornWalk from './walker';
import * as dynamicImport from 'acorn-dynamic-import';
import {IParseResult, ICSSRange, IRange} from './types';
import {extractCSSFromArrayExpression} from './extractCSSFromArrayExpression';
const Parser = acorn.Parser.extend(dynamicImport.default || dynamicImport);
acornWalk.base[dynamicImport.DynamicImportKey] = () => {
    // noop
};

export const parseCSSModuleScript = (
    props: {
        code: string,
        cssKey: string,
    },
): IParseResult => {
    const ranges: Array<ICSSRange> = [];
    const statements: Array<IRange> = [];
    const ast = Parser.parse(props.code, {sourceType: 'module'});
    acornWalk.simple(ast, {
        ExpressionStatement: (statement) => {
            const {expression} = statement;
            if (expression.callee) {
                for (const argument of expression.arguments) {
                    ranges.push(...extractCSSFromArrayExpression(argument, props.cssKey));
                }
                statements.push({start: statement.start, end: statement.end});
            }
        },
    });
    return {
        ranges,
        statements,
    };
};
