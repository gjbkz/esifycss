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
    if (words) {
        buffer.push(words);
    }
    if (dictionary && 0 < buffer.length) {
        const {sheet} = style;
        while (1) {
            const words = buffer.shift();
            if (!words) {
                break;
            }
            sheet.insertRule(
                wordsToString(words, dictionary),
                sheet.cssRules.length,
            );
        }
        if (!style.parentNode) {
            document.head.appendChild(style);
        }
    }
};
