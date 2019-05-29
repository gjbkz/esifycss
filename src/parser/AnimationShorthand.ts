import {
    CSSAnimationRules,
    createTokenizerFromNormalizedRuleList,
    isASTRuleNode,
} from '@nlib/nbnf';
import {ICSSAnimation} from './types';
import {defaultCSSAnimation} from './constants';
import {forEachProperty} from './forEachProperty';
import {compileOverwrites} from './compileOverwrites';
const tokenizeAnimation = createTokenizerFromNormalizedRuleList(CSSAnimationRules);

export const parseCSSAnimationShorthand = (
    input: string,
): ICSSAnimation => {
    const result = tokenizeAnimation(input, 'SingleAnimation', 0, () => {});
    if (isASTRuleNode(result)) {
        return Object.assign(defaultCSSAnimation, forEachProperty(result.nodes, compileOverwrites, {}));
    }
    throw new Error(`Failed to parse the input: ${input}`);
};
