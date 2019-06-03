import test from 'ava';
import {getHash} from './getHash';

test('get a hash string', (t) => {
    const data = 'foo';
    const hash = getHash(data);
    t.true(0 < hash.length);
    t.is(typeof hash, 'string');
});

test('get a different hash', (t) => {
    const data1 = 'foo';
    const hash1 = getHash(data1);
    const data2 = 'bar';
    const hash2 = getHash(data2);
    t.true(0 < hash1.length);
    t.true(0 < hash2.length);
    t.true(hash1 !== hash2);
});

test('get a hash string using sha512', (t) => {
    const data = 'foo';
    const hash1 = getHash(data);
    const hash2 = getHash(data, {algorithm: 'sha512', encoding: 'base64'});
    t.true(0 < hash1.length);
    t.true(0 < hash2.length);
    t.true(hash1 !== hash2);
});

test('get a hash as a buffer', (t) => {
    const data = 'foo';
    const hash = getHash(data, {algorithm: 'sha256', encoding: Buffer});
    t.true(Buffer.isBuffer(hash));
});
