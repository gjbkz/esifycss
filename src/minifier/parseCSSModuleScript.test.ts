import test from 'ava';
import {parseCSSModuleScript} from './parseCSSModuleScript';

interface Test {
    input: {
        title: string,
        code: string,
        cssKey: string,
    },
    expected: ReturnType<typeof parseCSSModuleScript> | null,
}

([
    {
        input: {
            title: 'simple',
            code: [
                ' import {addStyle} from \'esifycss\';',
                'addStyle([{esifycss:\'aaa\'}]);',
            ].join('\n'),
            cssKey: 'esifycss',
        },
        expected: {
            ranges: [
                {
                    css: 'aaa',
                    start: 46,
                    end: 62,
                },
            ],
            expressionStatements: [{start: 36, end: 65}],
            importDeclarations: [{start: 1, end: 35}],
        },
    },
    {
        input: {
            title: 'InvalidArrayExpression',
            code: [
                ' import {addStyle} from \'esifycss\';',
                'addStyle({esifycss:\'aaa\'});',
            ].join('\n'),
            cssKey: 'esifycss',
        },
        expected: {
            ranges: [],
            expressionStatements: [],
            importDeclarations: [{start: 1, end: 35}],
        },
    },
    {
        input: {
            title: 'NoAddStyle',
            code: 'addStyle([{esifycss:\'aaa\'}]);',
            cssKey: 'esifycss',
        },
        expected: {
            ranges: [
                {
                    css: 'aaa',
                    start: 10,
                    end: 26,
                },
            ],
            expressionStatements: [{start: 0, end: 29}],
            importDeclarations: [],
        },
    },
    {
        input: {
            title: 'InvalidObjectExpression',
            code: [
                'import {addStyle} from \'esifycss\';',
                'addStyle([0]);',
            ].join('\n'),
            cssKey: 'esifycss',
        },
        expected: {
            ranges: [],
            expressionStatements: [],
            importDeclarations: [{start: 0, end: 34}],
        },
    },
    {
        input: {
            title: 'EmptyArray',
            code: [
                'import {addStyle} from \'esifycss\';',
                'addStyle([]);',
            ].join('\n'),
            cssKey: 'esifycss',
        },
        expected: {
            ranges: [],
            expressionStatements: [],
            importDeclarations: [{start: 0, end: 34}],
        },
    },
    {
        input: {
            title: 'Empty',
            code: [
                'import {addStyle} from \'esifycss\';',
                'addStyle();',
            ].join('\n'),
            cssKey: 'esifycss',
        },
        expected: {
            ranges: [],
            expressionStatements: [],
            importDeclarations: [{start: 0, end: 34}],
        },
    },
    {
        input: {
            title: 'InvalidKey',
            code: [
                'import {addStyle} from \'esifycss\';',
                'addStyle([{foo:\'aaa\'}]);',
            ].join('\n'),
            cssKey: 'esifycss',
        },
        expected: {
            ranges: [],
            expressionStatements: [],
            importDeclarations: [{start: 0, end: 34}],
        },
    },
    {
        input: {
            title: 'NonLiteral',
            code: [
                'import {addStyle} from \'esifycss\';',
                'addStyle([{esifycss:[]}]);',
            ].join('\n'),
            cssKey: 'esifycss',
        },
        expected: null,
    },
    {
        input: {
            title: 'InvalidCSSType',
            code: [
                'import {addStyle} from \'esifycss\';',
                'addStyle([{esifycss:1}]);',
            ].join('\n'),
            cssKey: 'esifycss',
        },
        expected: null,
    },
    {
        input: {
            title: 'Locally declared const addFoooo',
            code: [
                ' const addFoooo = () => null;',
                'addFoooo([{esifycss:\'aaa\'}]);',
            ].join('\n'),
            cssKey: 'esifycss',
        },
        expected: {
            ranges: [
                {
                    css: 'aaa',
                    start: 40,
                    end: 56,
                },
            ],
            expressionStatements: [{start: 30, end: 59}],
            importDeclarations: [],
        },
    },
    {
        input: {
            title: 'Locally declared function addFoooo',
            code: [
                ' function addFoooo() {return null}',
                'addFoooo([{esifycss:\'aaa\'}]);',
            ].join('\n'),
            cssKey: 'esifycss',
        },
        expected: {
            ranges: [
                {
                    css: 'aaa',
                    start: 45,
                    end: 61,
                },
            ],
            expressionStatements: [{start: 35, end: 64}],
            importDeclarations: [],
        },
    },
    {
        input: {
            title: 'Ignore AssignmentExpression',
            code: [
                ' function addFoooo() {return null}',
                'addFoooo([{esifycss:\'aaa\'}]);',
                'a += 1',
            ].join('\n'),
            cssKey: 'esifycss',
            localName: 'addFoooo',
        },
        expected: {
            ranges: [
                {
                    css: 'aaa',
                    start: 45,
                    end: 61,
                },
            ],
            expressionStatements: [{start: 35, end: 64}],
            importDeclarations: [],
        },
    },
    {
        input: {
            title: 'dynamic import',
            code: [
                'import(\'./foo\').catch((err) => console.error(err));',
                'addStyle([{esifycss:\'aaa\'}]);',
            ].join('\n'),
            cssKey: 'esifycss',
        },
        expected: {
            ranges: [
                {
                    css: 'aaa',
                    start: 62,
                    end: 78,
                },
            ],
            expressionStatements: [
                {start: 52, end: 81},
            ],
            importDeclarations: [],
        },
    },
] as Array<Test>).forEach(({input, expected}, index) => {
    test(`#${index} ${input.title}${expected ? '' : ' → Error'}`, (t) => {
        if (expected) {
            const actual = parseCSSModuleScript(input);
            t.deepEqual(actual, expected);
        } else {
            const error = t.throws(() => parseCSSModuleScript(input));
            t.is(error && error.message.slice(0, input.title.length), input.title);
        }
    });
});
