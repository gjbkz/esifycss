export interface IParseResult {
    css: string,
    start: number,
    end: number,
}

export interface IScriptData {
    script: string,
    cssRanges: Array<IParseResult>,
}

export interface IParseScriptsResult {
    scripts: Map<string, IScriptData>,
    tokens: Map<string, number>,
}
