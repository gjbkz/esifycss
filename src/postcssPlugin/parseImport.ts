import * as path from 'path';
import {normalizePath} from '../util/normalizePath';

export const parseImport = (
    parameter: string,
    id: string,
): null | {from: string, localName: string} => {
    const [importFrom, localName, ...others] = parameter.split(/\s+/);
    if (others.length === 0 && (/^(['"]).+\1/).exec(importFrom) && (/^[\w-]+$/).exec(localName)) {
        const from = importFrom.slice(1, -1);
        if (from.startsWith('.')) {
            return {
                from: normalizePath(path.join(path.dirname(id), ...from.split(/\//))),
                localName,
            };
        }
    }
    return null;
};
