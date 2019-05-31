#!/usr/bin/env node
import * as path from 'path';
import * as fs from 'fs';
import * as commander from 'commander';
import {write} from '../util/write';
import {Session} from '../runner/Session.js';
import {ISessionParameters} from '../runner/types.js';

const packageData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf8'));

export interface IEsifyCSSCommand extends commander.Command, ISessionParameters {}

export const program = new commander.Command()
.version(packageData.version)
.usage('[options] <include ...>')
.option('--output <path>', 'A path to the helper script.')
.option('--config <path>', 'A path to configuration files.')
.option('--exclude <path ...>', 'Paths or patterns to be excluded.')
.option('--watch', 'Watch files and update the modules automatically.') as IEsifyCSSCommand;

if (!module.parent) {
    program.parse(process.argv);
    new Session(program)
    .start()
    .catch((error: Error) => {
        write(process.stderr, [error]);
        process.exit(1);
    });
}
