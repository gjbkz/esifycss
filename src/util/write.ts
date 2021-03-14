import * as util from 'util';
import type * as stream from 'stream';

/**
 * Stringify the given values and write them to the given stream.
 */
export const write = (
    writable: stream.Writable,
    messages: Array<Parameters<typeof util.inspect>[0]>,
    inspectOptions: util.InspectOptions = {},
): void => {
    for (const message of messages) {
        writable.write(`${typeof message === 'string' ? message : util.inspect(message, inspectOptions)}\n`);
    }
};
