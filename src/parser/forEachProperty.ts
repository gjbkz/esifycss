import {INBNFASTNode, isASTRuleNode, INBNFASTRuleNode} from '@nlib/nbnf';
import {ICSSAnimation} from './types';

export const forEachProperty = (
    nodes: Array<INBNFASTNode>,
    fn: (
        memo: Partial<ICSSAnimation>,
        property: INBNFASTRuleNode,
    ) => Partial<ICSSAnimation>,
    memo: Partial<ICSSAnimation>,
): Partial<ICSSAnimation> => {
    let result = memo;
    for (const propertyWrapper of nodes) {
        if (isASTRuleNode(propertyWrapper) && propertyWrapper.name === 'SingleAnimationProperty') {
            const [property] = propertyWrapper.nodes;
            if (isASTRuleNode(property)) {
                result = fn(result, property);
            }
        }
    }
    return result;
};
