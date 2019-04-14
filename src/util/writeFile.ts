import * as fs from 'fs';
import {dirname} from 'path';

export * from 'fs';

const ensurePath = (path: string) => {
    const dir = dirname(path);
    try {
        fs.readdirSync(dir);
    } catch (err) {
        mkdirpath(dir);
        try {
            fs.mkdirSync(dir);
        } catch (err2) {
            if (err2.code !== 'EEXIST') {
                throw err2;
            }
        }
    }
};

export const writeFile = (
    dest: string,
    data: string | Buffer,
): Promise<void> => new Promise((resolve, reject): void => {
    ensurePath(dest);
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
