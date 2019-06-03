type Words = Array<number>;
const style = document.createElement('style');
let buffer: Array<Words | string> = [];
const dictionary: Array<string> = [/* Dictionary */];
const wordsToString = (
    words: Words | string,
): string => typeof words === 'string' ? words : words.map((index) => dictionary[index]).join('');

export const addStyle = (words?: Words | string): void => {
    if (!style.parentNode) {
        document.head.appendChild(style);
    }
    if (words) {
        buffer.push(words);
    }
    if (0 < buffer.length) {
        const sheet = style.sheet as CSSStyleSheet;
        const skipped: typeof buffer = [];
        while (1) {
            const words = buffer.shift();
            if (typeof words === 'string') {
                sheet.insertRule(words, sheet.cssRules.length);
            } else if (words) {
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
    }
};
