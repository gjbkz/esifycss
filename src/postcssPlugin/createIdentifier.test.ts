import test from 'ava';
import {createIdentifier} from './createIdentifier';

test('without listener', (t) => {
    const identifier = createIdentifier();
    const id1 = identifier('foo');
    const id2 = identifier('bar');
    t.true(id1 !== id2);
    const id3 = identifier('foo');
    t.is(id3, id1);
});

test('with listener', (t) => {
    const log: {[key: string]: number | undefined} = {};
    const identifier = createIdentifier((key, id) => {
        log[key] = id;
    });
    const id1 = identifier('foo');
    const id2 = identifier('bar');
    t.true(id1 !== id2);
    const id3 = identifier('foo');
    t.is(id3, id1);
    t.deepEqual(log, {
        'foo': id1,
        'bar': id2,
    });
});