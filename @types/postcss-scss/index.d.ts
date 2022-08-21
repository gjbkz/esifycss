// eslint-disable-next-line import/unambiguous
declare module 'postcss-scss' {
    import type {Parser, Stringifier} from 'postcss';

    export const parse: Parser;
    export const stringify: Stringifier;
}
