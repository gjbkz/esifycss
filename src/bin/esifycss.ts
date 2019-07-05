#!/usr/bin/env node
import * as path from 'path';
import * as fs from 'fs';
import * as commander from 'commander';
import {write} from '../util/write';
import {Session} from '../runner/Session.js';
import {loadParameters} from './loadParameters';
import {IEsifyCSSCommand} from './types';

const packageData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf8')) as {
    version: string,
};

export const program = new commander.Command()
.version(packageData.version)
.usage('[options] <include ...>')
.option('--helper <path>', 'A path to the helper script.')
.option('--config <path>', 'A path to configuration files.')
.option('--exclude <path ...>', 'Paths or patterns to be excluded.')
.option('--noMangle', 'Keep the original name for debugging.')
.option('--watch', 'Watch files and update the modules automatically.') as IEsifyCSSCommand;

if (!module.parent) {
    program.parse(process.argv);
    loadParameters(program)
    .then((parameters) => new Session(parameters).start())
    .catch((error: Error) => {
        write(process.stderr, [error]);
        process.exit(1);
    });
}
