import {test} from 'node:test';
import * as assert from 'node:assert/strict';
import {tokenizeString} from './tokenizeString';

interface Test {
    input: string,
    expected: Array<string>,
}

([
    {input: 'foo', expected: ['foo']},
    {input: 'width:100px', expected: ['width', ':', '100', 'px']},
] as Array<Test>).forEach(({input, expected}, index) => {
    test(`#${index} ${JSON.stringify(input)} → ${expected.join('|')}`, () => {
        assert.deepStrictEqual(
            [...tokenizeString(input)],
            expected,
        );
    });
});
