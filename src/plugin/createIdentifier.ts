import {IIdListener, IIdentifier} from './types';

export const createIdentifier = (
    listener?: IIdListener,
): IIdentifier => {
    const knownIds = new Map<string, number>();
    let count = 0;
    return (
        key: string,
    ): number => {
        let id = knownIds.get(key);
        if (typeof id === 'undefined') {
            id = count++;
            knownIds.set(key, id);
            if (listener) {
                listener(key, id);
            }
        }
        return id;
    };
};
