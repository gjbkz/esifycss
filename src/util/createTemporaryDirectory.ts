import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

const {mkdtemp} = fs.promises;

export const createTemporaryDirectory = async (
    prefix = '',
): Promise<string> => {
    const pathPrefix = path.join(os.tmpdir(), prefix || 'node-tmp-');
    const createdTemporaryDirectory = await mkdtemp(pathPrefix);
    return createdTemporaryDirectory;
};
