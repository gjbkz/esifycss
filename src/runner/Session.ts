import * as fs from 'fs';
import * as chokidar from 'chokidar';
import * as path from 'path';
import {ISessionOptions, ISessionConfiguration} from './types';
import {getSessionConfiguration} from './getSessionConfiguration';
import {write} from '../util/write';
import {parseCSS} from './parseCSS';
import {extractPluginResult} from './extractPluginResult';
import {writeFile, deleteFile, copyFile} from '../util/fs';
import {generateScript} from './generateScript';
import {waitForInitialScanCompletion} from './waitForInitialScanCompletion';
import {minifyScripts} from '../minifier/minifyScripts';
import {createExposedPromise, IExposedPromise} from '../util/createExposedPromise';

export class Session {

    public readonly configuration: Readonly<ISessionConfiguration>;

    protected watcher?: chokidar.FSWatcher;

    protected processedFiles: Set<string>;

    protected initialTask: Array<Promise<void>> | null;

    protected tasks: Set<Promise<void>>;

    public constructor(parameters: ISessionOptions = {}) {
        this.configuration = getSessionConfiguration(parameters);
        this.processedFiles = new Set();
        this.initialTask = null;
        this.tasks = new Set();
    }

    public get helperPath(): string {
        const srcDirectory = path.join(__dirname, '..', 'helper');
        return path.join(srcDirectory, `index${this.configuration.ext}`);
    }

    public async start(): Promise<void> {
        await this.outputHelperScript();
        await this.startWatcher();
    }

    public async stop(): Promise<void> {
        await this.stopWatcher();
    }

    public async outputHelperScript(): Promise<void> {
        if (this.configuration.output.type === 'script') {
            await copyFile(this.helperPath, this.configuration.output.path);
        }
    }

    public async processCSS(
        filePath: string,
    ): Promise<{dest: string, code: string}> {
        if (0 < this.tasks.size) {
            await this.waitCurrentTasks();
        }
        const exposedPromise = this.createExposedPromise();
        const {configuration} = this;
        const postcssResult = await parseCSS({
            plugins: configuration.postcssPlugins,
            options: configuration.postcssOptions,
            file: filePath,
        })
        .catch((error) => {
            exposedPromise.resolve();
            throw error;
        });
        const dest = path.join(`${filePath}${configuration.ext}`);
        this.processedFiles.add(filePath);
        const {output} = configuration;
        const code = generateScript({
            output: dest,
            helper: output.type === 'css' ? null : output.path,
            result: extractPluginResult(postcssResult),
            root: postcssResult.root,
        });
        exposedPromise.resolve();
        return {dest, code};
    }

    public async minifyScripts(): Promise<void> {
        await minifyScripts(
            this.configuration.output,
            [...this.processedFiles].map((file) => `${file}${this.configuration.ext}`),
        );
    }

    protected async waitCurrentTasks(): Promise<void> {
        await Promise.all([...this.tasks]);
    }

    protected createExposedPromise(): IExposedPromise {
        const exposedPromise = createExposedPromise();
        this.tasks.add(exposedPromise.promise);
        const removeTask = () => this.tasks.delete(exposedPromise.promise);
        exposedPromise.promise
        .then(removeTask)
        .catch(removeTask);
        return exposedPromise;
    }

    protected async startWatcher(): Promise<void> {
        await this.stopWatcher();
        this.initialTask = [];
        this.log(`watching: ${this.configuration.path.join(', ')}`);
        const watcher = this.watcher = chokidar.watch(
            this.configuration.path.slice(),
            this.configuration.chokidar,
        )
        .on('error', this.onError.bind(this))
        .on('all', (eventName, file, stats) => {
            this.onFileEvent(eventName, file, stats)
            .catch((error) => {
                watcher.emit('error', error);
            });
        });
        await waitForInitialScanCompletion(this.watcher);
        await Promise.all(this.initialTask);
        this.initialTask = null;
        if (!this.configuration.watch) {
            await this.minifyScripts();
            await this.stop();
        }
    }

    protected log(...messages: Parameters<typeof write>[1]): void {
        write(this.configuration.stdout, messages);
    }

    protected logError(...messages: Parameters<typeof write>[1]): void {
        write(this.configuration.stderr, messages);
    }

    protected async stopWatcher(): Promise<void> {
        if (this.watcher) {
            await this.watcher.close();
            delete this.watcher;
        }
        await Promise.resolve(null);
    }

    protected onError(error: Error): void {
        this.logError(error);
    }

    protected async onFileEvent(
        eventName: 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir',
        file: string,
        stats?: fs.Stats,
    ): Promise<void> {
        this.log(`[${eventName}] ${file}`);
        switch (eventName) {
        case 'add': {
            const promise = this.onAdd(file, stats);
            if (this.initialTask) {
                this.initialTask.push(promise);
            }
            await promise;
            break;
        }
        case 'change':
            await this.onChange(file, stats);
            break;
        case 'unlink':
            await this.onUnlink(file);
            break;
        default:
        }
    }

    protected async onAdd(
        file: string,
        stats?: fs.Stats,
    ): Promise<void> {
        await this.onChange(file, stats);
    }

    protected async onChange(
        file: string,
        stats?: fs.Stats,
    ): Promise<void> {
        if (!stats) {
            throw new Error(`no stats is given for ${file}.`);
        }
        if (!stats.isFile()) {
            throw new Error(`${file} is not a file.`);
        }
        const {dest, code} = await this.processCSS(file);
        await writeFile(dest, code, this.configuration.stdout);
    }

    protected async onUnlink(
        file: string,
    ): Promise<void> {
        const outputPath = path.join(`${file}${this.configuration.ext}`);
        this.processedFiles.delete(file);
        await deleteFile(outputPath, this.configuration.stdout);
    }

}
