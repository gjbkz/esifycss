import {Hash, createHash, BinaryToTextEncoding} from 'crypto';

export interface IHashOptions {
    algorithm: string,
    encoding: BinaryToTextEncoding | 'base64url' | 'buffer',
}

export const getHash = (
    data: Parameters<Hash['update']>[0],
    {algorithm, encoding}: IHashOptions = {algorithm: 'sha256', encoding: 'base64url'},
): string | Buffer => {
    const hash = createHash(algorithm);
    hash.update(data);
    switch (encoding) {
    case 'base64url':
        return hash.digest('base64').split('+').join('-').split('/').join('_').replace(/[=]+$/, '');
    case 'buffer':
        return hash.digest();
    default:
        return hash.digest(encoding);
    }
};
