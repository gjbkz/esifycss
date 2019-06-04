import test from 'ava';
import {serializeTimingFunction} from './serializeTimingFunction';
import {CSSTimingFunctionType, CSSDefinedCubicBezierName, CSSDefinedStepName, CSSStepPosition} from './types';
import {knownCubicBezierPoints} from './constants';

interface ITest {
    input: Parameters<typeof serializeTimingFunction>[0],
    expected: ReturnType<typeof serializeTimingFunction>,
}

([
    {
        input: {
            type: CSSTimingFunctionType.linear,
        },
        expected: CSSTimingFunctionType.linear,
    },
    ...[
        CSSDefinedCubicBezierName.ease,
        CSSDefinedCubicBezierName.easeIn,
        CSSDefinedCubicBezierName.easeOut,
        CSSDefinedCubicBezierName.easeInOut,
    ].map((name) => ({
        input: {
            type: CSSTimingFunctionType.cubicBezier,
            points: knownCubicBezierPoints[name],
        },
        expected: name,
    })),
    {
        input: {
            type: CSSTimingFunctionType.cubicBezier,
            points: [0.1, 0.2, 0.9, 1],
        },
        expected: 'cubic-bezier(0.1,0.2,0.9,1)',
    },
    {
        input: {
            type: CSSTimingFunctionType.step,
            stepCount: 1,
            stepPosition: CSSStepPosition.start,
        },
        expected: CSSDefinedStepName.stepStart,
    },
    {
        input: {
            type: CSSTimingFunctionType.step,
            stepCount: 1,
            stepPosition: CSSStepPosition.end,
        },
        expected: CSSDefinedStepName.stepEnd,
    },
    {
        input: {
            type: CSSTimingFunctionType.step,
            stepCount: 2,
            stepPosition: CSSStepPosition.end,
        },
        expected: 'steps(2)',
    },
    {
        input: {
            type: CSSTimingFunctionType.step,
            stepCount: 2,
            stepPosition: CSSStepPosition.jumpBoth,
        },
        expected: `steps(2, ${CSSStepPosition.jumpBoth})`,
    },
] as Array<ITest>).forEach(({input, expected}) => {
    test(`${JSON.stringify(input)} → ${expected === null ? 'Error' : expected}`, (t) => {
        if (expected === null) {
            t.throws(() => serializeTimingFunction(input), {message: /^Invalid timingFunction/});
        } else {
            const actual = serializeTimingFunction(input);
            t.is(actual, expected);
        }
    });
});
