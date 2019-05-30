import test, {ThrowsExpectation} from 'ava';
import {parseAnimationShorthand} from './parseAnimationShorthand';
import {
    ICSSAnimation,
    CSSAnimationDirection,
    CSSAnimationFillMode,
    CSSAnimationPlayState,
    CSSTimingFunctionType,
    CSSDefinedCubicBezierName,
    CSSDefinedStepName,
    CSSStepPosition,
} from './types';

const points = {
    [CSSDefinedCubicBezierName.ease]: [0.25, 0.1, 0.25, 1],
    [CSSDefinedCubicBezierName.easeIn]: [0.42, 0, 1, 1],
    [CSSDefinedCubicBezierName.easeOut]: [0, 0, 0.58, 1],
    [CSSDefinedCubicBezierName.easeInOut]: [0.42, 0, 0.58, 1],
};

interface ITest {
    input: string,
    expected: ICSSAnimation | {error: ThrowsExpectation},
}

([
    {
        input: '',
        expected: {error: {message: 'Failed to tokenize SingleAnimation'}},
    },
    {
        input: '3s none backwards',
        expected: {
            duration: 3,
            direction: CSSAnimationDirection.normal,
            delay: 0,
            fillMode: CSSAnimationFillMode.none,
            iterationCount: 1,
            name: 'backwards',
            playState: CSSAnimationPlayState.running,
            timingFunction: {
                type: CSSTimingFunctionType.cubicBezier,
                points: points[CSSDefinedCubicBezierName.ease],
            },
        },
    },
    {
        input: '3s 4s none backwards',
        expected: {
            duration: 3,
            direction: CSSAnimationDirection.normal,
            delay: 4,
            fillMode: CSSAnimationFillMode.none,
            iterationCount: 1,
            name: 'backwards',
            playState: CSSAnimationPlayState.running,
            timingFunction: {
                type: CSSTimingFunctionType.cubicBezier,
                points: points[CSSDefinedCubicBezierName.ease],
            },
        },
    },
    {
        input: '3s 4s 5s none backwards',
        expected: {error: {message: 'Unexpected delay: 5s'}},
    },
    {
        input: '3s 4s none backwards linear',
        expected: {
            duration: 3,
            direction: CSSAnimationDirection.normal,
            delay: 4,
            fillMode: CSSAnimationFillMode.none,
            iterationCount: 1,
            name: 'backwards',
            playState: CSSAnimationPlayState.running,
            timingFunction: {
                type: CSSTimingFunctionType.linear,
            },
        },
    },
    ...[
        CSSDefinedCubicBezierName.ease,
        CSSDefinedCubicBezierName.easeIn,
        CSSDefinedCubicBezierName.easeOut,
        CSSDefinedCubicBezierName.easeInOut,
    ].map((name) => ({
        input: `3s none backwards ${name}`,
        expected: {
            duration: 3,
            direction: CSSAnimationDirection.normal,
            delay: 4,
            fillMode: CSSAnimationFillMode.none,
            iterationCount: 1,
            name: 'backwards',
            playState: CSSAnimationPlayState.running,
            timingFunction: {
                type: CSSTimingFunctionType.cubicBezier,
                points: points[name],
            },
        },
    })),
    {
        input: '3s 4s none backwards cubic-bezier(0, 0.1, 0.2, 1)',
        expected: {
            duration: 3,
            direction: CSSAnimationDirection.normal,
            delay: 4,
            fillMode: CSSAnimationFillMode.none,
            iterationCount: 1,
            name: 'backwards',
            playState: CSSAnimationPlayState.running,
            timingFunction: {
                type: CSSTimingFunctionType.cubicBezier,
                points: [0, 0.1, 0.2, 1],
            },
        },
    },
    {
        input: `3s 4s none backwards ${CSSDefinedStepName.stepStart}`,
        expected: {
            duration: 3,
            direction: CSSAnimationDirection.normal,
            delay: 4,
            fillMode: CSSAnimationFillMode.none,
            iterationCount: 1,
            name: 'backwards',
            playState: CSSAnimationPlayState.running,
            timingFunction: {
                type: CSSTimingFunctionType.step,
                stepCount: 1,
                stepPosition: CSSStepPosition.jumpStart,
            },
        },
    },
    {
        input: `3s 4s none backwards ${CSSDefinedStepName.stepEnd}`,
        expected: {
            duration: 3,
            direction: CSSAnimationDirection.normal,
            delay: 4,
            fillMode: CSSAnimationFillMode.none,
            iterationCount: 1,
            name: 'backwards',
            playState: CSSAnimationPlayState.running,
            timingFunction: {
                type: CSSTimingFunctionType.step,
                stepCount: 1,
                stepPosition: CSSStepPosition.jumpEnd,
            },
        },
    },
    ...[
        CSSStepPosition.jumpStart,
        CSSStepPosition.jumpEnd,
        CSSStepPosition.start,
        CSSStepPosition.end,
        CSSStepPosition.jumpBoth,
        CSSStepPosition.jumpNone,
    ].reduce<Array<ITest>>(
        (cases, stepPosition) => [
            ...cases,
            ...[2, 20, 200]
            .map<ITest>((stepCount) => ({
                input: `3s 4s none backwards steps(${stepCount}, ${stepPosition})`,
                expected: {
                    duration: 3,
                    direction: CSSAnimationDirection.normal,
                    delay: 4,
                    fillMode: CSSAnimationFillMode.none,
                    iterationCount: 1,
                    name: 'backwards',
                    playState: CSSAnimationPlayState.running,
                    timingFunction: {
                        type: CSSTimingFunctionType.step,
                        stepCount,
                        stepPosition,
                    },
                },
            })),
        ],
        [],
    ),
    {
        input: '3s 4s none backwards steps(5)',
        expected: {
            duration: 3,
            direction: CSSAnimationDirection.normal,
            delay: 4,
            fillMode: CSSAnimationFillMode.none,
            iterationCount: 1,
            name: 'backwards',
            playState: CSSAnimationPlayState.running,
            timingFunction: {
                type: CSSTimingFunctionType.step,
                stepCount: 5,
                stepPosition: CSSStepPosition.jumpEnd,
            },
        },
    },
    {
        input: '3s 4s none backwards steps(1, jump-none)',
        expected: {error: {message: 'Invalid <step-function>: steps(1, jump-none)'}},
    },
    {
        input: '3s 4s none backwards steps(5) 5',
        expected: {
            duration: 3,
            direction: CSSAnimationDirection.normal,
            delay: 4,
            fillMode: CSSAnimationFillMode.none,
            iterationCount: 5,
            name: 'backwards',
            playState: CSSAnimationPlayState.running,
            timingFunction: {
                type: CSSTimingFunctionType.step,
                stepCount: 5,
                stepPosition: CSSStepPosition.jumpEnd,
            },
        },
    },
    {
        input: '3s 4s none backwards steps(5) 5 5',
        expected: {error: {message: 'Unexpected iterationCount: 5'}},
    },
    ...[
        CSSAnimationDirection.alternate,
        CSSAnimationDirection.alternateReverse,
        CSSAnimationDirection.normal,
        CSSAnimationDirection.reverse,
    ]
    .map((direction) => ({
        input: `3s none backwards steps(5) 5 ${direction}`,
        expected: {
            duration: 3,
            direction,
            delay: 4,
            fillMode: CSSAnimationFillMode.none,
            iterationCount: 5,
            name: 'backwards',
            playState: CSSAnimationPlayState.running,
            timingFunction: {
                type: CSSTimingFunctionType.step,
                stepCount: 5,
                stepPosition: CSSStepPosition.jumpEnd,
            },
        },
    })),
    ...[
        CSSAnimationFillMode.backwards,
        CSSAnimationFillMode.both,
        CSSAnimationFillMode.forwards,
        CSSAnimationFillMode.none,
    ]
    .map((fillMode) => ({
        input: `3s 4s steps(5) 5 alternate ${fillMode} Foo`,
        expected: {
            duration: 3,
            direction: CSSAnimationDirection.alternate,
            delay: 4,
            fillMode,
            iterationCount: 5,
            name: 'Foo',
            playState: CSSAnimationPlayState.running,
            timingFunction: {
                type: CSSTimingFunctionType.step,
                stepCount: 5,
                stepPosition: CSSStepPosition.jumpEnd,
            },
        },
    })),
] as Array<ITest>).forEach(({input, expected}, index) => {
    test(`#${index} ${JSON.stringify(input)}${'error' in expected ? ' → Error' : ''}`, (t) => {
        if ('error' in expected) {
            t.throws(() => parseAnimationShorthand(input), expected.error);
        } else {
            t.deepEqual(
                parseAnimationShorthand(input),
                expected,
            );
        }
    });
});
