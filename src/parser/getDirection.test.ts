import test, {ThrowsExpectation} from 'ava';
import {getDirection} from './getDirection';
import {CSSAnimationDirection} from './types';

interface ITest {
    input: Parameters<typeof getDirection>[0],
    expected: ReturnType<typeof getDirection> | ThrowsExpectation,
}

([
    ...[
        CSSAnimationDirection.alternate,
        CSSAnimationDirection.alternateReverse,
        CSSAnimationDirection.normal,
        CSSAnimationDirection.reverse,
    ].map((input) => ({input, expected: input})),
    {input: 'foo', expected: {message: 'Invalid <direction>: foo'}},
] as Array<ITest>).forEach(({input, expected}) => {
    test(`${JSON.stringify(input)} → ${typeof expected === 'string' ? expected : 'Error'}`, (t) => {
        if (typeof expected === 'string') {
            t.is(getDirection(input), expected);
        } else {
            t.throws(() => getDirection(input), expected);
        }
    });
});
