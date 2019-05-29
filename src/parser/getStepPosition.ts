import {CSSStepPosition} from './types';

export const getStepPosition = (
    input: string,
): CSSStepPosition => {
    switch (input) {
    case 'jump-start':
        return CSSStepPosition.jumpStart;
    case 'jump-end':
        return CSSStepPosition.jumpEnd;
    case 'jump-none':
        return CSSStepPosition.jumpNone;
    case 'jump-both':
        return CSSStepPosition.jumpBoth;
    default:
    }
    throw new Error(`Invalid <step-position>: ${input}`);
};
