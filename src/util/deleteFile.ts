import * as path from 'path';
import * as fs from 'fs';
const {unlink, readdir, rmdir} = fs.promises;

export const deleteFile = async (
    filePath: string,
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
                await deleteFile(file);
            }));
            await rmdir(filePath);
            break;
        }
        default:
            throw error;
        }
    }
};
