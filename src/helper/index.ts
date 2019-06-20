const charToInteger = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='.split('')
.reduce<{[char: string]: number}>(
    (map, char, index) => {
        map[char] = index;
        return map;
    },
    {},
);
const decode = (string: string): Array<number> => {
    const result: Array<number> = [];
    let value = 0;
    let shift = 0;
    for (const char of string) {
        let integer = charToInteger[char];
        if (0 <= integer) {
            const hasContinuationBit = integer & 32;
            integer &= 31;
            value += integer << shift;
            if (hasContinuationBit) {
                shift += 5;
            } else {
                const shouldNegate = value & 1;
                value >>= 1;
                result.push(shouldNegate ? -value : value);
                value = shift = 0;
            }
        } else {
            throw new Error(`Invalid character (${char})`);
        }
    }
    return result;
};
const style = document.createElement('style');
let buffer: Array<string> = [];
const dictionary: Array<string> = ['DICTIONARY'];
const wordsToString = (words: string): string => decode(words).map((index) => dictionary[index]).join('');

export const addStyle = (rules?: Array<string>): void => {
    if (!style.parentNode) {
        document.head.appendChild(style);
    }
    if (rules) {
        buffer = buffer.concat(rules);
    }
    const sheet = style.sheet as CSSStyleSheet;
    const skipped: typeof buffer = [];
    while (1) {
        const words = buffer.shift();
        if (words) {
            if (dictionary) {
                sheet.insertRule(wordsToString(words), sheet.cssRules.length);
            } else {
                skipped.push(words);
            }
        } else {
            break;
        }
    }
    buffer = buffer.concat(skipped);
};
