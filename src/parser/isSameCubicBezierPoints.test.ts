import test from 'ava';
import {isSameCubicBezierPoints} from './isSameCubicBezierPoints';

interface ITest {
    input: Parameters<typeof isSameCubicBezierPoints>,
    expected: ReturnType<typeof isSameCubicBezierPoints>,
}

([
    {
        input: [[0, 1, 2, 3], [0, 1, 2, 3]],
        expected: true,
    },
    {
        input: [[0, 1, 2, 3], [0, 1, 2, 4]],
        expected: false,
    },
    {
        input: [[0, 1, 2, 3], undefined],
        expected: false,
    },
    {
        input: [undefined, undefined],
        expected: false,
    },
] as Array<ITest>).forEach(({input, expected}) => {
    test(`${JSON.stringify(input)} → ${expected}`, (t) => {
        t.is(isSameCubicBezierPoints(...input), expected);
    });
});
