import {IParseResult} from './types';
import {IIdentifier} from '../util/createIdentifier';
import {encodeString} from '../util/encodeString';

export const minifyCSSInScript = (
    script: string,
    cssRanges: Array<IParseResult>,
    identifier: IIdentifier,
): string => {
    let minified = script;
    for (let index = cssRanges.length; index--;) {
        const {css, start, end} = cssRanges[index];
        minified = [
            minified.slice(0, start),
            JSON.stringify(encodeString(css, identifier)),
            minified.slice(end),
        ].join('');
    }
    return minified;
};
