export interface IIdentifier {
    readonly idList: Array<string>,
    (key: string): number,
}

export interface IIdListener {
    (
        key: string,
        id: number,
    ): void,
}

export const createIdentifier = (
    listener?: IIdListener,
): IIdentifier => {
    const knownIdList = new Map<string, number>();
    let count = 0;
    const identifier = (
        key: string,
    ): number => {
        let id = knownIdList.get(key);
        if (typeof id === 'undefined') {
            id = count++;
            knownIdList.set(key, id);
            if (listener) {
                listener(key, id);
            }
        }
        return id;
    };
    Object.defineProperty(identifier, 'idList', {
        get: () => {
            const result: Array<string> = [];
            for (const [id, index] of knownIdList) {
                result[index] = id;
            }
            return result;
        },
    });
    return identifier as IIdentifier;
};
