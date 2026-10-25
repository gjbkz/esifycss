import * as path from 'node:path';
import picomatch = require('picomatch');
import {ensureArray} from '../util/ensureArray';
import {getWatchRoot} from './getWatchConfiguration';
import type {SessionOptions, ReadonlyWatchOptions} from './types';

export const getChokidarOptions = (
    {chokidar: options = {}, exclude, css}: SessionOptions,
    include?: ReadonlyArray<string>,
): ReadonlyWatchOptions => {
    const cwd = options.cwd ? path.resolve(options.cwd) : '';
    const normalize = (file: string, base = cwd) => (base ? path.resolve(base, file) : path.normalize(file)).split(path.sep).join('/');
    const ignored = [...ensureArray(options.ignored), ...ensureArray(exclude), ...(css ? [css, path.resolve(css)] : [])];
    const strings = ignored.filter((pattern): pattern is string => typeof pattern === 'string');
    const negatives = strings.filter((pattern) => pattern.startsWith('!')).map((pattern) => normalize(pattern.slice(1)));
    const positives = strings.filter((pattern) => !pattern.startsWith('!')).flatMap((pattern) => {
        const normalized = normalize(pattern).replace(/\/$/, '');
        return picomatch.scan(normalized).isGlob ? [normalized] : [normalized, `${normalized}/**`];
    });
    const matchIgnored = picomatch(positives, {dot: true});
    const matchKept = picomatch(negatives, {dot: true});
    const base = cwd || process.cwd();
    const excluded = picomatch((include || []).filter((pattern) => pattern.startsWith('!')).map((pattern) => normalize(pattern.slice(1), base)), {dot: true});
    const matchers = (include || []).filter((pattern) => !pattern.startsWith('!')).map((pattern) => {
        const absolute = normalize(pattern, base);
        const root = getWatchRoot(absolute, options.disableGlobbing);
        return {
            root: root === absolute ? path.dirname(root) : root,
            recursive: root !== absolute,
            matches: options.disableGlobbing ? (file: string) => file === absolute : picomatch([absolute], {dot: true}),
        };
    });
    return {
        ...options,
        ...(cwd ? {cwd} : {}),
        ignoreInitial: false,
        alwaysStat: true,
        ignored: (file, stats) => {
            const normalized = normalize(file);
            if (!matchKept(normalized) && (matchIgnored(normalized) || ignored.some((matcher) => matcher instanceof RegExp
                ? matcher.test(normalized) : typeof matcher === 'function' && matcher(normalized, stats)))) return true;
            if (!include || !stats) return false;
            const absolute = normalize(file, base);
            if (excluded(absolute)) return true;
            return !matchers.some(({root, recursive, matches}) => {
                const relative = path.relative(root, absolute);
                const within = relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
                const depth = relative.split(path.sep).filter(Boolean).length - (stats.isDirectory() ? 0 : 1);
                if (stats.isDirectory()) {
                    const ancestor = path.relative(absolute, root);
                    if (ancestor !== '..' && !ancestor.startsWith(`..${path.sep}`) && !path.isAbsolute(ancestor)) return true;
                    if (!recursive || !within) return false;
                } else if (!matches(absolute)) return false;
                return options.depth === undefined || depth <= options.depth;
            });
        },
    };
};
