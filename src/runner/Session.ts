import * as fs from 'fs';
import * as chokidar from 'chokidar';
import * as path from 'path';
import {ISessionParameters, ISessionConfiguration} from './types';
import {getSessionConfiguration} from './getSessionConfiguration';
import {write} from '../util/write';
import {parseCSS} from './parseCSS';
import {extractPluginResult} from './extractPluginResult';
import {writeFile} from '../util/fs';
import {generateScript} from '../scriptGenerator/generateScript';
import {generateHelperScript} from '../scriptGenerator/generateHelperScript';
import {IHelperScript} from '../scriptGenerator/types';

export class Session {

    public readonly configuration: Readonly<ISessionConfiguration>;

    protected watcher?: chokidar.FSWatcher;

    protected helperScript?: IHelperScript;

    protected processedFiles: Set<string>;

    protected initialTask: Array<Promise<void>> | null;

    public constructor(parameters: ISessionParameters) {
        this.configuration = getSessionConfiguration(parameters);
        this.processedFiles = new Set();
        this.initialTask = null;
    }

    public async start(): Promise<void> {
        await this.outputHelperScript();
        await this.startWatcher();
    }

    public async stop(): Promise<void> {
        await this.stopWatcher();
    }

    protected async outputHelperScript() {
        this.helperScript = await generateHelperScript(
            this.configuration.output,
        );
        await writeFile(
            this.configuration.output,
            this.helperScript.content,
        );
    }

    protected async startWatcher(): Promise<void> {
        this.stopWatcher();
        this.initialTask = [];
        this.watcher = chokidar.watch(
            this.configuration.path.slice(),
            this.configuration.chokidar,
        )
        .on('error', this.onError.bind(this))
        .on('all', this.onFileEvent.bind(this));
        await this.waitForInitialTaskCompletion();
        await this.onInitialScanCompletion();
    }

    protected waitForInitialTaskCompletion(): Promise<void> {
        const {watcher} = this;
        if (!watcher) {
            throw new Error(`watcher is ${watcher}`);
        }
        this.log('waitForInitialTaskCompletion');
        return new Promise<void>((resolve, reject): void => {
            const check = () => {
                this.log('waitForInitialTaskCompletion:check');
                const currentProcesses = (this.initialTask || []).slice();
                new Promise((resolve) => setTimeout(resolve, 500))
                .then(() => {
                    this.log('waitForInitialTaskCompletion:task');
                    return Promise.all(currentProcesses);
                })
                .then(() => {
                    this.log('waitForInitialTaskCompletion:done');
                    if (this.initialTask) {
                        const done = new WeakSet(currentProcesses);
                        const filtered = this.initialTask.filter((process) => !done.has(process));
                        this.initialTask = 0 < filtered.length ? filtered : null;
                    }
                    this.log(`waitForInitialTaskCompletion:${this.initialTask}`);
                    if (this.initialTask) {
                        check();
                    } else {
                        watcher.removeListener('error', reject);
                        resolve();
                    }
                })
                .catch(reject);
            };
            watcher.once('error', reject);
            check();
        });
    }

    protected log(...messages: Parameters<typeof write>[1]): void {
        write(this.configuration.stdout, messages);
    }

    protected logError(...messages: Parameters<typeof write>[1]): void {
        write(this.configuration.stderr, messages);
    }

    protected stopWatcher(): void {
        if (this.watcher) {
            this.watcher.close();
            delete this.watcher;
        }
    }

    protected async onInitialScanCompletion(): Promise<void> {
        if (!this.configuration.watch) {
            await this.stop();
        }
        if (this.initialTask) {
            throw new Error(`initialTask should be null: ${this.initialTask}`);
        }
        this.initialTask = null;
    }

    protected onError(error: Error): void {
        this.logError(error);
    }

    protected onFileEvent(
        eventName: 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir',
        path: string,
        stats: fs.Stats,
    ): void {
        this.log(`[${eventName}] ${path}`);
        switch (eventName) {
        case 'add': {
            const promise = this.onAdd(path, stats);
            if (this.initialTask) {
                this.initialTask.push(promise);
            }
            break;
        }
        case 'change':
            this.onChange(path, stats);
            break;
        case 'unlink':
            this.onUnlink(path, stats);
            break;
        default:
        }
    }

    protected onAdd(
        path: string,
        stats: fs.Stats,
    ): Promise<void> {
        return this.onChange(path, stats);
    }

    protected async onChange(
        filePath: string,
        stats: fs.Stats,
    ): Promise<void> {
        if (!this.helperScript) {
            throw new Error(`helperScript is ${this.helperScript}`);
        }
        if (!stats.isFile()) {
            throw new Error(`${filePath} is not a file.`);
        }
        this.log('onChange:postcss');
        const postcssResult = await parseCSS({
            ...this.configuration.pluginParameters,
            file: filePath,
        });
        this.log('onChange:esifycss');
        const pluginResult = extractPluginResult(postcssResult);
        await writeFile(
            path.join(`${filePath}${path.extname(this.configuration.output)}`),
            generateScript(this.helperScript, pluginResult, postcssResult.css),
        );
        this.log('onChange:written');
        this.processedFiles.add(filePath);
    }

    protected onUnlink(
        path: string,
        stats: fs.Stats,
    ): void {
        if (this.configuration) {
            path.slice(stats.size);
        }
    }

}
