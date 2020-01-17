export interface IExposedPromise {
    readonly promise: Promise<void>,
    readonly resolve: () => void,
    readonly reject: (error: Error) => void,
}

export const createExposedPromise = (): IExposedPromise => {
    let resolved = false;
    let rejected: Error | undefined;
    const exposed = {
        resolve: () => {
            if (!rejected) {
                resolved = true;
            }
        },
        reject: (error: Error | void) => {
            if (!resolved) {
                rejected = error || new Error('Rejected');
            }
        },
    };
    return Object.assign(
        exposed,
        {
            promise: new Promise<void>((res, rej) => {
                if (rejected) {
                    rej(rejected);
                } else if (resolved) {
                    res();
                } else {
                    exposed.resolve = res;
                    exposed.reject = rej;
                }
            }),
        },
    );
};
