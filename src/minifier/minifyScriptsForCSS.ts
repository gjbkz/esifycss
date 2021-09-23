import {updateFile} from '../util/updateFile';
import {parseScripts} from './parseScripts';
import type {ScriptData} from './types';

const cache = new WeakMap<ScriptData, string>();

export const minifyScriptForCSS = async (
    [file, data]: [string, ScriptData],
) => {
    let cached = cache.get(data);
    if (!cached) {
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
        cached = cssList.join('\n');
        cache.set(data, cached);
    }
    return cached;
};

/**
 * Removes statements for importing and executing addStyle().
 * @param props
 */
export const minifyScriptsForCSS = async (
    props: {
        files: Map<string, string>,
        cssKey: string,
        dest: string,
    },
): Promise<void> => {
    const parseResult = await parseScripts(props);
    const cssList = await Promise.all([...parseResult.scripts].map(minifyScriptForCSS));
    await updateFile(props.dest, cssList.join('\n'));
};
