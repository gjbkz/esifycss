import {ICSSTimingFunction, CSSTimingFunctionType, CSSDefinedCubicBezierName, CSSDefinedStepName, CSSStepPosition, ICSSCubicBezierFunction, ICSSStepFunction} from './types';
import {isSameCubicBezierPoints} from './isSameCubicBezierPoints';
import {knownCubicBezierPoints} from './constants';

export const serializeCubicBezierTimingFunction = (
    timingFunction: ICSSCubicBezierFunction,
): string => [
    CSSDefinedCubicBezierName.ease,
    CSSDefinedCubicBezierName.easeIn,
    CSSDefinedCubicBezierName.easeOut,
    CSSDefinedCubicBezierName.easeInOut,
].find((name) => isSameCubicBezierPoints(
    timingFunction.points,
    knownCubicBezierPoints[name],
)) || `cubic-bezier(${timingFunction.points.join(',')})`;

export const serializeStepTimingFunction = (
    timingFunction: ICSSStepFunction,
): string => {
    if (timingFunction.stepCount === 1) {
        switch (timingFunction.stepPosition) {
        case CSSStepPosition.start:
            return CSSDefinedStepName.stepStart;
        case CSSStepPosition.end:
            return CSSDefinedStepName.stepEnd;
        default:
        }
    }
    if (timingFunction.stepPosition === CSSStepPosition.end) {
        return `steps(${timingFunction.stepCount})`;
    }
    return `steps(${timingFunction.stepCount}, ${timingFunction.stepPosition})`;
};

export const serializeTimingFunction = (
    timingFunction: ICSSTimingFunction,
): string => {
    switch (timingFunction.type) {
    case CSSTimingFunctionType.linear:
        return CSSTimingFunctionType.linear;
    case CSSTimingFunctionType.cubicBezier:
        return serializeCubicBezierTimingFunction(timingFunction);
    case CSSTimingFunctionType.step:
        return serializeStepTimingFunction(timingFunction);
    default:
        throw new Error(`Invalid timingFunction: ${JSON.stringify(timingFunction)}`);
    }
};
