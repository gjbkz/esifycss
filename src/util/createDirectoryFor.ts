import * as fs from 'fs';
import * as path from 'path';

export const createDirectoryFor = (filePath: string) => {
    const directory = path.dirname(filePath);
    try {
        fs.readdirSync(directory);
    } catch (err) {
        createDirectoryFor(directory);
        try {
            fs.mkdirSync(directory);
        } catch (err2) {
            if ((err2 as {code?: string}).code !== 'EEXIST') {
                throw err2;
            }
        }
    }
    return directory;
};
