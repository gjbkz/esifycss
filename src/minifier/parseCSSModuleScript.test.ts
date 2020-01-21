import test from 'ava';
import {parseCSSModuleScript} from './parseCSSModuleScript';

interface ITest {
    input: {
        title: string,
        code: string,
        cssKey: string,
    },
    expected: ReturnType<typeof parseCSSModuleScript>,
}

([
    {
        input: {
            title: 'basic',
            code: [
                ' import {addStyle} from \'esifycss\';',
                `addStyle([{esifycss:${JSON.stringify('aaa')}}]);`,
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
            addStyle: {start: 1, end: 35},
            statements: [{start: 36, end: 65}],
        },
    },
] as Array<ITest>).forEach(({input, expected}, index) => {
    test(`#${index} ${input.title}`, (t) => {
        const actual = parseCSSModuleScript(input);
        t.deepEqual(actual, expected);
    });
});
