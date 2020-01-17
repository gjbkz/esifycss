export interface IExposedPromise {
    readonly promise: Promise<void>,
    readonly resolve: () => void,
    readonly reject: (error: Error) => void,
}

export const createExposedPromise = (): IExposedPromise => {
    let resolved = false;
    let rejected: Error | undefined;
    const resolve = () => {
        if (!rejected) {
            resolved = true;
        }
    };
    const reject = (error: Error | void) => {
        if (!resolved) {
            rejected = error || new Error('Rejected');
        }
    };
    const promise = new Promise<void>((res, rej) => {
        if (rejected) {
            rej(rejected);
        } else if (resolved) {
            res();
        } else {
            exposed.resolve = res;
            exposed.reject = rej;
        }
    });
    const exposed = {promise, resolve, reject};
    return exposed;
};
