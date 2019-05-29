import {ICSSTimingFunction, CSSTimingFunctionType, CSSDefinedCubicBezierName, CSSDefinedStepName, CSSStepPosition} from './types';
import {isSameCubicBezierPoints} from './isSameCubicBezierPoints';
import {knownCubicBezierPoints} from './constants';

export const serializeTimingFunction = (
    timingFunction: ICSSTimingFunction,
): string => {
    switch (timingFunction.type) {
    case CSSTimingFunctionType.linear:
        return CSSTimingFunctionType.linear;
    case CSSTimingFunctionType.cubicBezier:
        return [
            CSSDefinedCubicBezierName.ease,
            CSSDefinedCubicBezierName.easeIn,
            CSSDefinedCubicBezierName.easeOut,
            CSSDefinedCubicBezierName.easeInOut,
        ].find((name) => isSameCubicBezierPoints(
            timingFunction.points,
            knownCubicBezierPoints[name],
        )) || `cubic-bezier(${timingFunction.points.join('')})`;
    case CSSTimingFunctionType.step:
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
    default:
        throw new Error(`Invalid timingFunction: ${JSON.stringify(timingFunction)}`);
    }
};
