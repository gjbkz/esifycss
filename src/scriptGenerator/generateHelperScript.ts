import * as path from 'path';
import {readFile, readdir} from '../util/fs';
import {IHelperScript} from './types';

/**
 * generates JavaScript or TypeScript exports setDictionary and addStyle.
 */
export const generateHelperScript = async (
    dest: string,
): Promise<IHelperScript> => {
    const helperScriptDirectory = path.join(__dirname, '../helper');
    const helperScriptFileName = (await readdir(helperScriptDirectory))
    .find((name) => name === `index${path.extname(dest)}`);
    if (!helperScriptFileName) {
        throw new Error(`Cannot find helper script in ${helperScriptDirectory}`);
    }
    const helperScriptPath = path.join(helperScriptDirectory, helperScriptFileName);
    const content = await readFile(helperScriptPath, 'utf8');
    return {path: dest, content};
};
