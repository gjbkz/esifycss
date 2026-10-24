import {test} from 'node:test';
import * as assert from 'node:assert/strict';
import {createExposedPromise} from './createExposedPromise';

test('#0 resolve', async () => {
    const exposed = createExposedPromise();
    exposed.resolve();
    await exposed.promise;
});

test('#1 reject', async () => {
    const exposed = createExposedPromise();
    const message = 'Expected';
    exposed.reject(new Error(message));
    await assert.rejects(exposed.promise, {message});
});
