export const setDictionary = (
    code: string,
    words: Array<string>,
): string => code.replace(/\[\s*(['"])ESIFYCSS DICTIONARY\1\s*\]/, JSON.stringify(words));
