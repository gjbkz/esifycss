import type {Command} from 'commander';

export interface IEsifyCSSCommand extends Command {
    helper: string,
    config: string,
    exclude: Array<string>,
    noMangle: boolean,
    watch: boolean,
}
