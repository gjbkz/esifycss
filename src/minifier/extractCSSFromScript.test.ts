import test from 'ava';
import {extractCSSFromScript} from './extractCSSFromScript';

interface ITest {
    input: {
        code: string,
        cssKey: string,
    },
    expected: ReturnType<typeof extractCSSFromScript>,
}

([
    {
        input: {
            code: `({esifycss:${JSON.stringify('aaa')}})`,
            cssKey: 'esifycss',
        },
        expected: [
            {
                css: 'aaa',
                start: 1,
                end: 17,
            },
        ],
    },
    {
        input: {
            code: `({esifycss:${JSON.stringify('aaa')}, a: 0})`,
            cssKey: 'esifycss',
        },
        expected: [],
    },
    {
        input: {
            code: `({esifycss:${JSON.stringify('aaa')}, a: 0});import('foo')`,
            cssKey: 'esifycss',
        },
        expected: [],
    },
] as Array<ITest>).forEach(({input, expected}) => {
    test(JSON.stringify(input), (t) => {
        const actual = extractCSSFromScript(input);
        t.deepEqual(actual, expected);
    });
});

