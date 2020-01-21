import * as path from 'path';
import {readFile} from '../util/fs';
import {IParseScriptsResult, IScriptData} from './types';
import {parseCSSModuleScript} from './parseCSSModuleScript';
import {tokenizeString} from '../util/tokenizeString';

export const parseScripts = async (
    {files, cssKey, helper}: {
        files: Array<string>,
        cssKey: string,
        helper: string,
    },
): Promise<IParseScriptsResult> => {
    const scripts = new Map<string, IScriptData>();
    const tokens = new Map<string, number>();
    await Promise.all(files.map(async (file) => {
        const code = await readFile(file, 'utf8');
        const data = parseCSSModuleScript({
            code,
            cssKey,
            helper: path.relative(path.dirname(file), helper),
        });
        for (const {css} of data.ranges) {
            for (const token of tokenizeString(css)) {
                tokens.set(token, (tokens.get(token) || 0) + 1);
            }
        }
        scripts.set(file, {...data, script: code});
    }));
    return {scripts, tokens};
};
