import test from 'ava';
import {serializeCSSAnimationShorthand} from './serializeAnimationShorthand';
import {CSSAnimationPlayState, CSSAnimationFillMode, CSSAnimationDirection, CSSTimingFunctionType, CSSDefinedCubicBezierName} from './types';
import {knownCubicBezierPoints} from './constants';

interface ITest {
    input: Parameters<typeof serializeCSSAnimationShorthand>[0],
    expected: string,
}

([
    {
        input: {
            duration: 1,
            timingFunction: {
                type: CSSTimingFunctionType.cubicBezier,
                points: knownCubicBezierPoints[CSSDefinedCubicBezierName.ease],
            },
            delay: 0,
            iterationCount: 1,
            direction: CSSAnimationDirection.normal,
            fillMode: CSSAnimationFillMode.none,
            playState: CSSAnimationPlayState.running,
            name: 'none',
        },
        expected: 'none',
    },
    {
        input: {
            duration: 1,
            timingFunction: {
                type: CSSTimingFunctionType.cubicBezier,
                points: knownCubicBezierPoints[CSSDefinedCubicBezierName.ease],
            },
            delay: 0,
            iterationCount: 1,
            direction: CSSAnimationDirection.normal,
            fillMode: CSSAnimationFillMode.none,
            playState: CSSAnimationPlayState.running,
            name: 'aaa',
        },
        expected: '1s aaa',
    },
    {
        input: {
            duration: 1,
            timingFunction: {
                type: CSSTimingFunctionType.cubicBezier,
                points: knownCubicBezierPoints[CSSDefinedCubicBezierName.ease],
            },
            delay: 0,
            iterationCount: Infinity,
            direction: CSSAnimationDirection.normal,
            fillMode: CSSAnimationFillMode.none,
            playState: CSSAnimationPlayState.running,
            name: 'aaa',
        },
        expected: '1s infinite aaa',
    },
    {
        input: {
            duration: 1,
            timingFunction: {
                type: CSSTimingFunctionType.cubicBezier,
                points: knownCubicBezierPoints[CSSDefinedCubicBezierName.ease],
            },
            delay: 0,
            iterationCount: Infinity,
            direction: CSSAnimationDirection.reverse,
            fillMode: CSSAnimationFillMode.none,
            playState: CSSAnimationPlayState.running,
            name: 'aaa',
        },
        expected: '1s infinite reverse aaa',
    },
    {
        input: {
            duration: 1,
            timingFunction: {
                type: CSSTimingFunctionType.cubicBezier,
                points: knownCubicBezierPoints[CSSDefinedCubicBezierName.ease],
            },
            delay: 0,
            iterationCount: Infinity,
            direction: CSSAnimationDirection.reverse,
            fillMode: CSSAnimationFillMode.both,
            playState: CSSAnimationPlayState.running,
            name: 'aaa',
        },
        expected: '1s infinite reverse both aaa',
    },
    {
        input: {
            duration: 1,
            timingFunction: {
                type: CSSTimingFunctionType.cubicBezier,
                points: knownCubicBezierPoints[CSSDefinedCubicBezierName.ease],
            },
            delay: 0,
            iterationCount: Infinity,
            direction: CSSAnimationDirection.reverse,
            fillMode: CSSAnimationFillMode.both,
            playState: CSSAnimationPlayState.paused,
            name: 'aaa',
        },
        expected: '1s infinite reverse both paused aaa',
    },
] as Array<ITest>).forEach(({input, expected}) => {
    test(JSON.stringify(input), (t) => {
        const actual = serializeCSSAnimationShorthand(input);
        t.is(actual, expected);
    });
});
