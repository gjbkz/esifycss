import * as fs from 'fs';
import * as util from 'util';
import * as stream from 'stream';
import {createDirectoryFor} from './createDirectoryFor';
import {write} from './write';

export const readdir = util.promisify(fs.readdir);
export const mkdtemp = util.promisify(fs.mkdtemp);
export const mkdir = util.promisify(fs.mkdir);
export const readFile = util.promisify(fs.readFile);
export const stat = util.promisify(fs.stat);
export const unlink = util.promisify(fs.unlink);
export const rmdir = util.promisify(fs.rmdir);
export const writeFile = (
    dest: string,
    data: string | Buffer,
    stdout: stream.Writable = process.stdout,
): Promise<void> => new Promise((resolve, reject): void => {
    createDirectoryFor(dest);
    const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
    fs.writeFile(
        dest,
        buffer,
        (error) => {
            if (error) {
                reject(error);
            } else {
                write(stdout, [`write ${dest} (${buffer.length})`]);
                resolve();
            }
        },
    );
});
