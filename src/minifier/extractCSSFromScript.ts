import {IParseResult} from './types';

export const extractCSSFromScript = (
    script: string,
): Array<IParseResult> => {
    const RegExpCSS = /(\s*\/\*\s*begin\(css\)\s*\*\/\s*)("[\s\S]*?")(\s*\/\*\s*end\(css\)\s*\*\/\s*)/g;
    const results: Array<IParseResult> = [];
    while (1) {
        const match = RegExpCSS.exec(script);
        if (match) {
            const [matched,, css] = match;
            const start = match.index;
            const end = start + matched.length;
            results.push({css: JSON.parse(css), start, end});
        } else {
            break;
        }
    }
    return results;
};
