import test from 'ava';
import {extractCSSFromScript} from './extractCSSFromScript';

interface ITest {
    input: string,
    expected: ReturnType<typeof extractCSSFromScript>,
}

([
    {
        input: `({esifycss:${JSON.stringify('aaa')}})`,
        expected: [
            {
                css: 'aaa',
                start: 1,
                end: 17,
            },
        ],
    },
    {
        input: `({esifycss:${JSON.stringify('aaa')}, a: 0})`,
        expected: [],
    },
    {
        input: `({esifycss:${JSON.stringify('aaa')}, a: 0});import('foo')`,
        expected: [],
    },
] as Array<ITest>).forEach(({input, expected}) => {
    test(JSON.stringify(input), (t) => {
        const actual = extractCSSFromScript(input);
        t.deepEqual(actual, expected);
    });
});

