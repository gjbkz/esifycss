import {ICSSCubicBezierFunctionPoints} from './types';

export const isSameCubicBezierPoints = (
    a?: ICSSCubicBezierFunctionPoints,
    b?: ICSSCubicBezierFunctionPoints,
): boolean => Boolean(a && b && a.every((value, index) => value === b[index]));
