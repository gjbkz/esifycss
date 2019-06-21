import {createIdentifier, IIdentifier} from '../util/createIdentifier';

export const createOptimizedIdentifier = (
    tokens: Map<string, number>,
): IIdentifier => {
    const identifier = createIdentifier();
    for (const [token] of [...tokens].sort((a, b) => b[1] - a[1])) {
        identifier(token);
    }
    return identifier;
};
