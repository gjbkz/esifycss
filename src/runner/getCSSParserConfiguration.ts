import {ICSSParserParameters, ICSSParserConfigurations} from './types';
import {plugin} from '../postcss-plugin/plugin';
import {readFile} from '../util/fs';

export const getCSSParserConfiguration = async (
    {
        file,
        css,
        plugins = [],
        map = {},
        parameters = {},
    }: ICSSParserParameters,
): Promise<ICSSParserConfigurations> => ({
    css: `${css || await readFile(file)}`,
    plugins: plugins.concat(plugin(parameters)),
    options: {
        from: file,
        map,
    },
});
