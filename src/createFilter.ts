import {sep} from 'path';
import {ensureArray} from './ensureArray';
import {getMatcher} from './getMatcher';

export interface IFilterParameters {
    include: Array<string> | string | null,
    exclude?: Array<string | RegExp> | string | RegExp | null,
}

export interface IFilter {
    (id: string): boolean,
}

export const createFilter = (params: IFilterParameters): IFilter => {
    const include = ensureArray(params.include).map(getMatcher);
    const exclude = ensureArray(params.exclude).map(getMatcher);
    return (id: string): boolean => {
        const normalized = id.split(sep).join('/');
        if (exclude.some((excludeMatcher): boolean => excludeMatcher.test(normalized))) {
            return false;
        }
        if (include.some((includeMatcher): boolean => includeMatcher.test(normalized))) {
            return true;
        }
        return include.length === 0;
    };
};
