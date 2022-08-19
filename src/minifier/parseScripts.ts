import * as fs from 'fs';
import {tokenizeString} from '../util/tokenizeString';
import type {ParseScriptsResult, ScriptData} from './types';
import {parseCSSModuleScript} from './parseCSSModuleScript';

const cache = new Map<string, {
    mtimeMs: number,
    tokens: Map<string, number>,
    scriptData: ScriptData,
}>();

export const parseScripts = async (
    {files, cssKey}: {
        files: Map<string, string>,
        cssKey: string,
    },
): Promise<ParseScriptsResult> => {
    const scripts = new Map<string, ScriptData>();
    const allTokens = new Map<string, number>();
    const tasks: Array<Promise<void>> = [];
    for (const [source, file] of files) {
        const {mtimeMs} = await fs.promises.stat(source);
        let cached = cache.get(source);
        if (!cached || mtimeMs !== cached.mtimeMs) {
            const code = await fs.promises.readFile(file, 'utf8');
            const data = parseCSSModuleScript({code, cssKey});
            const tokens = new Map<string, number>();
            for (const {css} of data.ranges) {
                for (const token of tokenizeString(css)) {
                    tokens.set(token, (tokens.get(token) || 0) + 1);
                    allTokens.set(token, (allTokens.get(token) || 0) + 1);
                }
            }
            cached = {mtimeMs, tokens, scriptData: {...data, script: code}};
            cache.set(source, cached);
        } else {
            for (const [token, count] of cached.tokens) {
                allTokens.set(token, (allTokens.get(token) || 0) + count);
            }
        }
        scripts.set(file, cached.scriptData);
    }
    await Promise.all(tasks);
    return {scripts, tokens: allTokens};
};
