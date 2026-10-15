import * as fs from 'fs';
import {updateFile} from '../util/updateFile';
import {createOptimizedIdGenerator} from './createOptimizedIdGenerator';
import {parseScripts} from './parseScripts';
import {minifyCSSInScript} from './minifyCSSInScript';
import {setDictionary} from './setDictionary';

const {readFile} = fs.promises;

export const minifyScripts = async (
    props: {
        files: Map<string, string>,
        cssKey: string,
        dest: string,
    },
): Promise<void> => {
    const parseResult = await parseScripts(props);
    const identifier = createOptimizedIdGenerator(parseResult.tokens);
    await Promise.all([...parseResult.scripts].map(async ([file, {script, ranges}]) => {
        const minified = minifyCSSInScript(script, ranges, identifier);
        await updateFile(file, minified);
    }));
    const helperCode = setDictionary(await readFile(props.dest, 'utf8'), identifier.idList);
    await updateFile(props.dest, helperCode);
};
