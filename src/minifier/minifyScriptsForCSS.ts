import {writeFile} from '../util/fs';
import {parseScripts} from './parseScripts';
import {removeAddStyle} from './removeAddStyle';

export const minifyScriptsForCSS = async (
    props: {
        files: Array<string>,
        dest: string,
    },
): Promise<void> => {
    const parseResult = await parseScripts(props.files);
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
    await writeFile(props.dest, cssList.join('\n'));
};
