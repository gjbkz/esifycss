import type * as acorn from 'acorn';

export type NodeType =
'ArrayExpression' | 'ArrayPattern' | 'ArrowFunctionExpression' | 'AssignmentExpression' | 'AssignmentPattern' | 'AwaitExpression' | 'BinaryExpression' | 'BlockStatement' | 'BreakStatement' | 'CallExpression' | 'CatchClause' | 'ClassBody' | 'ClassDeclaration' | 'ClassExpression' | 'ConditionalExpression' | 'ContinueStatement' | 'DebuggerStatement' | 'DoWhileStatement' | 'EmptyStatement' | 'ExportAllDeclaration' | 'ExportDefaultDeclaration' | 'ExportNamedDeclaration' | 'ExportSpecifier' | 'ExpressionStatement' | 'ForInStatement' | 'ForOfStatement' | 'ForStatement' | 'FunctionDeclaration' | 'FunctionExpression' | 'Identifier' | 'IfStatement' | 'ImportDeclaration' | 'ImportDefaultSpecifier' | 'ImportNamespaceSpecifier' | 'ImportSpecifier' | 'LabeledStatement' | 'Literal' | 'LogicalExpression' | 'MemberExpression' | 'MetaProperty' | 'MethodDefinition' | 'NewExpression' | 'ObjectExpression' | 'ObjectPattern' | 'ParenthesizedExpression' | 'Program' | 'Property' | 'RestElement' | 'ReturnStatement' | 'SequenceExpression' | 'SpreadElement' | 'Super' | 'SwitchCase' | 'SwitchStatement' | 'TaggedTemplateExpression' | 'TemplateElement' | 'TemplateLiteral' | 'ThisExpression' | 'ThrowStatement' | 'TryStatement' | 'UnaryExpression' | 'UpdateExpression' | 'VariableDeclaration' | 'VariableDeclarator' | 'WhileStatement' | 'WithStatement' | 'YieldExpression';

interface INode extends acorn.Node {
    type: NodeType,
    key?: IIdentifier,
    value?: INode | boolean | number | string | null,
}

interface ILiteral extends INode {
    type: 'Literal',
    raw: string,
    value: boolean | number | string | null,
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
    body: Array<IExpressionStatement | IFunctionDeclaration | IImportDeclaration | IVariableDeclaration>,
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

export const base: Record<string, () => void>;
