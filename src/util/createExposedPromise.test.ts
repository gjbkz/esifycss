import test from 'ava';
import {createExposedPromise} from './createExposedPromise';

test('resolve', async (t) => {
    const exposed = createExposedPromise();
    exposed.resolve();
    await exposed.promise;
    t.pass();
});

test('reject', async (t) => {
    const exposed = createExposedPromise();
    const message = 'Expected';
    exposed.reject(new Error(message));
    const error = await t.throwsAsync(exposed.promise);
    t.is(error.message, message);
});
