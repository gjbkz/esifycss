import {test} from 'node:test';
import * as assert from 'node:assert/strict';
import {createTemporaryDirectory} from './createTemporaryDirectory';

interface Test {
    prefix?: string,
    expected: RegExp,
}

([
    {expected: /node-tmp-/},
    {prefix: 'foo-temporary-', expected: /foo-temporary-/},
] as Array<Test>).forEach(({prefix, expected}, index) => {
    test(`#${index} createTemporaryDirectory(${JSON.stringify(prefix)}) → ${JSON.stringify(expected)}`, async () => {
        const actual = await createTemporaryDirectory(prefix);
        assert.strictEqual(expected.test(actual), true);
    });
});
