import {INBNFASTRuleNode, nodeToString, isASTRuleNode} from '@nlib/nbnf';
import {
    CSSTimingFunctionType,
    ICSSCubicBezierFunction,
    ICSSCubicBezierFunctionPoints,
} from './types';
import {knownCubicBezierPoints} from './constants';

export const getCubicBezierFunction = (
    timingFunctionNode: INBNFASTRuleNode,
): ICSSCubicBezierFunction => {
    let points: ICSSCubicBezierFunctionPoints | null = null;
    const firstNode = timingFunctionNode.nodes[0];
    if (isASTRuleNode(firstNode)) {
        const buffer: Array<number> = [];
        let index = 0;
        for (const node of firstNode.nodes) {
            if (isASTRuleNode(node) && node.name === 'CubicBezierEasingFunctionCoordinate') {
                buffer[index++] = parseFloat(nodeToString(node));
                if (4 <= index) {
                    points = [buffer[0], buffer[1], buffer[2], buffer[3]];
                    break;
                }
            }
        }
    } else {
        points = knownCubicBezierPoints[nodeToString(timingFunctionNode)] || null;
    }
    if (!points) {
        throw new Error(`Invalid <cubic-bezier-function>: ${nodeToString(timingFunctionNode)}`);
    }
    return {type: CSSTimingFunctionType.cubicBezier, points};
};
