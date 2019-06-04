import * as childProcess from 'child_process';
import * as stream from 'stream';

export interface ICapability {
    os?: string,
    os_version: string,
    browserName?: string,
    device?: string,
    real_mobile?: 'true' | 'false',
}

export interface IFilledCapability extends ICapability {
    'project': string,
    'build': string,
    'name': string,
    'real_mobile'?: 'true' | 'false',
    'browserstack.local': 'true' | 'false',
    'browserstack.localIdentifier': string,
    'browserstack.user': string,
    'browserstack.key': string,
}

export interface ISpawnParameters {
    command: string,
    args?: Array<string>,
    options?: childProcess.SpawnOptionsWithoutStdio,
    stdout?: stream.Writable,
    stderr?: stream.Writable,
}
