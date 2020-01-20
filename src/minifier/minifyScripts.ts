import {readFile, writeFile} from '../util/fs';
import {createOptimizedIdentifier} from './createOptimizedIdentifier';
import {parseScripts} from './parseScripts';
import {minifyCSSInScript} from './minifyCSSInScript';
import {setDictionary} from './setDictionary';
import {removeAddStyle} from './removeAddStyle';

export const minifyScripts = async (
    output: {type: 'script' | 'css', path: string},
    files: Array<string>,
): Promise<void> => {
    const parseResult = await parseScripts(files);
    const identifier = createOptimizedIdentifier(parseResult.tokens);
    const outputPath = output.path;
    if (output.type === 'script') {
        await Promise.all([...parseResult.scripts].map(async ([file, {script, cssRanges}]) => {
            const minified = minifyCSSInScript(script, cssRanges, identifier);
            await writeFile(file, minified);
        }));
        const helperCode = setDictionary(await readFile(outputPath, 'utf8'), identifier.idList);
        await writeFile(outputPath, helperCode);
    } else {
        const cssList = await Promise.all([...parseResult.scripts].map(async ([file, {script, cssRanges}]) => {
            const cssList: Array<string> = [];
            let code = script;
            for (let index = cssRanges.length; index--;) {
                const range = cssRanges[index];
                cssList[index] = range.css;
                code = `${code.slice(0, range.start)}'CSS${index}'${code.slice(range.end)}`;
            }
            await writeFile(file, removeAddStyle(code));
            return cssList.join('\n');
        }));
        await writeFile(outputPath, cssList.join('\n'));
    }
};
