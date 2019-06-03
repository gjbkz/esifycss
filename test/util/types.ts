import * as childProcess from 'child_process';
import * as stream from 'stream';

export interface ICapability {
    os: string,
    os_version: string,
    browserName: string,
    device?: string,
    realMobile?: string,
}

export interface IFilledCapability extends ICapability {
    'project': string,
    'build': string,
    'browserstack.local': true,
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
