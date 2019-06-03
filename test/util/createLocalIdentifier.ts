import {buildId} from './constants';

export const createLocalIdentifier = (
    name: string,
): string => `${buildId}/${name}`.replace(/[^\w-]/g, (c) => `_${(c.codePointAt(0) || 0).toString(36)}`);
