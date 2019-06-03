import {ICSSParserParameters, ICSSParserConfigurations} from './types';
import {readFile} from '../util/fs';

export const getCSSParserConfiguration = async (
    parameters: ICSSParserParameters,
): Promise<ICSSParserConfigurations> => ({
    css: `${parameters.css || await readFile(parameters.file)}`,
    plugins: parameters.plugins,
    options: {
        from: parameters.file,
        map: parameters.map || {},
    },
});
