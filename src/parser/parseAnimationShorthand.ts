import {
    CSSAnimationRules,
    createTokenizerFromNormalizedRuleList,
    isASTRuleNode,
} from '@nlib/nbnf';
import {ICSSAnimation} from './types';
import {defaultCSSAnimation} from './constants';
import {compileOverwrites} from './compileOverwrites';
const tokenizeAnimation = createTokenizerFromNormalizedRuleList(CSSAnimationRules);

export const parseAnimationShorthand = (
    input: string,
): ICSSAnimation => {
    const result = tokenizeAnimation(input, 'SingleAnimation', 0, () => {});
    if (!isASTRuleNode(result)) {
        throw new Error(`Failed to parse the input: ${input}`);
    }
    return Object.assign(
        defaultCSSAnimation,
        result.nodes.reduce<Partial<ICSSAnimation>>(
            (memo, propertyWrapper) => {
                if (isASTRuleNode(propertyWrapper) && propertyWrapper.name === 'SingleAnimationProperty') {
                    const [property] = propertyWrapper.nodes;
                    if (isASTRuleNode(property)) {
                        return compileOverwrites(memo, property);
                    }
                }
                return memo;
            },
            {},
        ),
    );
};
