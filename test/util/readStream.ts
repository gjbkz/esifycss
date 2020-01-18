import * as stream from 'stream';

export const readStream = async (
    readable: stream.Readable,
): Promise<Buffer> => await new Promise((resolve, reject) => {
    const chunks: Array<Buffer> = [];
    let totalLength = 0;
    readable.pipe(new stream.Writable({
        write(chunk: Buffer, _encoding, callback) {
            chunks.push(chunk);
            totalLength += chunk.length;
            callback();
        },
        final(callback) {
            callback();
            resolve(Buffer.concat(chunks, totalLength));
        },
    }))
    .once('error', reject);
});
