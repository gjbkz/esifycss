declare module 'browserstack-local' {
    export class Local {

        public start(
            params: {
                key: string,
                localIdentifier: string,
                verbose?: boolean,
                forceLocal?: boolean,
                onlyAutomate?: boolean,
                only?: string,
            },
            callback: (error: Error) => void,
        ): void;

        public stop(callback: () => void): void;

        public isRunning(): boolean;

    }
}
