export interface IRange {
    start: number,
    end: number,
}

export interface ICSSRange extends IRange {
    css: string,
}

export interface IParseResult {
    ranges: Array<ICSSRange>,
    addStyle: IRange,
    statements: Array<IRange>,
}

export interface IScriptData extends IParseResult {
    script: string,
}

export interface IParseScriptsResult {
    scripts: Map<string, IScriptData>,
    tokens: Map<string, number>,
}
