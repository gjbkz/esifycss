import * as chokidar from 'chokidar';

export const waitForInitialScanCompletion = async (
    watcher: chokidar.FSWatcher,
): Promise<void> => {
    await new Promise<void>((resolve, reject): void => {
        watcher
        .once('error', reject)
        .once('ready', () => {
            watcher.removeListener('error', reject);
            resolve();
        });
    });
};
