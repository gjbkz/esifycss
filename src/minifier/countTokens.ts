import {tokenizeString} from '../util/tokenizeString';

export const countTokens = (
    css: string,
): Map<string, number> => {
    const tokens = new Map<string, number>();
    for (const token of tokenizeString(css)) {
        tokens.set(token, (tokens.get(token) || 0) + 1);
    }
    return tokens;
};
