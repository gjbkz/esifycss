import postcss = require('postcss');

export interface IIdentifier {
    (key: string): number,
}

export interface IIdListener {
    (
        key: string,
        id: number,
    ): void,
}

export interface IPluginOutput {
    (roots: Array<postcss.Root>): void | Promise<void>,
}

export interface IPluginMangler {
    (id: string, className: string): string,
}

export interface IPluginParameter {
    /**
     * A path to concatenated css.
     */
    output?: string | IPluginOutput,
    /**
     * When it is true, this plugin minifies classnames.
     */
    mangle?: boolean,
    /**
     * See the mangler section below. If it is set, the `mangle`
     * option is ignored.
     */
    mangler?: IPluginMangler,
}

export interface IPluginConfiguration {
    readonly output: IPluginOutput,
    readonly mangler: IPluginMangler,
}
