import test from 'ava';
import {encodeString} from './encodeString';
import {createIdentifier} from './createIdentifier';

interface ITest {
    input: string,
    preset?: Array<string>,
    expected: Array<number>,
    expectedWords: Array<string>,
}

([
    {
        input: 'foo',
        expected: [0],
        expectedWords: ['foo'],
    },
    {
        input: 'bar foo foo foo foo',
        expected: [0, 1, 2, 1, 2, 1, 2, 1, 2],
        expectedWords: ['bar', ' ', 'foo'],
    },
    {
        input: 'bar foo foo foo foo',
        preset: ['foo', ' '],
        expected: [2, 1, 0, 1, 0, 1, 0, 1, 0],
        expectedWords: ['foo', ' ', 'bar'],
    },
] as Array<ITest>).forEach(({input, preset, expected, expectedWords}) => {
    test(`${JSON.stringify(input)} ${JSON.stringify(preset || [])} → ${expected.join('-')}`, (t) => {
        const identifier = createIdentifier();
        if (preset) {
            for (const token of preset) {
                identifier(token);
            }
        }
        t.deepEqual(
            encodeString(input, identifier),
            expected,
        );
        t.deepEqual(
            identifier.idList,
            expectedWords,
        );
    });
});
