declare module 'postcss-scss' {
    import * as postcss from 'postcss';
    export const parse: postcss.Parser;
    export const stringify: postcss.Stringifier;
}
