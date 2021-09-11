import {updateFile} from '../util/updateFile';
import {parseScripts} from './parseScripts';
import type {ScriptData} from './types';

export const minifyScriptForCSS = async (
    [file, data]: [string, ScriptData],
) => {
    const cssList: Array<string> = [];
    let code = data.script;
    for (let index = data.ranges.length; index--;) {
        cssList[index] = data.ranges[index].css;
    }
    code = [...data.expressionStatements, ...data.importDeclarations]
    .sort((range1, range2) => range1.start < range2.start ? 1 : -1)
    .reduce((node, range) => `${node.slice(0, range.start)}${node.slice(range.end)}`, code)
    .replace(/\n\s*\n/g, '\n');
    await updateFile(file, code);
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
    // const cssList = await Promise.all([...parseResult.scripts].map(minifyScriptForCSS));
    const cssList: Array<string> = [];
    for (const script of parseResult.scripts) {
        const css = await minifyScriptForCSS(script).catch((error: unknown) => {
            throw error;
        });
        cssList.push(css);
    }
    await updateFile(props.dest, cssList.join('\n'));
};
