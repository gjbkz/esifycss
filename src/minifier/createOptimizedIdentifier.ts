import type {Identifier} from '../util/createIdentifier';
import {createIdentifier} from '../util/createIdentifier';

export const createOptimizedIdentifier = (tokens: Map<string, number>): Identifier => {
    const identifier = createIdentifier();
    for (const [token] of [...tokens].sort((a, b) => b[1] - a[1])) {
        identifier(token);
    }
    return identifier;
};
