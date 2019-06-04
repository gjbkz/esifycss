import {INBNFASTNode, isASTRuleNode, nodeListToString} from '@nlib/nbnf';
import {ICSSTimingFunction, CSSTimingFunctionType} from './types';
import {getCubicBezierFunction} from './getCubicBezierFunction';
import {getStepFunction} from './getStepFunction';

export const getTimingFunction = (
    timingFunctionNodes: Array<INBNFASTNode>,
): ICSSTimingFunction => {
    const [timingFunctionNode] = timingFunctionNodes;
    if (isASTRuleNode(timingFunctionNode)) {
        switch (timingFunctionNode.name) {
        case 'CubicBezierEasingFunction':
            return getCubicBezierFunction(timingFunctionNode);
        case 'StepEasingFunction':
            return getStepFunction(timingFunctionNode);
        default:
        }
    } else if (nodeListToString(timingFunctionNodes) === 'linear') {
        return {type: CSSTimingFunctionType.linear};
    }
    throw new Error(`Invalid <timing-function>: ${nodeListToString(timingFunctionNodes)}`);
};
