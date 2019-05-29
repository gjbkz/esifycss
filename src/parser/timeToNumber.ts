import {INBNFASTRuleNode, nodeToString, INBNFASTNode} from '@nlib/nbnf';
export const timeValueToNumber = (timeValueNode: INBNFASTNode): number => parseFloat(nodeToString(timeValueNode));
export const timeUnitToNumber = (timeUnitNode: INBNFASTNode): number => {
    const unit = nodeToString(timeUnitNode);
    switch (unit) {
    case 's':
        return 1;
    case 'ms':
        return 0.001;
    default:
        throw new Error(`Invalid <time-unit>: ${unit}`);
    }
};
export const timeToNumber = (timeNode: INBNFASTRuleNode): number => {
    const [valueNode, unitNode] = timeNode.nodes;
    return timeValueToNumber(valueNode) * timeUnitToNumber(unitNode);
};
