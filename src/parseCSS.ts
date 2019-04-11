import {Writable} from 'stream';
import postcss, {
    AcceptedPlugin,
    Root,
    SourceMapOptions,
} from 'postcss';
import {readFile} from './readFile';

export interface ICSSParserParameters {
    from: string,
    map?: SourceMapOptions,
    css?: string | Buffer,
    plugins?: Array<AcceptedPlugin>,
    stderr?: Writable,
}

export const parseCSS = async ({
    plugins = [],
    from,
    css,
    map,
    stderr = process.stderr,
}: ICSSParserParameters): Promise<Root> => {
    if (!css) {
        css = await readFile(from, 'utf8');
    }
    if (plugins.length === 0) {
        return postcss.parse(css, {from, map});
    } else {
        const result = await postcss(plugins).process(css, {from, map});
        for (const message of result.warnings()) {
            stderr.write(`${message}\n`);
        }
        return result.root;
    }
};
