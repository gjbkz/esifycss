import type * as childProcess from 'child_process';
import type * as stream from 'stream';

export interface ISpawnParameters {
    command: string,
    args?: Array<string>,
    options?: childProcess.SpawnOptionsWithoutStdio,
    stdout?: stream.Writable,
    stderr?: stream.Writable,
}
