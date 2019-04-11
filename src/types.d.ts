import {WatchOptions, AwaitWriteFinishOptions} from 'chokidar';
import {Matcher} from 'anymatch';
import {Root} from 'postcss';

export interface IReadonlyWatchOptions extends Readonly<WatchOptions> {
    awaitWriteFinish?: Readonly<AwaitWriteFinishOptions> | boolean,
}

export interface ISessionConfiguration {
    readonly watch: boolean,
    readonly path: ReadonlyArray<string>,
    readonly chokidar: IReadonlyWatchOptions,
    readonly stdout: NodeJS.WriteStream,
    readonly stderr: NodeJS.WriteStream,
}

export interface ISessionParameters {
    include: string | Array<string>,
    exclude?: Matcher,
    watch?: boolean,
    chokidar?: WatchOptions,
    stdout?: NodeJS.WriteStream,
    stderr?: NodeJS.WriteStream,
}

export interface IEsifyCSSParameters {
    file: string,
    css: string | Buffer,
}

export interface IEsifyCSSResult {
    root: Root,
    classes: {
        [className: string]: string,
    },
    animations: {
        [className: string]: string,
    },
}
