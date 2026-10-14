import * as path from 'path';
import * as fs from 'fs';
import {ignoreNoEntryError} from './ignoreNoEntryError';

export const updateFile = async (filePath: string, source: Uint8Array | string): Promise<void> => {
    await ensureDirectory(path.dirname(filePath));
    const buffer = Buffer.from(source);
    const currentBuffer = await fs.promises.readFile(filePath).catch(ignoreNoEntryError);
    if (currentBuffer && buffer.equals(currentBuffer)) {
        return;
    }
    await fs.promises.writeFile(filePath, buffer);
};

const ensureDirectory = async (directory: string) => {
    const directoryStats = await fs.promises.stat(directory).catch(ignoreNoEntryError);
    if (!directoryStats || !directoryStats.isDirectory()) {
        await fs.promises.mkdir(directory, {recursive: true});
    }
};
