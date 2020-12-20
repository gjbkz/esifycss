import * as fs from 'fs';
import {createOptimizedIdentifier} from './createOptimizedIdentifier';
import {parseScripts} from './parseScripts';
import {minifyCSSInScript} from './minifyCSSInScript';
import {setDictionary} from './setDictionary';
const {writeFile, readFile} = fs.promises;

export const minifyScripts = async (
    props: {
        files: Array<string>,
        cssKey: string,
        dest: string,
    },
): Promise<void> => {
    const parseResult = await parseScripts(props);
    const identifier = createOptimizedIdentifier(parseResult.tokens);
    await Promise.all([...parseResult.scripts].map(async ([file, {script, ranges}]) => {
        const minified = minifyCSSInScript(script, ranges, identifier);
        await writeFile(file, minified);
    }));
    const helperCode = setDictionary(await readFile(props.dest, 'utf8'), identifier.idList);
    await writeFile(props.dest, helperCode);
};
