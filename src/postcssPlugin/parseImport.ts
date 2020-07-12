import * as path from 'path';
import {normalizePath} from '../util/normalizePath';

export const parseImport = (
    parameter: string,
    id: string,
): null | {from: string, localName: string} => {
    const matched = (/^(?:url\(\s*)?(['"])(.+)\1\s*\)?\s*/).exec(parameter);
    if (matched) {
        const localName = parameter.slice(matched[0].length);
        if ((/^[\w-]+$/).exec(localName)) {
            const from = matched[2];
            if (from.startsWith('.')) {
                return {
                    from: normalizePath(path.join(path.dirname(id), ...from.split(/\//))),
                    localName,
                };
            }
        }
    }
    return null;
};
