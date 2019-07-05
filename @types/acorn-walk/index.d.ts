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
        properties?: Array<INode>,
        key?: INode,
        value?: INode | string | number,
        name?: string,
    }
    export type IVisitors = {
        [TType in NodeType]?: (node: INode) => void;
    };
    export const simple: (
        ast: acorn.Node,
        visitors: IVisitors,
    ) => void;
}
