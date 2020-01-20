import * as acorn from 'acorn';
import * as acornWalk from 'acorn-walk';

export const removeAddStyle = (
    code: string,
): string => {
    const ast = acorn.parse(code, {sourceType: 'module', ecmaVersion: 2020});
    const statementsToBeDeleted: Array<{start: number, end: number}> = [];
    const expressionStatements: Array<[string, acornWalk.INode]> = [];
    let addStyleName = '';
    acornWalk.simple(ast, {
        ImportDeclaration: (node: acornWalk.IImportDeclaration) => {
            const {specifiers = []} = node;
            const addStyleSpecifier = specifiers.find(({imported}) => imported.name === 'addStyle');
            if (addStyleSpecifier) {
                addStyleName = addStyleSpecifier.local.name;
                statementsToBeDeleted.push(node);
                // a bit weak...
            }
        },
        ExpressionStatement: (node) => {
            expressionStatements.push([node.expression.callee.name, node]);
        },
    });
    for (const [functionName, expressionStatement] of expressionStatements) {
        if (functionName === addStyleName) {
            statementsToBeDeleted.push(expressionStatement);
        }
    }
    return statementsToBeDeleted.sort(({start: start1}, {start: start2}) => start1 < start2 ? 1 : -1)
    .reduce(
        (code, {start, end}) => `${code.slice(0, start)}${code.slice(end)}`,
        code,
    );
};
