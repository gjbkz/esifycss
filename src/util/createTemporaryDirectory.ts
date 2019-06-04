import * as path from 'path';
import * as os from 'os';
import {mkdtemp} from './fs';

export const createTemporaryDirectory = (
    prefix: string = '',
): Promise<string> => mkdtemp(path.join(os.tmpdir(), prefix || 'node-tmp-'));
