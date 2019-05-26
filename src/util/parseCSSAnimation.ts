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

export interface ICSSAnimation {
    name: string,
    duration: string,
    timingFunction: string,
    delay: string,
    iterationCount: string,
    direction: CSSAnimationDirection,
    fillMode: CSSAnimationFillMode,
    playState: CSSAnimationPlayState,
}

export const defaultCSSAnimation: ICSSAnimation = {
    name: 'none',
    duration: '0s',
    timingFunction: 'ease',
    delay: '0s',
    iterationCount: '1',
    direction: CSSAnimationDirection.normal,
    fillMode: CSSAnimationFillMode.none,
    playState: CSSAnimationPlayState.running,
};

export const parseCSSAnimation = (
    input: string,
): ICSSAnimation => Object.assign(
    defaultCSSAnimation,
    input.trim().split(/\s+/).reduce<Partial<ICSSAnimation>>((overwrites, fragment) => {
        console.log(fragment);
        return overwrites;
    }, {}),
);
