import * as childProcess from 'child_process';
import * as stream from 'stream';

export interface ISpawnParameters {
    command: string,
    args?: Array<string>,
    options?: childProcess.SpawnOptionsWithoutStdio,
    stdout?: stream.Writable,
    stderr?: stream.Writable,
}
