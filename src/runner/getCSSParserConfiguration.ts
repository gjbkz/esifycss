import {ICSSParserParameters, ICSSParserConfigurations} from './types';
import {plugin} from '../postcssPlugin/plugin';
import {readFile} from '../util/fs';

export const getCSSParserConfiguration = async (
    parameters: ICSSParserParameters,
): Promise<ICSSParserConfigurations> => ({
    css: `${parameters.css || await readFile(parameters.file)}`,
    plugins: (parameters.plugins || []).concat(plugin(parameters.parameters)),
    options: {
        from: parameters.file,
        map: parameters.map || {},
    },
});
