import * as postcss from 'postcss';
import {ICSSParserParameters} from './types';
import {getCSSParserConfiguration} from './getCSSParserConfiguration';

export const parseCSS = async (
    parameters: ICSSParserParameters,
): Promise<postcss.Result> => {
    const config = await getCSSParserConfiguration(parameters);
    return await postcss(config.plugins).process(config.css, config.options);
};
