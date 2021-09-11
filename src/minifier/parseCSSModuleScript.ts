import * as acorn from 'acorn';
import * as acornWalk from './walker';
import type {ParseResult, CSSRange, Range} from './types';
import {extractCSSFromArrayExpression} from './extractCSSFromArrayExpression';

export const parseCSSModuleScript = (
    props: {
        code: string,
        cssKey: string,
        ecmaVersion?: 3 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020,
    },
): ParseResult => {
    const ranges: Array<CSSRange> = [];
    const importDeclarations: Array<Range> = [];
    const expressionStatements: Array<Range> = [];
    const ast = acorn.parse(
        props.code,
        {
            sourceType: 'module',
            ecmaVersion: props.ecmaVersion || 11,
        },
    );
    acornWalk.simple(ast, {
        ImportDeclaration: ({start, end}) => {
            importDeclarations.push({start, end});
        },
        ExpressionStatement: (statement) => {
            const {expression, start, end} = statement;
            if (expression.callee) {
                const {length} = ranges;
                for (const argument of expression.arguments) {
                    ranges.push(...extractCSSFromArrayExpression(argument, props.cssKey));
                }
                if (length < ranges.length) {
                    expressionStatements.push({start, end});
                }
            }
        },
    });
    return {
        ranges,
        expressionStatements,
        importDeclarations,
    };
};
