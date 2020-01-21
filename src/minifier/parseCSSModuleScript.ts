import * as acorn from 'acorn';
import * as acornWalk from 'acorn-walk';
import * as dynamicImport from 'acorn-dynamic-import';
import {IParseResult, ICSSRange, IRange} from './types';
import {extractCSSFromArrayExpression} from './extractCSSFromArrayExpression';
import {findAddStyleImport} from './findAddStyleImport';
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
    const addStyle = findAddStyleImport(ast, 'addStyle');
    acornWalk.simple(ast, {
        ExpressionStatement: (statement) => {
            const {expression} = statement;
            if (expression.callee.name === addStyle.name) {
                for (const argument of expression.arguments) {
                    ranges.push(...extractCSSFromArrayExpression(argument, props.cssKey));
                }
                statements.push({start: statement.start, end: statement.end});
            }
        },
    });
    return {
        ranges,
        addStyle: {start: addStyle.node.start, end: addStyle.node.end},
        statements,
    };
};
