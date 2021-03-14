import type {IImports, IEsifyCSSResult, IIdentifierMap} from './types';
import {getMatchedImport} from './getMatchedImport';

export const removeImportsAndRaws = (
    {result: maps, imports, rawPrefix}: {
        result: IEsifyCSSResult,
        imports: IImports,
        rawPrefix: string,
    },
): IEsifyCSSResult => {
    const isLocalTransformedIdentifier = (key: string): boolean => {
        return !key.startsWith(rawPrefix) && !getMatchedImport(key, imports);
    };
    const filter = (map: IIdentifierMap): IIdentifierMap => Object.keys(map)
    .filter(isLocalTransformedIdentifier)
    .reduce<IIdentifierMap>(
        (result, key) => {
            result[key] = map[key];
            return result;
        },
        {},
    );
    return {
        className: filter(maps.className),
        id: filter(maps.id),
        keyframes: filter(maps.keyframes),
    };
};
