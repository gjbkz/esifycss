import {ICSSTimingFunction, CSSTimingFunctionType} from './types';
import {isSameCubicBezierPoints} from './isSameCubicBezierPoints';

export const isSameTimingFunction = (
    a: ICSSTimingFunction,
    b: ICSSTimingFunction,
): boolean => {
    switch (a.type) {
    case CSSTimingFunctionType.linear:
        return b.type === CSSTimingFunctionType.linear;
    case CSSTimingFunctionType.cubicBezier:
        return b.type === CSSTimingFunctionType.cubicBezier && isSameCubicBezierPoints(a.points, b.points);
    case CSSTimingFunctionType.step:
        return b.type === CSSTimingFunctionType.step && a.stepCount === b.stepCount && a.stepPosition === b.stepPosition;
    default:
        return false;
    }
};
