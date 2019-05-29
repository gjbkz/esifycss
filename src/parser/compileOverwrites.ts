import {
    nodeToString,
    INBNFASTRuleNode,
} from '@nlib/nbnf';
import {ICSSAnimation} from './types';
import {timeToNumber} from './timeToNumber';
import {getFillMode} from './getFillMode';
import {getTimingFunction} from './getTimingFunction';
import {getDirection} from './getDirection';

export const compileOverwrites = (
    overwrites: Partial<ICSSAnimation>,
    property: INBNFASTRuleNode,
) => {
    switch (property.name) {
    case 'Time':
        if ('delay' in overwrites) {
            throw new Error(`Unexpected <time>: ${nodeToString(property)}`);
        }
        if ('duration' in overwrites) {
            overwrites.delay = timeToNumber(property);
        } else {
            overwrites.duration = timeToNumber(property);
        }
        break;
    case 'KeyframesName':
        overwrites.name = nodeToString(property);
        break;
    case 'SingleAnimationFillMode':
        if ('fillMode' in overwrites) {
            overwrites.name = nodeToString(property);
        } else {
            overwrites.fillMode = getFillMode(nodeToString(property));
        }
        break;
    case 'EasingFunction':
        if ('timingFunction' in overwrites) {
            overwrites.name = nodeToString(property);
        } else {
            overwrites.timingFunction = getTimingFunction(property.nodes);
        }
        break;
    case 'SingleAnimationIterationCount': {
        const value = nodeToString(property);
        overwrites.iterationCount = value === 'infinite' ? Infinity : parseInt(value, 10);
        break;
    }
    case 'SingleAnimationDirection':
        overwrites.direction = getDirection(nodeToString(property));
        break;
    default:
        throw new Error(`Invalid <single-animation>: ${nodeToString(property)}`);
    }
    return overwrites;
};
