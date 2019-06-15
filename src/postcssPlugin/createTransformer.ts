import * as postcss from 'postcss';
import * as selectorParser from 'postcss-selector-parser';
import {IPluginConfiguration, IEsifyCSSResult} from './types';
import {transformDeclarations} from './transformDeclarations';

export const createTransformer = (
    {mangler}: IPluginConfiguration,
) => async (
    root: postcss.Root,
    result: postcss.Result,
): Promise<IEsifyCSSResult> => {
    const id = (result.opts && result.opts.from) || Date.now().toString(36);
    const transformResult: IEsifyCSSResult = {
        id: {},
        class: {},
        keyframes: {},
    };
    const parser = selectorParser((selectors) => {
        const isClassOrId = (type: string): type is 'class' | 'id' => type === 'class' || type === 'id';
        selectors.walk((selector) => {
            const {type} = selector;
            if (isClassOrId(type)) {
                const {value: before} = selector;
                if (before) {
                    const after = mangler(id, type, before);
                    selector.value = transformResult[type][before] = after;
                }
            }
        });
    });
    const processes: Array<Promise<void>> = [];
    root.walkRules((rule) => {
        processes.push(
            parser.process(rule.selector)
            .then((newSelector) => {
                rule.selector = newSelector;
            }),
        );
        Object.assign(rule.raws, {before: '', between: '', after: ''});
    });
    root.walkAtRules((rule) => {
        const {name} = rule;
        if (name === 'keyframes') {
            const {params: before} = rule;
            const after = mangler(id, name, before);
            rule.params = transformResult[name][before] = after;
        }
        Object.assign(rule.raws, {before: '', between: '', after: ''});
    });
    root.walkDecls((rule) => Object.assign(rule.raws, {before: '', between: ':', after: ''}));
    await Promise.all(processes);
    transformDeclarations(root, transformResult);
    return transformResult;
};
