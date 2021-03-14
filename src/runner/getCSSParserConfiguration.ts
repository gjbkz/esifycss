import * as fs from 'fs';
import type {ICSSParserParameters, ICSSParserConfigurations} from './types';
const {readFile} = fs.promises;

export const getCSSParserConfiguration = async (
    parameters: ICSSParserParameters,
): Promise<ICSSParserConfigurations> => ({
    css: `${parameters.css || await readFile(parameters.file)}`,
    plugins: parameters.plugins,
    options: {
        ...parameters.options,
        from: parameters.file,
        map: parameters.map || {},
    },
});
