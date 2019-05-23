import {ICSSParserParameters, ICSSParserConfigurations} from './types';
import {plugin} from '../postcss-plugin/plugin';
import {readFile} from '../util/fs';

export const getCSSParserConfiguration = async (
    {
        file,
        css,
        plugins = [],
        map = {},
    }: ICSSParserParameters,
): Promise<ICSSParserConfigurations> => ({
    css: `${css || await readFile(file)}`,
    plugins: plugins.concat(plugin),
    options: {
        from: file,
        map,
    },
});
