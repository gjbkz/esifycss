import * as path from 'path';
import * as fs from 'fs';
import {statOrNull} from './statOrNull';

export const updateFile = async (filePath: string, source: Uint8Array | string): Promise<void> => {
    const [stats] = await Promise.all([
        statOrNull(filePath),
        fs.promises.mkdir(path.dirname(filePath), {recursive: true}),
    ]);
    const buffer = Buffer.from(source);
    if (stats && stats.isFile()) {
        const currentBuffer = await fs.promises.readFile(filePath);
        if (buffer.equals(currentBuffer)) {
            return;
        }
    }
    await fs.promises.writeFile(filePath, buffer);
};
