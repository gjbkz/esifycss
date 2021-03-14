import type * as anymatch from 'anymatch';
import type * as chokidar from 'chokidar';
import type * as postcss from 'postcss';
import type * as stream from 'stream';
import type {IPluginOptions} from '../postcssPlugin/types';

export interface ISessionOptions {
    /**
     * Pattern(s) to be included
     * @default "*"
     */
    include?: Array<string> | string,
    /**
     * Pattern(s) to be excluded.
     * @default ['node_modules']
     */
    exclude?: anymatch.Matcher,
    /**
     * File extension(s) to be included.
     * @default ['.css']
     */
    extensions?: Array<string>,
    /**
     * Where this plugin outputs the helper script.
     * If you use TypeScript, set a  value like '*.ts'.
     * You can't use this option with the css option.
     * The {hash} in the default value is calculated from the include option.
     * @default "helper.{hash}.css.js"
     */
    helper?: string,
    /**
     * File extension of generated script.
     * @default options.helper ? path.extname(options.helper) : '.js'
     */
    ext?: string,
    /**
     * Where this plugin outputs the css.
     * You can't use this option with the helper option.
     * @default undefined
     */
    css?: string,
    /**
     * It it is true, a watcher is enabled.
     * @default false
     */
    watch?: boolean,
    /**
     * Options passed to chokidar.
     * You can't set ignoreInitial to true.
     * @default {
     *   ignore: exclude,
     *   ignoreInitial: false,
     *   useFsEvents: false,
     * }
     */
    chokidar?: chokidar.WatchOptions,
    /**
     * An array of postcss plugins.
     * esifycss.plugin is appended to this array.
     * @default []
     */
    postcssPlugins?: Array<postcss.AcceptedPlugin>,
    /**
     * https://github.com/postcss/postcss#options
     * @default undefined
     */
    postcssOptions?: postcss.ProcessOptions,
    /**
     * Parameters for esifycss.plugin.
     */
    esifycssPluginParameter?: IPluginOptions,
    /**
     * A stream where the runner outputs logs.
     * @default process.stdout
     */
    stdout?: stream.Writable,
    /**
     * A stream where the runner outputs errorlogs.
     * @default process.stderr
     */
    stderr?: stream.Writable,
}

export interface IReadonlyWatchOptions extends Readonly<chokidar.WatchOptions> {
    awaitWriteFinish?: Readonly<chokidar.AwaitWriteFinishOptions> | boolean,
}

export interface ISessionOutput {
    type: 'css' | 'script',
    path: string,
}

export interface ISessionConfiguration {
    readonly watch: boolean,
    readonly output: ISessionOutput,
    readonly ext: string,
    readonly path: ReadonlyArray<string>,
    readonly chokidar: IReadonlyWatchOptions,
    readonly stdout: stream.Writable,
    readonly stderr: stream.Writable,
    readonly postcssPlugins: Array<postcss.AcceptedPlugin>,
    readonly postcssOptions: postcss.ProcessOptions,
    readonly cssKey: string,
}

export interface ICSSParserParameters {
    file: string,
    css?: Buffer | string,
    options?: postcss.ProcessOptions,
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
