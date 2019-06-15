const style = document.createElement('style');
let buffer = [];
const wordsToString = (
    words,
    dictionary,
) => typeof words === 'string' ? words : words.map((index) => dictionary[index]).join('');
const dictionary = [" ","\n","_","{","}","4",":",";","animation","s","0","%","transform","rotate","(","deg",")","#","1","2",".","3","@","keyframes","100","720"];

export const addStyle = (words) => {
    if (!style.parentNode) {
        document.head.appendChild(style);
    }
    if (words) {
        buffer.push(words);
    }
    if (0 < buffer.length) {
        const {sheet} = style;
        const skipped = [];
        while (1) {
            const words = buffer.shift();
            const type = typeof words;
            if (type === 'string') {
                sheet.insertRule(words, sheet.cssRules.length);
            } else if (type === 'object') {
                if (dictionary) {
                    sheet.insertRule(wordsToString(words, dictionary), sheet.cssRules.length);
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
