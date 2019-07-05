const style = document.createElement('style');
let buffer: Array<string> = [];
const dictionary: Array<string> = ['ESIFYCSS DICTIONARY'];
const charToInteger = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='.split('')
.reduce<{[char: string]: number}>(
    (map, char, index) => {
        map[char] = index;
        return map;
    },
    {},
);
const decode = (encoded: string | {esifycss: string}): string => {
    if (typeof encoded === 'object') {
        return encoded.esifycss;
    }
    const result: Array<string> = [];
    let value = 0;
    let shift = 0;
    const {length} = encoded;
    for (let index = 0; index < length; index++) {
        let integer = charToInteger[encoded[index]];
        if (0 <= integer) {
            const hasContinuationBit = integer & 32;
            integer &= 31;
            value += integer << shift;
            if (hasContinuationBit) {
                shift += 5;
            } else {
                // const shouldNegate = value & 1;
                value >>= 1;
                result.push(dictionary[value]);
                value = shift = 0;
            }
        } else {
            throw new Error(`Unexpected token: ${encoded[index]} '${encoded}'[${index}]`);
        }
    }
    return result.join('');
};

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
                sheet.insertRule(decode(words), sheet.cssRules.length);
            } else {
                skipped.push(words);
            }
        } else {
            break;
        }
    }
    buffer = buffer.concat(skipped);
};
