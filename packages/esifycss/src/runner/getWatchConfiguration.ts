import * as fs from 'node:fs';
import * as path from 'node:path';
import globParent = require('glob-parent');
import isGlob = require('is-glob');
import type {ReadonlyWatchOptions} from './types';

export const getWatchRoot = (pattern: string, disableGlobbing = false): string => {
    const normalized = pattern.split(path.sep).join('/');
    return !disableGlobbing && isGlob(normalized) ? globParent(normalized) : pattern;
};

export const getWatchConfiguration = (
    patterns: ReadonlyArray<string>,
    options: ReadonlyWatchOptions,
): {paths: Array<string>, options: ReadonlyWatchOptions} => {
    const cwd = options.cwd || process.cwd();
    let depthOffset = 0;
    const paths = patterns.filter((pattern) => !pattern.startsWith('!')).map((pattern) => {
        const root = getWatchRoot(pattern, options.disableGlobbing);
        const absolute = path.resolve(cwd, root);
        let existing = absolute;
        // Attach before ready, including when a glob's static directory does not exist yet.
        while (!fs.existsSync(existing)) existing = path.dirname(existing);
        const offset = path.relative(existing, absolute).split(path.sep).filter(Boolean).length;
        depthOffset = Math.max(depthOffset, offset);
        return path.isAbsolute(root) ? existing : path.relative(cwd, existing) || '.';
    });
    return {
        paths: [...new Set(paths)],
        options: {
            ...options,
            ...(options.depth === undefined ? {} : {depth: options.depth + depthOffset}),
        },
    };
};
