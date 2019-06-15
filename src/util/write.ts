import * as util from 'util';
import * as stream from 'stream';

export const write = (
    stream: stream.Writable,
    messages: Array<Parameters<typeof util.inspect>[0]>,
    inspectOptions: util.InspectOptions = {},
): void => {
    for (const message of messages) {
        stream.write(`${typeof message === 'string' ? message : util.inspect(message, inspectOptions)}\n`);
    }
};
