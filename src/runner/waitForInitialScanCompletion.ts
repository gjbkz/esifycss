import * as chokidar from 'chokidar';

export const waitForInitialScanCompletion = (
    watcher: chokidar.FSWatcher,
): Promise<void> => new Promise<void>((resolve, reject): void => {
    watcher
    .once('error', reject)
    .once('ready', () => {
        watcher.removeListener('error', reject);
        resolve();
    });
});
