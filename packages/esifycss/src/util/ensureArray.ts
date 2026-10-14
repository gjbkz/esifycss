export const ensureArray = <TType>(
    arg: Array<TType> | TType | null | undefined,
): Array<TType> => {
    if (Array.isArray(arg)) {
        return arg.slice();
    }
    return typeof arg === 'undefined' || arg === null ? [] : [arg];
};
