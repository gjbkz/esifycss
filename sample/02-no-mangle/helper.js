const style = document.createElement('style');
let buffer = [];
const dictionary = [":","{","}","_",";","-","0","rotate","animation"," ","%","1","@","keyframes","fadeIn","3","opacity","100","4","transform","(","deg",")","s","linear",".","icon","360","#","container","display","flex","0.2","duration","iteration","count","infinite","timing","function","1.","2","name"];
const charToInteger = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='.split('')
    .reduce((map, char, index) => {
    map[char] = index;
    return map;
}, {});
const decode = (string) => {
    const result = [];
    let value = 0;
    let shift = 0;
    const { length } = string;
    for (let index = 0; index < length; index++) {
        let integer = charToInteger[string[index]];
        if (0 <= integer) {
            const hasContinuationBit = integer & 32;
            integer &= 31;
            value += integer << shift;
            if (hasContinuationBit) {
                shift += 5;
            }
            else {
                value >>= 1;
                result.push(dictionary[value]);
                value = shift = 0;
            }
        }
        else {
            throw new Error(`Invalid character (${string[index]})`);
        }
    }
    return result.join('');
};
export const addStyle = (rules) => {
    if (!style.parentNode) {
        document.head.appendChild(style);
    }
    if (rules) {
        buffer = buffer.concat(rules);
    }
    const sheet = style.sheet;
    const skipped = [];
    while (1) {
        const words = buffer.shift();
        if (words) {
            if (dictionary) {
                sheet.insertRule(decode(words), sheet.cssRules.length);
            }
            else {
                skipped.push(words);
            }
        }
        else {
            break;
        }
    }
    buffer = buffer.concat(skipped);
};
