import {readFile, writeFile} from '../util/fs';
import {createOptimizedIdentifier} from './createOptimizedIdentifier';
import {parseScripts} from './parseScripts';
import {minifyCSSInScript} from './minifyCSSInScript';
import {setDictionary} from './setDictionary';

export const minifyScripts = async (
    props: {
        files: Array<string>,
        cssKey: string,
        dest: string,
    },
): Promise<void> => {
    const parseResult = await parseScripts(props);
    const identifier = createOptimizedIdentifier(parseResult.tokens);
    await Promise.all([...parseResult.scripts].map(async ([file, {script, cssRanges}]) => {
        const minified = minifyCSSInScript(script, cssRanges, identifier);
        await writeFile(file, minified);
    }));
    const helperCode = setDictionary(await readFile(props.dest, 'utf8'), identifier.idList);
    await writeFile(props.dest, helperCode);
};
