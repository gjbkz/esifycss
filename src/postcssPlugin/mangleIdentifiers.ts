import * as postcss from 'postcss';
import * as selectorParser from 'postcss-selector-parser';
import {IEsifyCSSResult, IImports, IPluginMangler} from './types';
import {getMatchedImport} from './getMatchedImport';

export const mangleIdentifiers = async (
    {id, root, mangler, imports}: {
        id: string,
        root: postcss.Root,
        mangler: IPluginMangler,
        imports: IImports,
    },
): Promise<{id: IEsifyCSSResult['id'], class: IEsifyCSSResult['class']}> => {
    const result: {id: IEsifyCSSResult['id'], class: IEsifyCSSResult['class']} = {
        id: {},
        class: {},
    };
    const parser = selectorParser((selectors) => {
        selectors.walk((selector) => {
            if (selectorParser.isClassName(selector) || selectorParser.isIdentifier(selector)) {
                const {value} = selector;
                if (value) {
                    const imported = getMatchedImport(value, imports);
                    if (imported) {
                        selector.value = mangler(imported.from, selector.type, imported.key);
                    } else {
                        selector.value = result[selector.type][value] = mangler(id, selector.type, value);
                    }
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
