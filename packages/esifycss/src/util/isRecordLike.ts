export const isRecordLike = (input: unknown): input is Record<string, unknown> => {
    if (input) {
        const type = typeof input;
        return type === 'object' || type === 'function';
    }
    return false;
};
