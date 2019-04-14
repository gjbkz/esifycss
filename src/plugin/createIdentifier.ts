import {IIdListener, IIdentifier} from './types';

export const createIdentifier = (
    listener?: IIdListener,
): IIdentifier => {
    const knownIds = new Map<string, number>();
    let count = 0;
    return (
        key: string,
    ): number => {
        if (!knownIds.has(key)) {
            const newId = count++;
            knownIds.set(key, newId);
            if (listener) {
                listener(key, newId);
            }
        }
        return knownIds.get(key);
    };
};
