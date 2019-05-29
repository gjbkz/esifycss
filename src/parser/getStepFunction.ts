import {INBNFASTRuleNode, isASTRuleNode, nodeToString} from '@nlib/nbnf';
import {
    CSSTimingFunctionType,
    ICSSStepFunction,
    CSSStepPosition,
    CSSDefinedStepName,
} from './types';
import {getStepPosition} from './getStepPosition';

export const getStepFunction = (
    timingFunctionNode: INBNFASTRuleNode,
): ICSSStepFunction => {
    let stepCount: number | null = null;
    let stepPosition: CSSStepPosition | null = null;
    const firstNode = timingFunctionNode.nodes[0];
    if (isASTRuleNode(firstNode)) {
        stepPosition = CSSStepPosition.end;
        for (const node of firstNode.nodes) {
            if (isASTRuleNode(node)) {
                switch (node.name) {
                case 'StepEasingFunctionStepCount':
                    stepCount = parseInt(nodeToString(node), 10);
                    break;
                case 'StepPosition':
                    stepPosition = getStepPosition(nodeToString(node));
                    break;
                default:
                }
            }
        }
    } else {
        switch (nodeToString(timingFunctionNode)) {
        case CSSDefinedStepName.stepStart:
            stepCount = 1;
            stepPosition = CSSStepPosition.jumpStart;
            break;
        case CSSDefinedStepName.stepEnd:
            stepCount = 1;
            stepPosition = CSSStepPosition.jumpEnd;
            break;
        default:
        }
    }
    if (stepCount && stepPosition && (stepPosition !== CSSStepPosition.jumpNone || 1 < stepCount)) {
        return {
            type: CSSTimingFunctionType.step,
            stepCount,
            stepPosition,
        };
    }
    throw new Error(`Invalid <step-function>: ${nodeToString(timingFunctionNode)}`);
};
