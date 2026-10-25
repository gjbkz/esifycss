import * as path from 'node:path';
import type {Stats} from 'node:fs';
import anymatch from 'anymatch';
import isGlob = require('is-glob');
import {ensureArray} from '../util/ensureArray';
import {getWatchRoot} from './getWatchConfiguration';
import type {SessionOptions, ReadonlyWatchOptions, WatchOptions} from './types';

const normalizeFilePath = (value: string, cwd: string): string => {
    let normalizedPath = cwd ? path.resolve(cwd, value) : path.normalize(value);
    if (normalizedPath.endsWith(path.sep) && normalizedPath !== path.parse(normalizedPath).root) {
        normalizedPath = normalizedPath.slice(0, -1);
    }
    return normalizedPath.split(path.sep).join('/');
};

const normalizePattern = (pattern: string, cwd: string): string => pattern.startsWith('!')
    ? `!${normalizeFilePath(pattern.slice(1), cwd)}`
    : normalizeFilePath(pattern, cwd);

export const getChokidarOptions = (
    {chokidar: chokidarOptions = {}, exclude, css}: SessionOptions,
    include?: ReadonlyArray<string>,
): ReadonlyWatchOptions => {
    const cwd = chokidarOptions.cwd ? path.resolve(chokidarOptions.cwd) : '';
    const options: WatchOptions = {
        ...chokidarOptions,
        ...(cwd ? {cwd} : {}),
        ignoreInitial: false,
        alwaysStat: true,
    };
    const ignored = [
        ...ensureArray(chokidarOptions.ignored),
        ...ensureArray(exclude),
        ...(include || []).filter((pattern) => pattern.startsWith('!')).map((pattern) => pattern.slice(1)),
    ];
    if (css) {
        ignored.push(css, path.resolve(css));
    }
    const ignoredPatterns = ignored.map((matcher) => typeof matcher === 'string' ? normalizePattern(matcher, cwd) : matcher);
    const matchIgnored = anymatch([
        ...ignoredPatterns,
        ...ignoredPatterns.filter((matcher): matcher is string => typeof matcher === 'string' && !isGlob(matcher))
        .map((matcher) => `${matcher}/**`),
    ], null, {dot: true});
    const base = cwd || process.cwd();
    const includedPatterns = (include || []).map((pattern) => normalizePattern(pattern, base));
    const matchIncluded = chokidarOptions.disableGlobbing
        ? (file: string) => includedPatterns.includes(file)
        : anymatch(includedPatterns, null, {dot: true});
    const includeMatchers = includedPatterns.filter((pattern) => !pattern.startsWith('!')).map((pattern) => {
        const root = getWatchRoot(pattern, chokidarOptions.disableGlobbing);
        return {
            root: root === pattern ? path.dirname(root) : root,
            recursive: root !== pattern,
            matches: chokidarOptions.disableGlobbing
                ? (file: string) => file === pattern
                : anymatch(pattern, null, {dot: true}),
        };
    });
    const matchesFile = (file: string) => matchIncluded(file) && includeMatchers.some(({root, matches}) => {
        const depth = Math.max(0, path.relative(root, file).split(path.sep).filter(Boolean).length - 1);
        return matches(file) && (chokidarOptions.depth === undefined || depth <= chokidarOptions.depth);
    });
    const within = (parent: string, child: string) => {
        const relative = path.relative(parent, child);
        return relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
    };
    const matchesDirectory = (file: string) => includeMatchers.some(({root, recursive}) => {
        if (within(file, root)) return true;
        const depth = path.relative(root, file).split(path.sep).filter(Boolean).length;
        return recursive && within(root, file) && (chokidarOptions.depth === undefined || depth <= chokidarOptions.depth);
    });
    options.ignored = (file, stats?: Stats) => {
        if (matchIgnored([file, stats])) return true;
        if (!include || !stats) return false;
        const absolute = normalizeFilePath(file, base);
        return stats.isDirectory() ? !matchesDirectory(absolute) : !matchesFile(absolute);
    };
    return options;
};
