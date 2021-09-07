type Resolve = () => void;
type Reject = (error: Error) => void;

export interface IExposedPromise {
    readonly promise: Promise<void>,
    readonly resolve: Resolve,
    readonly reject: Reject,
}

export const createExposedPromise = (): IExposedPromise => {
    let resolve: Resolve | null = null;
    let reject: Reject | null = null;
    const promise = new Promise<void>((res, rej) => {
        resolve = res;
        reject = rej;
    });
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (resolve && reject) {
        return {promise, resolve, reject};
    }
    throw new Error('NoResolver');
};
