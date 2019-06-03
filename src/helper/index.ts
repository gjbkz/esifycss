type Dictionary = Array<string>;
type Words = Array<number>;
const style = document.createElement('style');
const buffer: Array<Words | string> = [];
const wordsToString = (
    words: Words | string,
    dictionary: Dictionary,
): string => typeof words === 'string' ? words : words.map((index) => dictionary[index]).join('');
let dictionary: Dictionary | null = null;

export const setDictionary = (newDictionary: Dictionary) => {
    dictionary = newDictionary;
    addStyle();
};

export const addStyle = (words?: Words | string): void => {
    if (!style.parentNode) {
        document.head.appendChild(style);
    }
    if (words) {
        buffer.push(words);
    }
    if (0 < buffer.length) {
        const sheet = style.sheet as CSSStyleSheet;
        while (1) {
            const words = buffer.shift();
            if (typeof words === 'string') {
                sheet.insertRule(words, sheet.cssRules.length);
            } else if (words) {
                sheet.insertRule(wordsToString(words, dictionary), sheet.cssRules.length);
            } else {
                break;
            }
        }
    }
};
