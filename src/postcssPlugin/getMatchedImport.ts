import {IImports} from './types';

export const getMatchedImport = (
    value: string,
    imports: IImports,
): {key: string, from: string} | null => {
    for (const [name, from] of imports) {
        if (value.startsWith(name)) {
            return {key: value.slice(name.length), from};
        }
    }
    return null;
};
