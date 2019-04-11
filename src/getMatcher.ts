import {resolve, sep} from 'path';
import * as mm from 'micromatch';

export interface IMatcher {
    test(input: string): boolean,
}

export const getMatcher = (
    id: string | RegExp,
): IMatcher => {
    if (typeof id === 'string') {
        return {test: mm.matcher(resolve(id).split(sep).join('/'))};
    } else {
        return id;
    }
};
