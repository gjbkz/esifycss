declare module 'acorn-dynamic-import' {
    import * as acorn from 'acorn';
    export const DynamicImportKey: string;
    export default function ParserWithDynamicImport(BaseParser: typeof acorn.Parser): typeof acorn.Parser;
}
