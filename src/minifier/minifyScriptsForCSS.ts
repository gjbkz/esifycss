import {writeFile} from '../util/fs';
import {parseScripts} from './parseScripts';

export const minifyScriptsForCSS = async (
    props: {
        files: Array<string>,
        cssKey: string,
        dest: string,
        helper: string,
    },
): Promise<void> => {
    const parseResult = await parseScripts(props);
    const cssList = await Promise.all([...parseResult.scripts].map(async ([file, data]) => {
        const cssList: Array<string> = [];
        let code = data.script;
        for (let index = data.ranges.length; index--;) {
            const range = data.ranges[index];
            cssList[index] = range.css;
        }
        code = [data.addStyle, ...data.statements]
        .sort((range1, range2) => range1.start < range2.start ? 1 : -1)
        .reduce((code, range) => `${code.slice(0, range.start)}${code.slice(range.end)}`, code);
        await writeFile(file, code);
        return cssList.join('\n');
    }));
    await writeFile(props.dest, cssList.join('\n'));
};
