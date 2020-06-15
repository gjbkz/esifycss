import test from 'ava';
import {parseCSSModuleScript} from './parseCSSModuleScript';

interface ITest {
    input: {
        title: string,
        code: string,
        cssKey: string,
        helper: string,
        localName?: string,
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
            helper: 'esifycss',
        },
        expected: {
            ranges: [
                {
                    css: 'aaa',
                    start: 46,
                    end: 62,
                },
            ],
            addStyle: {start: 1, end: 35},
            statements: [{start: 36, end: 65}],
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
            helper: 'esifycss',
        },
        expected: null,
    },
    {
        input: {
            title: 'NoAddStyle',
            code: 'addStyle([{esifycss:\'aaa\'}]);',
            cssKey: 'esifycss',
            helper: 'esifycss',
        },
        expected: null,
    },
    {
        input: {
            title: 'InvalidObjectExpression',
            code: [
                'import {addStyle} from \'esifycss\';',
                'addStyle([0]);',
            ].join('\n'),
            cssKey: 'esifycss',
            helper: 'esifycss',
        },
        expected: null,
    },
    {
        input: {
            title: 'EmptyArray',
            code: [
                'import {addStyle} from \'esifycss\';',
                'addStyle([]);',
            ].join('\n'),
            cssKey: 'esifycss',
            helper: 'esifycss',
        },
        expected: {
            ranges: [],
            addStyle: {start: 0, end: 34},
            statements: [{start: 35, end: 48}],
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
            helper: 'esifycss',
        },
        expected: {
            ranges: [],
            addStyle: {start: 0, end: 34},
            statements: [{start: 35, end: 46}],
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
            helper: 'esifycss',
        },
        expected: null,
    },
    {
        input: {
            title: 'NonLiteral',
            code: [
                'import {addStyle} from \'esifycss\';',
                'addStyle([{esifycss:[]}]);',
            ].join('\n'),
            cssKey: 'esifycss',
            helper: 'esifycss',
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
            helper: 'esifycss',
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
            helper: 'esifycss',
            localName: 'addFoooo',
        },
        expected: {
            ranges: [
                {
                    css: 'aaa',
                    start: 40,
                    end: 56,
                },
            ],
            addStyle: {start: 1, end: 29},
            statements: [{start: 30, end: 59}],
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
            helper: 'esifycss',
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
            addStyle: {start: 1, end: 34},
            statements: [{start: 35, end: 64}],
        },
    },
] as Array<ITest>).forEach(({input, expected}, index) => {
    test(`#${index} ${input.title}${expected ? '' : ' → Error'}`, (t) => {
        if (expected) {
            const actual = parseCSSModuleScript(input);
            t.deepEqual(actual, expected);
        } else {
            const error = t.throws(() => parseCSSModuleScript(input));
            t.is(error.message.slice(0, input.title.length), input.title);
        }
    });
});
