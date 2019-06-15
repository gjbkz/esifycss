import * as commander from 'commander';

export interface IEsifyCSSCommand extends commander.Command {
    output: string,
    config: string,
    exclude: Array<string>,
    noMangle: boolean,
    watch: boolean,
}
