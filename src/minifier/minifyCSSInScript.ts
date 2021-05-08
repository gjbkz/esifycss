import type {CSSRange} from './types';
import type {Identifier} from '../util/createIdentifier';
import {encodeString} from '../util/encodeString';

export const minifyCSSInScript = (
    script: string,
    cssRanges: Array<CSSRange>,
    identifier: Identifier,
): string => {
    let minified = script;
    for (let index = cssRanges.length; index--;) {
        const range = cssRanges[index];
        minified = [
            minified.slice(0, range.start),
            JSON.stringify(encodeString(range.css, identifier)),
            minified.slice(range.end),
        ].join('');
    }
    return minified;
};
