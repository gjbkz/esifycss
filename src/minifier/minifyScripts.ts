import {readFile, writeFile} from '../util/fs';
import {createOptimizedIdentifier} from './createOptimizedIdentifier';
import {parseScripts} from './parseScripts';
import {minifyCSSInScript} from './minifyCSSInScript';
import {setDictionary} from './setDictionary';

export const minifyScripts = async (
    helperScript: string,
    files: Array<string>,
): Promise<void> => {
    const parseResult = await parseScripts(files);
    const identifier = createOptimizedIdentifier(parseResult.tokens);
    await Promise.all(
        [...parseResult.scripts]
        .map(async ([file, {script, cssRanges}]) => {
            const minified = minifyCSSInScript(script, cssRanges, identifier);
            await writeFile(file, minified);
        }),
    );
    const helperCode = setDictionary(await readFile(helperScript, 'utf8'), identifier.idList);
    await writeFile(helperScript, helperCode);
};
