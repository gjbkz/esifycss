import {test} from 'node:test';
import * as assert from 'node:assert/strict';
import {createIdentifier} from './createIdGenerator';

test('#0 without listener', () => {
    const identifier = createIdentifier();
    const id1 = identifier('foo');
    const id2 = identifier('bar');
    assert.strictEqual(id1 !== id2, true);
    const id3 = identifier('foo');
    assert.strictEqual(id3, id1);
});

test('#1 with listener', () => {
    const log: Record<string, number | undefined> = {};
    const identifier = createIdentifier((key, id) => {
        log[key] = id;
    });
    const id1 = identifier('foo');
    const id2 = identifier('bar');
    assert.strictEqual(id1 !== id2, true);
    const id3 = identifier('foo');
    assert.strictEqual(id3, id1);
    assert.deepStrictEqual(log, {
        foo: id1,
        bar: id2,
    });
});
