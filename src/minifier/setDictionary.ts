export const setDictionary = (
    code: string,
    words: Array<string>,
): string => {
    const longestWordLength = 2 + words.reduce((longest, {length}) => longest < length ? length : longest, 0);
    const dictionarySize = words.length;
    const step = 10 <= 120 / longestWordLength ? 10 : 5;
    const lines: Array<string> = [];
    for (let offset = 0; offset < dictionarySize; offset += step) {
        lines.push(`${words.slice(offset, offset + step).map((word) => JSON.stringify(word).padStart(longestWordLength)).join(', ')},`);
    }
    return code.replace(/\[\s*(['"])ESIFYCSS DICTIONARY\1\s*\]/, `[\n${lines.join('\n')}\n]`);
};
