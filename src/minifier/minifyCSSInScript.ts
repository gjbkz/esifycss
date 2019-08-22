import {IParseResult} from './types';
import {IIdentifier} from '../util/createIdentifier';
import {encodeString} from '../util/encodeString';

export const minifyCSSInScript = async (
    script: string,
    cssRanges: Array<IParseResult>,
    identifier: IIdentifier,
): Promise<string> => {
    let minified = script;
    for (let index = cssRanges.length; index--;) {
        const {css, start, end} = cssRanges[index];
        minified = [
            minified.slice(0, start),
            JSON.stringify(encodeString(css, identifier)),
            minified.slice(end),
        ].join('');
    }
    await Promise.resolve(null);
    return minified;
};
