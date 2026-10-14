import {isRecordLike} from './isRecordLike';

export const ignoreNoEntryError = (error: unknown) => {
    if (isRecordLike(error) && error.code === 'ENOENT') {
        return null;
    }
    throw error;
};
