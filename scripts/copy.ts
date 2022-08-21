/* eslint-disable import/no-import-module-exports */
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * @param {string} src
 * @param {string} dest
 */
export const copy = async (
    src: string,
    dest: string,
): Promise<void> => {
    src = path.normalize(src);
    dest = path.normalize(dest);
    if ((await fs.stat(src)).isDirectory()) {
        await fs.mkdir(dest, {recursive: true});
        await Promise.all((await fs.readdir(src)).map(async (name) => {
            const srcFile = path.join(src, name);
            const destFile = path.join(dest, name);
            await fs.copyFile(srcFile, destFile);
            console.log(`Copied: ${srcFile} → ${destFile}`);
        }));
    } else {
        await fs.copyFile(src, dest);
        console.log(`Copied: ${src} → ${dest}`);
    }
};

if (!module.parent) {
    const [src, dest] = process.argv.slice(-2);
    copy(src, dest)
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
}
