import * as path from 'path';

export const parseImport = (
    parameter: string,
    id: string,
): null | {from: string, localName: string} => {
    const [importFrom, localName, ...others] = parameter.split(/\s+/);
    if (others.length === 0 && importFrom.match(/^(['"]).+\1/) && localName.match(/^\w+$/)) {
        const from = importFrom.slice(1, -1);
        if (from.startsWith('.')) {
            return {
                from: path.join(path.dirname(id), ...from.split(/\//)),
                localName,
            };
        }
    }
    return null;
};
