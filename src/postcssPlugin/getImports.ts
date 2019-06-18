import * as postcss from 'postcss';
import {parseImport} from './parseImport';
import {IImports} from './types';

export const getImports = (
    root: postcss.Root,
    id: string,
): IImports => {
    const imports: IImports = new Map();
    root.walkAtRules((rule) => {
        const {name} = rule;
        if (name === 'import') {
            const parsed = parseImport(rule.params, id);
            if (parsed) {
                imports.set(parsed.localName, parsed.from);
                rule.remove();
            }
        }
        Object.assign(rule.raws, {before: '', between: '', after: ''});
    });
    return imports;
};
