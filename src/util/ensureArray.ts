export const ensureArray = <TType>(
    arg: Array<TType> | TType | undefined | null,
): Array<TType> => {
    if (Array.isArray(arg)) {
        return arg.slice();
    }
    return typeof arg === 'undefined' || arg === null ? [] : [arg];
};
