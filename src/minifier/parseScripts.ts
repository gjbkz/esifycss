import * as fs from 'fs';
import type {ParseScriptsResult, ScriptData, ParseResult} from './types';
import {parseCSSModuleScript} from './parseCSSModuleScript';
import {tokenizeString} from '../util/tokenizeString';

const cache = new Map<string, {mtimeMs: number, data: ParseResult}>();

export const parseScripts = async (
    {files, cssKey}: {
        files: Map<string, string>,
        cssKey: string,
    },
): Promise<ParseScriptsResult> => {
    const scripts = new Map<string, ScriptData>();
    const tokens = new Map<string, number>();
    const tasks: Array<Promise<void>> = [];
    for (const [source, file] of files) {
        const {mtimeMs} = await fs.promises.stat(source);
        let cached = cache.get(source);
        if (cached && mtimeMs !== cached.mtimeMs) {
            cached = undefined;
        }
        let data = cached && cached.data;
        const code = await fs.promises.readFile(file, 'utf8');
        if (!data) {
            data = parseCSSModuleScript({code, cssKey});
            cache.set(source, {mtimeMs, data});
        }
        for (const {css} of data.ranges) {
            for (const token of tokenizeString(css)) {
                tokens.set(token, (tokens.get(token) || 0) + 1);
            }
        }
        scripts.set(file, {...data, script: code});
    }
    await Promise.all(tasks);
    return {scripts, tokens};
};
