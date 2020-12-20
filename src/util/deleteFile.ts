import * as path from 'path';
import * as fs from 'fs';
import * as stream from 'stream';
import {write} from './write';
const {unlink, readdir, rmdir} = fs.promises;

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
