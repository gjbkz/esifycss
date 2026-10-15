export interface ParcelOptions {
    rootDir: string,
}

export interface ParcelAsset {
    name: string,
    type: string,
    options: ParcelOptions,
    getConfig<T>(files: Array<string>, options?: {packageKey: string}): Promise<T | null>,
}

export interface ParcelBundler {
    addAssetType(extension: string, file: string): void,
}
