import fs from 'fs';
import chokidar from 'chokidar';
import {ISessionParameters, ISessionConfiguration} from './types';
import {getSessionConfiguration} from './getSessionConfiguration';
import {write} from '../util/write';

export class Session {

    public readonly configuration: Readonly<ISessionConfiguration>

    protected watcher?: chokidar.FSWatcher

    public constructor(parameters: ISessionParameters) {
        this.configuration = getSessionConfiguration(parameters);
    }

    public async start(): Promise<void> {
        await this.startWatcher();
    }

    public async stop(): Promise<void> {
        await this.stopWatcher();
    }

    protected async startWatcher(): Promise<void> {
        this.stopWatcher();
        this.watcher = chokidar.watch(
            this.configuration.path.slice(),
            this.configuration.chokidar,
        )
        .on('error', this.onError.bind(this))
        .on('all', this.onFileEvent.bind(this));
        await new Promise<void>((resolve, reject): void => {
            this.watcher
            .once('error', reject)
            .once('ready', (): void => {
                this.watcher.removeListener('error', reject);
                this.onInitialScanCompletion()
                .then(resolve)
                .catch(this.onError.bind(this));
            });
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
        case 'add':
            this.onAdd(path, stats);
            break;
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
    ): void {
        return this.onChange(path, stats);
    }

    protected onChange(
        path: string,
        stats: fs.Stats,
    ): void {
        if (this.configuration) {
            path.slice(stats.size);
        }
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
