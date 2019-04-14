export const ensureArray = <T>(
    arg: Array<T> | T | undefined | null,
): Array<T> => {
    if (Array.isArray(arg)) {
        return arg;
    }
    return arg ? [arg] : [];
};
