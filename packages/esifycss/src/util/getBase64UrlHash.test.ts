import {test} from 'node:test';
import * as assert from 'node:assert/strict';
import {getBase64UrlHash} from './getBase64UrlHash';

test('get a hash string', () => {
    const hash = getBase64UrlHash('foo', Buffer.from('bar'));
    assert.strictEqual(hash, 'w6uP8Tcg6K2QR905Rms8iXTlksL6OD1KOWBxTK7wxPI');
});
