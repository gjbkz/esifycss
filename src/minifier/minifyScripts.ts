import {readFile, writeFile} from '../util/fs';
import {IParseResult, IParseScriptsResult, IScriptData} from './types';
import {parseScript} from './parseScript';
import {tokenizeString} from '../util/tokenizeString';
import {createIdentifier, IIdentifier} from '../util/createIdentifier';
import {encodeString} from '../util/encodeString';

const parseScripts = async (
    files: Array<string>,
): Promise<IParseScriptsResult> => {
    const scripts = new Map<string, IScriptData>();
    const tokens = new Map<string, number>();
    await Promise.all(files.map(async (file) => {
        const script = (await readFile(file, 'utf8'));
        const cssRanges = parseScript(script);
        for (const {css} of cssRanges) {
            for (const token of tokenizeString(css)) {
                tokens.set(token, (tokens.get(token) || 0) + 1);
            }
        }
        scripts.set(file, {script, cssRanges});
    }));
    return {scripts, tokens};
};

const createOptimizedIdentifier = (
    tokens: Map<string, number>,
): IIdentifier => {
    const identifier = createIdentifier();
    for (const [token] of [...tokens].sort((a, b) => b[1] - a[1])) {
        identifier(token);
    }
    return identifier;
};

const minifyCssInScript = async (
    file: string,
    script: string,
    cssRanges: Array<IParseResult>,
    identifier: IIdentifier,
): Promise<void> => {
    let minified = script;
    for (let index = cssRanges.length; index--;) {
        const {css, start, end} = cssRanges[index];
        minified = [
            minified.slice(0, start),
            JSON.stringify(encodeString(css, identifier)),
            minified.slice(end),
        ].join('');
    }
    await writeFile(file, minified);
};

const setDictionary = async (
    filePath: string,
    words: Array<string>,
): Promise<void> => {
    const code = await readFile(filePath, 'utf8');
    const newCode = code.replace(/\[\s*(['"])DICTIONARY\1\s*\]/, JSON.stringify(words));
    return writeFile(filePath, newCode);
};

export const minifyScripts = async (
    helperScript: string,
    files: Array<string>,
): Promise<void> => {
    const parseResult = await parseScripts(files);
    const identifier = createOptimizedIdentifier(parseResult.tokens);
    await Promise.all([...parseResult.scripts].map(([file, {script, cssRanges}]) => minifyCssInScript(file, script, cssRanges, identifier)));
    await setDictionary(helperScript, identifier.idList);
};
