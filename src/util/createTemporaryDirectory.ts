import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

export const createTemporaryDirectory = (prefix: string = '') => new Promise<string>((resolve, reject) => {
    fs.mkdtemp(path.join(os.tmpdir(), prefix || 'node-tmp-'), (error, directory) => {
        if (error) {
            reject(error);
        } else {
            resolve(directory);
        }
    });
});
