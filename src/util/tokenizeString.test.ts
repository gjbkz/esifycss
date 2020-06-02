import test from 'ava';
import {tokenizeString} from './tokenizeString';

interface ITest {
    input: string,
    expected: Array<string>,
}

([
    {input: 'foo', expected: ['foo']},
    {input: 'width:100px', expected: ['width', ':', '100', 'px']},
] as Array<ITest>).forEach(({input, expected}, index) => {
    test(`#${index} ${JSON.stringify(input)} → ${expected.join('|')}`, (t) => {
        t.deepEqual(
            [...tokenizeString(input)],
            expected,
        );
    });
});
