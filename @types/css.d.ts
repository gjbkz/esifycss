declare module '*.css' {
    export const className: {
        [className: string]: string,
    };
    export const id: {
        [id: string]: string,
    };
    export const keyframes: {
        [name: string]: string,
    };
}
