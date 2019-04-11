import {inspect} from 'util';

export const write = (
    stream: NodeJS.WriteStream,
    messages: Array<Parameters<typeof inspect>[0]>,
): void => {
    for (const message of messages) {
        stream.write(inspect(message));
    }
};
