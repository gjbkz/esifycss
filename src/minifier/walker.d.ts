import * as acorn from 'acorn';

export type NodeType =
| 'ArrayExpression'
| 'ArrayPattern'
| 'ArrowFunctionExpression'
| 'FunctionDeclaration'
| 'FunctionExpression'
| 'AssignmentExpression'
| 'AssignmentPattern'
| 'BinaryExpression'
| 'LogicalExpression'
| 'AwaitExpression'
| 'RestElement'
| 'ReturnStatement'
| 'SpreadElement'
| 'ThrowStatement'
| 'UnaryExpression'
| 'UpdateExpression'
| 'YieldExpression'
| 'BlockStatement'
| 'ClassBody'
| 'Program'
| 'BreakStatement'
| 'ContinueStatement'
| 'CallExpression'
| 'NewExpression'
| 'CatchClause'
| 'ClassDeclaration'
| 'ClassExpression'
| 'ConditionalExpression'
| 'IfStatement'
| 'DebuggerStatement'
| 'EmptyStatement'
| 'Identifier'
| 'Literal'
| 'MetaProperty'
| 'Super'
| 'TemplateElement'
| 'ThisExpression'
| 'DoWhileStatement'
| 'ExportAllDeclaration'
| 'ExportDefaultDeclaration'
| 'ExportNamedDeclaration'
| 'ExportSpecifier'
| 'ExpressionStatement'
| 'ParenthesizedExpression'
| 'ForInStatement'
| 'ForOfStatement'
| 'ForStatement'
| 'ImportDeclaration'
| 'ImportDefaultSpecifier'
| 'ImportNamespaceSpecifier'
| 'ImportSpecifier'
| 'LabeledStatement'
| 'MemberExpression'
| 'MethodDefinition'
| 'Property'
| 'ObjectExpression'
| 'ObjectPattern'
| 'SequenceExpression'
| 'SwitchCase'
| 'SwitchStatement'
| 'TaggedTemplateExpression'
| 'TemplateLiteral'
| 'TryStatement'
| 'VariableDeclaration'
| 'VariableDeclarator'
| 'WhileStatement'
| 'WithStatement';

interface INode extends acorn.Node {
    type: NodeType,
    key?: IIdentifier,
    value?: INode | string | number | null | boolean,
}

interface ILiteral extends INode {
    type: 'Literal',
    raw: string,
    value: string | number | null | boolean,
}

interface IStringLiteral extends ILiteral {
    value: string,
}

interface IIdentifier extends INode {
    type: 'Identifier',
    name: string,
}

interface ICallExpression extends INode {
    type: 'CallExpression',
    callee?: IIdentifier,
    arguments: Array<INode>,
}

interface IExpressionStatement extends INode {
    type: 'ExpressionStatement',
    expression: ICallExpression,
}

interface IImportSpecifier extends INode {
    type: 'ImportSpecifier',
    imported: IIdentifier,
    local: IIdentifier,
}

interface IImportDeclaration extends INode {
    type: 'ImportDeclaration',
    specifiers: Array<IImportSpecifier>,
    source: IStringLiteral,
}

interface IVariableDeclarator extends INode {
    type: 'VariableDeclaration',
    id: IIdentifier,
}

interface IVariableDeclaration extends INode {
    type: 'VariableDeclaration',
    declarations: Array<IVariableDeclarator>,
}

interface IFunctionDeclaration extends INode {
    type: 'FunctionDeclaration',
    id: IIdentifier,
}

interface IMemberExpression extends INode {
    type: 'MemberExpression',
    key: IIdentifier,
    value: INode,
}

interface IObjectExpression extends INode {
    type: 'ObjectExpression',
    properties: Array<IMemberExpression>,
}

interface IArrayExpression extends INode {
    type: 'ArrayExpression',
    elements: Array<INode>,
}

interface IProgram extends INode {
    type: 'Program',
    body: Array<IImportDeclaration | IExpressionStatement | IVariableDeclaration | IFunctionDeclaration>,
}

export interface IVisitors {
    ImportDeclaration?: (node: IImportDeclaration) => void,
    ExpressionStatement?: (node: IExpressionStatement) => void,
    ObjectExpression?: (node: IObjectExpression) => void,
}

export const simple: (
    ast: acorn.Node,
    visitors: IVisitors,
) => void;

export const base: {
    [key: string]: () => void,
};
