#!/usr/bin/env node

import * as program from 'commander';
import * as packageData from '../../package.json';
import {write} from '../util/write';
import {Session} from '../runner/Session.js';

new program.Command()
.version(packageData.version)
.usage('[options] <include ...>')
.option('--config <path>', 'A path to configuration files.')
.option('--dest <path>', 'A path to concatenated css.')
.option('--watch', 'Watch files and update module automatically.')
.option('--mangle', 'Minify classnames for production build.')
.option('--ext <string>', 'An extension of generated modules.')
.option('--baseDir <path>', 'A path which is used to generate modules to outputDir.')
.option('--outputDir <path>', 'A path to a directory where modules are generated.')
.option('--classesOnly', 'If it is true, a CSS file exports classes as default export. Otherwise, {classes, properties} is exported.', Boolean)
.parse(process.argv);

program.patterns = program.args;
new Session({
    include: [],
    // watch: program.watch,
})
.start()
.catch((error: Error) => {
    write(process.stderr, [error]);
    process.exit(1);
});
