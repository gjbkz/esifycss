import test, {ThrowsExpectation} from 'ava';
import {getFillMode} from './getFillMode';
import {CSSAnimationFillMode} from './types';

interface ITest {
    input: Parameters<typeof getFillMode>[0],
    expected: ReturnType<typeof getFillMode> | ThrowsExpectation,
}

([
    ...[
        CSSAnimationFillMode.backwards,
        CSSAnimationFillMode.both,
        CSSAnimationFillMode.forwards,
        CSSAnimationFillMode.none,
    ].map((input) => ({input, expected: input})),
    {input: 'foo', expected: {message: 'Invalid <fill-mode>: foo'}},
] as Array<ITest>).forEach(({input, expected}) => {
    test(`${JSON.stringify(input)} → ${typeof expected === 'string' ? expected : 'Error'}`, (t) => {
        if (typeof expected === 'string') {
            t.is(getFillMode(input), expected);
        } else {
            t.throws(() => getFillMode(input), expected);
        }
    });
});
