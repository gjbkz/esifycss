import * as fs from 'node:fs';
import * as path from 'node:path';
import picomatch = require('picomatch');
import type {ReadonlyWatchOptions} from './types';

export const getWatchRoot = (pattern: string, disableGlobbing = false): string => {
    const {isGlob, base} = picomatch.scan(pattern.split(path.sep).join('/'));
    return !disableGlobbing && isGlob ? base || '.' : pattern;
};

export const getWatchConfiguration = (
    patterns: ReadonlyArray<string>,
    options: ReadonlyWatchOptions,
): {paths: Array<string>, options: ReadonlyWatchOptions} => {
    const cwd = options.cwd || process.cwd();
    const paths = patterns.filter((pattern) => !pattern.startsWith('!')).map((pattern) => {
        const root = getWatchRoot(pattern, options.disableGlobbing);
        let existing = path.resolve(cwd, root);
        // Attach before ready, including when the static directory does not exist yet.
        while (!fs.existsSync(existing)) existing = path.dirname(existing);
        return path.isAbsolute(root) ? existing : path.relative(cwd, existing) || '.';
    });
    // The ignored predicate applies depth relative to each original include root.
    return {paths: [...new Set(paths)], options: {...options, depth: undefined}};
};
