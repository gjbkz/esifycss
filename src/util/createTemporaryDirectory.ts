import * as path from 'path';
import * as os from 'os';
import {mkdtemp} from './fs';

export const createTemporaryDirectory = async (
    prefix = '',
): Promise<string> => {
    const pathPrefix = path.join(os.tmpdir(), prefix || 'node-tmp-');
    const createdTemporaryDirectory = await mkdtemp(pathPrefix);
    return createdTemporaryDirectory;
};
