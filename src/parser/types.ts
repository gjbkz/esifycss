export enum CSSAnimationDirection {
    normal = 'normal',
    reverse = 'reverse',
    alternate = 'alternate',
    alternateReverse = 'alternate-reverse',
}

export enum CSSAnimationFillMode {
    none = 'none',
    forwards = 'forwards',
    backwards = 'backwards',
    both = 'both',
}

export enum CSSAnimationPlayState {
    running = 'running',
    paused = 'paused',
}

export enum CSSTimingFunctionType {
    linear = 'linear',
    cubicBezier = 'cubicBezier',
    step = 'step',
}

export enum CSSDefinedCubicBezierName {
    ease = 'ease',
    easeIn = 'ease-in',
    easeOut = 'ease-out',
    easeInOut = 'ease-in-out',
}

export enum CSSDefinedStepName {
    stepStart = 'step-start',
    stepEnd = 'step-end',
}

export enum CSSStepPosition {
    jumpStart = 'jump-start',
    jumpEnd = 'jump-end',
    start = 'jump-start',
    end = 'jump-end',
    jumpNone = 'jump-none',
    jumpBoth = 'jump-both',
}

export interface ICSSLinearFunction {
    type: CSSTimingFunctionType.linear,
}

export type ICSSCubicBezierFunctionPoints = [number, number, number, number];

export interface ICSSCubicBezierFunction {
    type: CSSTimingFunctionType.cubicBezier,
    points: ICSSCubicBezierFunctionPoints,
}

export interface ICSSStepFunction {
    type: CSSTimingFunctionType.step,
    stepCount: number,
    stepPosition: CSSStepPosition,
}

export type ICSSTimingFunction = ICSSLinearFunction | ICSSCubicBezierFunction | ICSSStepFunction;

export interface ICSSAnimation {
    duration: number,
    timingFunction: ICSSTimingFunction,
    delay: number,
    iterationCount: number,
    direction: CSSAnimationDirection,
    fillMode: CSSAnimationFillMode,
    playState: CSSAnimationPlayState,
    name: string,
}
