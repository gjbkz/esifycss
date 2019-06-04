export const tokenizeString = function* (
    string: string,
): IterableIterator<string> {
    let pos = 0;
    const REGEXP = /[.0-9]+|[^a-zA-Z]/g;
    while (1) {
        const match = REGEXP.exec(string);
        if (match) {
            const {0: matched, index} = match;
            if (pos < index) {
                yield string.slice(pos, index);
            }
            yield matched;
        } else {
            const rest = string.slice(pos).trim();
            if (rest) {
                yield rest;
            }
            break;
        }
        pos = REGEXP.lastIndex;
    }
};
