import {IIdentifier} from './createIdentifier';
import {tokenizeString} from './tokenizeString';

export const encodeString = (
    string: string,
    identifier: IIdentifier,
): Array<number> => {
    const encoded: Array<number> = [];
    for (const token of tokenizeString(string)) {
        encoded.push(identifier(token));
    }
    return encoded;
};

export const decodeString = (
    encoded: Array<number>,
    words: Array<string>,
): string => encoded.map((index) => words[index]).join('');
