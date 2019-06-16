import * as postcss from 'postcss';
import * as selectorParser from 'postcss-selector-parser';
import {IEsifyCSSResult, IImports, IPluginMangler} from './types';

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
        let importState: {selector: selectorParser.Tag, from: string} | null = null;
        selectors.walk((selector) => {
            if (selectorParser.isClassName(selector) || selectorParser.isIdentifier(selector)) {
                const {value: before} = selector;
                if (before) {
                    const after = mangler(id, selector.type, before);
                    selector.value = result[selector.type][before] = after;
                }
            } else if (selectorParser.isTag(selector)) {
                const from = selector.value && imports.get(selector.value);
                if (from) {
                    importState = {selector, from};
                    process.stdout.write(JSON.stringify(importState, null, 2));
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
