/**
 * Normalizes the input path to identify files on Windows.
 */
export const normalizePath = (
    input: string
): string => input.split('\\').join('/');
