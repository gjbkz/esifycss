type Resolve = () => void;
type Reject = (error: Error) => void;

export interface IExposedPromise {
    readonly promise: Promise<void>,
    readonly resolve: Resolve,
    readonly reject: Reject,
}

export const createExposedPromise = (): IExposedPromise => {
    let resolve: null | Resolve = null;
    let reject: null | Reject = null;
    const promise = new Promise<void>((res, rej) => {
        resolve = res;
        reject = rej;
    });
    if (resolve && reject) {
        return {promise, resolve, reject};
    }
    throw new Error('NoResolver');
};
