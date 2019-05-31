import * as fs from 'fs';
import * as util from 'util';
import {createDirectoryFor} from './createDirectoryFor';

export const readdir = util.promisify(fs.readdir);
export const readFile = util.promisify(fs.readFile);
export const stat = util.promisify(fs.stat);
export const writeFile = (
    dest: string,
    data: string | Buffer,
): Promise<void> => new Promise((resolve, reject): void => {
    createDirectoryFor(dest);
    fs.writeFile(
        dest,
        data,
        (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        },
    );
});
