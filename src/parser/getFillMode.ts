import {CSSAnimationFillMode} from './types';

export const getFillMode = (
    input: string,
): CSSAnimationFillMode => {
    switch (input) {
    case CSSAnimationFillMode.none:
        return CSSAnimationFillMode.none;
    case CSSAnimationFillMode.backwards:
        return CSSAnimationFillMode.backwards;
    case CSSAnimationFillMode.both:
        return CSSAnimationFillMode.both;
    case CSSAnimationFillMode.forwards:
        return CSSAnimationFillMode.forwards;
    default:
        throw new Error(`Invalid <fill-mode>: ${input}`);
    }
};
