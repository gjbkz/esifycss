const style = document.createElement('style');
const buffer = [];
const wordsToString = (
    words,
    dictionary,
) => typeof words === 'string' ? words : words.map((index) => dictionary[index]).join('');
let dictionary = null;

export const setDictionary = (newDictionary) => {
    dictionary = newDictionary;
    addStyle();
};

export const addStyle = (words) => {
    if (!style.parentNode) {
        document.head.appendChild(style);
    }
    if (words) {
        buffer.push(words);
    }
    if (0 < buffer.length) {
        const {sheet} = style;
        while (1) {
            const words = buffer.shift();
            const type = typeof words;
            if (type === 'string') {
                sheet.insertRule(words, sheet.cssRules.length);
            } else if (type === 'object') {
                sheet.insertRule(wordsToString(words, dictionary), sheet.cssRules.length);
            } else {
                break;
            }
        }
    }
};
