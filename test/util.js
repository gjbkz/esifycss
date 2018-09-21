const acorn = require('acorn');

const getValue = (node) => {
    switch (node.type) {
    case 'Literal':
        return node.value;
    case 'ObjectExpression':
        return node.properties.reduce((obj, {key, value}) => {
            obj[key.value || key.name] = getValue(value);
            return obj;
        }, {});
    default:
        return node;
    }
};

exports.getExports = (code) => {
    const ast = acorn.parse(code, {sourceType: 'module'});
    const result = {};
    for (const node of ast.body) {
        const {declaration} = node;
        switch (node.type) {
        case 'ExportDefaultDeclaration':
            result.default = getValue(declaration);
            break;
        case 'ExportNamedDeclaration':
            for (const {id, init} of declaration.declarations) {
                result[id.name] = getValue(init);
            }
            break;
        default:
        }
    }
    return result;
};
