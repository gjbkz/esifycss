import * as fs from 'fs';
import {parseScripts} from './parseScripts';
import {IScriptData} from './types';
const {writeFile} = fs.promises;

export const minifyScriptForCSS = async (
    [file, data]: [string, IScriptData],
) => {
    const cssList: Array<string> = [];
    let code = data.script;
    for (let index = data.ranges.length; index--;) {
        cssList[index] = data.ranges[index].css;
    }
    code = data.statements
    .sort((range1, range2) => range1.start < range2.start ? 1 : -1)
    .reduce((statement, range) => `${statement.slice(0, range.start)}${statement.slice(range.end)}`, code);
    await writeFile(file, code);
    return cssList.join('\n');
};

/**
 * Removes statements for importing and executing addStyle().
 * @param props
 */
export const minifyScriptsForCSS = async (
    props: {
        files: Array<string>,
        cssKey: string,
        dest: string,
    },
): Promise<void> => {
    const parseResult = await parseScripts(props);
    const cssList = await Promise.all([...parseResult.scripts].map(minifyScriptForCSS));
    await writeFile(props.dest, cssList.join('\n'));
};
