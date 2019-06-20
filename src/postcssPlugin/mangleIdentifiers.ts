import * as postcss from 'postcss';
import * as selectorParser from 'postcss-selector-parser';
import {IEsifyCSSResult, IImports, IPluginMangler} from './types';
import {getMatchedImport} from './getMatchedImport';

export const mangleIdentifiers = async (
    {id, root, mangler, imports, rawPrefix}: {
        id: string,
        root: postcss.Root,
        mangler: IPluginMangler,
        imports: IImports,
        rawPrefix: string,
    },
): Promise<{id: IEsifyCSSResult['id'], class: IEsifyCSSResult['class']}> => {
    const result: {id: IEsifyCSSResult['id'], class: IEsifyCSSResult['class']} = {
        id: {},
        class: {},
    };
    const parser = selectorParser((selectors) => {
        selectors.walk((selector) => {
            if (selectorParser.isClassName(selector) || selectorParser.isIdentifier(selector)) {
                const {value: before} = selector;
                if (before) {
                    let after = before;
                    if (before.startsWith(rawPrefix)) {
                        after = before.slice(rawPrefix.length);
                    } else {
                        const imported = getMatchedImport(before, imports);
                        if (imported) {
                            after = mangler(imported.from, selector.type, imported.key);
                        } else {
                            after = mangler(id, selector.type, before);
                        }
                    }
                    selector.value = result[selector.type][before] = after;
                }
            }
        });
    });
    const processes: Array<Promise<void>> = [];
    root.walkRules((rule) => {
        processes.push(parser.process(rule.selector).then((newSelector) => {
            rule.selector = newSelector;
        }));
    });
    await Promise.all(processes);
    return result;
};
