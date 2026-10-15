import type {ParcelBundler} from './types';

export const esifyCSSPlugin = (bundler: ParcelBundler): void => {
    bundler.addAssetType('css', require.resolve('./CSSAsset'));
};
