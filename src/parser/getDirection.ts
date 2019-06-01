import {CSSAnimationDirection} from './types';

export const getDirection = (
    input: string,
): CSSAnimationDirection => {
    switch (input) {
    case CSSAnimationDirection.alternate:
        return CSSAnimationDirection.alternate;
    case CSSAnimationDirection.alternateReverse:
        return CSSAnimationDirection.alternateReverse;
    case CSSAnimationDirection.normal:
        return CSSAnimationDirection.normal;
    case CSSAnimationDirection.reverse:
        return CSSAnimationDirection.reverse;
    default:
        throw new Error(`Invalid <direction>: ${input}`);
    }
};
