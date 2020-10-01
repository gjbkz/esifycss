import {Result} from 'postcss';
import {postcss} from '../util/postcss';
import {ICSSParserParameters} from './types';
import {getCSSParserConfiguration} from './getCSSParserConfiguration';

export const parseCSS = async (
    parameters: ICSSParserParameters,
): Promise<Result> => {
    const config = await getCSSParserConfiguration(parameters);
    return await postcss(config.plugins).process(config.css, config.options);
};
