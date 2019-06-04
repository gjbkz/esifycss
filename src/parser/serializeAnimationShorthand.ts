import {ICSSAnimation, CSSAnimationDirection, CSSAnimationFillMode, CSSAnimationPlayState} from './types';
import {serializeTimingFunction} from './serializeTimingFunction';

export const serializeCSSAnimationShorthand = (
    animation: ICSSAnimation,
): string => {
    if (animation.name === 'none') {
        return animation.name;
    }
    const chunks: Array<string> = [`${animation.duration}s`];
    const timingFunction = serializeTimingFunction(animation.timingFunction);
    if (timingFunction !== 'ease') {
        chunks.push(timingFunction);
    }
    if (0 < animation.delay) {
        chunks.push(`${animation.delay}s`);
    }
    if (animation.iterationCount !== 1) {
        chunks.push(Number.isFinite(animation.iterationCount) ? `${animation.iterationCount}` : 'infinite');
    }
    if (animation.direction !== CSSAnimationDirection.normal) {
        chunks.push(animation.direction);
    }
    if (animation.fillMode !== CSSAnimationFillMode.none) {
        chunks.push(animation.fillMode);
    }
    if (animation.playState !== CSSAnimationPlayState.running) {
        chunks.push(animation.playState);
    }
    chunks.push(animation.name);
    return chunks.join(' ');
};
