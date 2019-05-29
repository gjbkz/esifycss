import {
    ICSSAnimation,
    CSSAnimationDirection,
    CSSAnimationFillMode,
    CSSAnimationPlayState,
    CSSTimingFunctionType,
    CSSDefinedCubicBezierName,
    ICSSCubicBezierFunctionPoints,
} from './types';

export const knownCubicBezierPoints: {
    [name: string]: ICSSCubicBezierFunctionPoints | undefined,
} = {
    [CSSDefinedCubicBezierName.ease]: [0.25, 0.1, 0.25, 1],
    [CSSDefinedCubicBezierName.easeIn]: [0.42, 0, 1, 1],
    [CSSDefinedCubicBezierName.easeOut]: [0, 0, 0.58, 1],
    [CSSDefinedCubicBezierName.easeInOut]: [0.42, 0, 0.58, 1],
};

export const defaultCSSAnimation: ICSSAnimation = {
    name: 'none',
    duration: 0,
    timingFunction: {
        type: CSSTimingFunctionType.cubicBezier,
        points: [0.25, 0.1, 0.25, 1],
    },
    delay: 0,
    iterationCount: 1,
    direction: CSSAnimationDirection.normal,
    fillMode: CSSAnimationFillMode.none,
    playState: CSSAnimationPlayState.running,
};
