import anymatch from 'anymatch';
import chokidar from 'chokidar';
import postcss from 'postcss';
import stream from 'stream';

export interface IReadonlyWatchOptions extends Readonly<chokidar.WatchOptions> {
    awaitWriteFinish?: Readonly<chokidar.AwaitWriteFinishOptions> | boolean,
}

export interface ISessionParameters {
    include: string | Array<string>,
    exclude?: anymatch.Matcher,
    watch?: boolean,
    chokidar?: chokidar.WatchOptions,
    stdout?: stream.Writable,
    stderr?: stream.Writable,
}

export interface ISessionConfiguration {
    readonly watch: boolean,
    readonly path: ReadonlyArray<string>,
    readonly chokidar: IReadonlyWatchOptions,
    readonly stdout: stream.Writable,
    readonly stderr: stream.Writable,
}

export interface ICSSParserParameters {
    file: string,
    css?: string | Buffer,
    plugins?: Array<postcss.AcceptedPlugin>,
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
