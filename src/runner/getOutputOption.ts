import {ISessionConfiguration, ISessionOutput} from './types';
import {getHash} from '../util/getHash';

export const getOutputOption = (
    {helper, css}: {helper?: string, css?: string},
    include: Array<string>,
): ISessionConfiguration['output'] => {
    let output: ISessionOutput | undefined;
    if (css) {
        if (helper) {
            throw new Error(`You can't use options.helper (${helper}) with options.css (${css})`);
        }
        output = {type: 'css', path: css};
    } else {
        const scriptPath = helper || `helper.${getHash(include.join(','))}.css.js`;
        output = {type: 'script', path: scriptPath};
    }
    return output;
};
