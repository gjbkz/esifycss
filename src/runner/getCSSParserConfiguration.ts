import {ICSSParserParameters, ICSSParserConfigurations} from './types';
import {readFile} from '../util/readFile';
import {plugin} from '../plugin';

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
