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
}

export interface IPluginConfiguration {
    readonly mangler: IPluginMangler,
}

export interface IEsifyCSSResult {
    class: {
        [name: string]: string | undefined,
    },
    id: {
        [name: string]: string | undefined,
    },
    keyframes: {
        [name: string]: string | undefined,
    },
}
