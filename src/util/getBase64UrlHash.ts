import type {BinaryToTextEncoding, BinaryLike} from 'crypto';
import {createHash} from 'crypto';

export interface IHashOptions {
    algorithm: string,
    encoding: BinaryToTextEncoding | 'base64url' | 'buffer',
}

export const getBase64UrlHash = (...dataList: Array<BinaryLike>): Buffer | string => {
    const hash = createHash('sha256');
    for (const data of dataList) {
        hash.update(data);
    }
    return hash.digest('base64').split('+').join('-').split('/').join('_').replace(/[=]+$/, '');
};
