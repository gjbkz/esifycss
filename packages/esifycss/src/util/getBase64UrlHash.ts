import type {Hash} from 'crypto';
import {createHash} from 'crypto';

export const getBase64UrlHash = (...dataList: Array<Parameters<Hash['update']>[0]>): Buffer | string => {
    const hash = createHash('sha256');
    for (const data of dataList) {
        hash.update(data);
    }
    return hash.digest('base64').split('+').join('-').split('/').join('_').replace(/[=]+$/, '');
};
