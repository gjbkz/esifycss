import util from 'util';
import stream from 'stream';

export const write = (
    stream: stream.Writable,
    messages: Array<Parameters<typeof util.inspect>[0]>,
    inspectOptions?: util.InspectOptions,
): void => {
    for (const message of messages) {
        stream.write(util.inspect(message, inspectOptions));
    }
};
