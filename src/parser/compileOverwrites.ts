import {nodeToString, INBNFASTRuleNode} from '@nlib/nbnf';
import {ICSSAnimation} from './types';
import {timeToNumber} from './timeToNumber';
import {getFillMode} from './getFillMode';
import {getTimingFunction} from './getTimingFunction';
import {getDirection} from './getDirection';

const overwrite = <TKey extends keyof ICSSAnimation>(
    key: TKey,
    value: ICSSAnimation[TKey],
    overwrites: Partial<ICSSAnimation>,
    property: INBNFASTRuleNode,
) => {
    if (key in overwrites) {
        throw new Error(`Unexpected ${key}: ${nodeToString(property)}`);
    }
    overwrites[key] = value;
};

export const compileOverwrites = (
    overwrites: Partial<ICSSAnimation>,
    property: INBNFASTRuleNode,
) => {
    switch (property.name) {
    case 'Time':
        if ('duration' in overwrites) {
            overwrite('delay', timeToNumber(property), overwrites, property);
        } else {
            overwrite('duration', timeToNumber(property), overwrites, property);
        }
        break;
    case 'KeyframesName':
        overwrite('name', nodeToString(property), overwrites, property);
        break;
    case 'SingleAnimationFillMode':
        if ('fillMode' in overwrites) {
            overwrite('name', nodeToString(property), overwrites, property);
        } else {
            overwrite('fillMode', getFillMode(nodeToString(property)), overwrites, property);
        }
        break;
    case 'EasingFunction':
        if ('timingFunction' in overwrites) {
            overwrite('name', nodeToString(property), overwrites, property);
        } else {
            overwrite('timingFunction', getTimingFunction(property.nodes), overwrites, property);
        }
        break;
    case 'SingleAnimationIterationCount': {
        const value = nodeToString(property);
        overwrite('iterationCount', value === 'infinite' ? Infinity : parseInt(value, 10), overwrites, property);
        break;
    }
    case 'SingleAnimationDirection':
        overwrite('direction', getDirection(nodeToString(property)), overwrites, property);
        break;
    default:
        throw new Error(`Invalid <single-animation>: ${nodeToString(property)}`);
    }
    return overwrites;
};
