import * as anymatch from 'anymatch';
import * as chokidar from 'chokidar';
import * as postcss from 'postcss';
import * as stream from 'stream';
import {IPluginParameter} from '../postcssPlugin/types';

export interface IReadonlyWatchOptions extends Readonly<chokidar.WatchOptions> {
    awaitWriteFinish?: Readonly<chokidar.AwaitWriteFinishOptions> | boolean,
}

export interface ISessionParameters {
    include?: string | Array<string>,
    helper?: string,
    exclude?: anymatch.Matcher,
    watch?: boolean,
    chokidar?: chokidar.WatchOptions,
    stdout?: stream.Writable,
    stderr?: stream.Writable,
    postcssPlugins?: Array<postcss.AcceptedPlugin>,
    esifycssPluginParameter?: IPluginParameter,
    minifyScript?: boolean,
}

export interface ISessionConfiguration {
    readonly watch: boolean,
    readonly helper: string,
    readonly ext: string,
    readonly path: ReadonlyArray<string>,
    readonly chokidar: IReadonlyWatchOptions,
    readonly stdout: stream.Writable,
    readonly stderr: stream.Writable,
    readonly postcssPlugins: Array<postcss.AcceptedPlugin>,
    readonly minifyScript: boolean,
}

export interface ICSSParserParameters {
    file: string,
    css?: string | Buffer,
    plugins: Array<postcss.AcceptedPlugin>,
    map?: postcss.SourceMapOptions,
}

export interface ICSSParserConfigurations {
    readonly css: string,
    readonly plugins: Array<postcss.AcceptedPlugin>,
    readonly options: {
        readonly from: string,
        readonly map: postcss.SourceMapOptions,
    },
}
