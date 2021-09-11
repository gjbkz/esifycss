import * as fs from 'fs';
import {isRecordLike} from './isRecordLike';

export const statOrNull = async (filePath: string): Promise<fs.Stats | null> => {
    return await fs.promises.stat(filePath).catch((error: unknown) => {
        if (isRecordLike(error) && error.code === 'ENOENT') {
            return null;
        }
        throw error;
    });
};
