declare module 'acorn-walk' {
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
        value?: INode | string | number,
    }
    interface IIdentifier extends INode {
        name: string,
    }
    interface ICallExpression extends INode {
        callee: IIdentifier,
        arguments: Array<INode>,
    }
    interface IExpressionStatement extends INode {
        expression: ICallExpression,
    }
    interface IImportSpecifier extends INode {
        imported: IIdentifier,
        local: IIdentifier,
    }
    interface IImportDeclaration extends INode {
        specifiers: Array<IImportSpecifier>,
    }
    interface IMemberExpression extends INode {
        key: IIdentifier,
        value: INode | string | number,
    }
    interface IObjectExpression extends INode {
        properties: Array<IMemberExpression>,
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
}
