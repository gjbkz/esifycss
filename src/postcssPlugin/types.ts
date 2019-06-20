import {IIdentifier} from '../util/createIdentifier';

export interface IPluginMangler {
    (
        id: string,
        type: string,
        name: string,
    ): string,
}

export interface IPluginParameter {
    /**
     * When it is true, this plugin minifies classnames.
     */
    mangle?: boolean,
    /**
     * A function returns an unique number from a given file id.
     */
    identifier?: IIdentifier,
    /**
     * See the mangler section below. If it is set, `mangle`
     * and `identifier` options are ignored.
     */
    mangler?: IPluginMangler,
    rawPrefix?: string,
}

export interface IPluginConfiguration {
    readonly mangler: IPluginMangler,
    readonly rawPrefix: string,
}

export interface IIdentifierMap {
    [name: string]: string | undefined,
}

export interface IEsifyCSSResult {
    class: IIdentifierMap,
    id: IIdentifierMap,
    keyframes: IIdentifierMap,
}

export interface IImports extends Map<string, string> {}
