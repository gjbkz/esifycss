import * as path from 'path';
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
export const copyFile = util.promisify(fs.copyFile);

export const writeFile = async (
    dest: string,
    data: string | Buffer,
    stdout: stream.Writable = process.stdout,
): Promise<void> => {
    await new Promise((resolve, reject): void => {
        createDirectoryFor(dest);
        const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
        fs.writeFile(
            dest,
            buffer,
            (error) => {
                if (error) {
                    reject(error);
                } else {
                    const isBig = 100000 < buffer.length;
                    write(stdout, [`written: ${dest}${isBig ? ` ${buffer.length}bytes` : ''}`]);
                    resolve();
                }
            },
        );
    });
};

export const deleteFile = async (
    filePath: string,
    stdout: stream.Writable = process.stdout,
): Promise<void> => {
    try {
        await unlink(filePath);
    } catch (error: unknown) {
        switch ((error as {code?: string}).code) {
        case 'ENOENT':
            return;
        case 'EISDIR':
        case 'EPERM': {
            const files = (await readdir(filePath)).map((name) => path.join(filePath, name));
            await Promise.all(files.map(async (file) => {
                await deleteFile(file, stdout);
            }));
            await rmdir(filePath);
            break;
        }
        default:
            throw error;
        }
    }
    write(stdout, [`deleted: ${filePath}`]);
};
