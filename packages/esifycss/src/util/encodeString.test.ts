import {test} from 'node:test';
import * as assert from 'node:assert/strict';
import {encodeString, decodeString} from './encodeString';
import {createIdentifier} from './createIdGenerator';

interface Test {
    input: string,
    preset?: Array<string>,
    expected: string,
    expectedWords: Array<string>,
}

([
    {
        input: 'foo',
        expected: 'A',
        expectedWords: ['foo'],
    },
    {
        input: 'bar foo foo foo foo',
        expected: 'ACECECECE',
        expectedWords: ['bar', ' ', 'foo'],
    },
    {
        input: 'bar foo foo foo foo',
        preset: ['foo', ' '],
        expected: 'ECACACACA',
        expectedWords: ['foo', ' ', 'bar'],
    },
] as Array<Test>).forEach(({input, preset, expected, expectedWords}, index) => {
    test(`#${index} ${JSON.stringify(input)} ${JSON.stringify(preset || [])} → ${expected}`, () => {
        const identifier = createIdentifier();
        if (preset) {
            for (const token of preset) {
                identifier(token);
            }
        }
        const actual = encodeString(input, identifier);
        assert.strictEqual(actual, expected);
        assert.deepStrictEqual(
            identifier.idList,
            expectedWords,
        );
        assert.strictEqual(decodeString(actual, identifier.idList), input);
    });
});
