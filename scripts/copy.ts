import * as path from 'path';
import {promises as afs} from 'fs';

const copy = async (source: string, dest: string) => {
    for await (const dirent of await afs.opendir(source)) {
        const {name} = dirent;
        if (dirent.isDirectory()) {
            await afs.mkdir(path.join(dest, name), {recursive: true});
            await copy(path.join(source, name), path.join(dest, name));
        } else if (dirent.isFile()) {
            await afs.copyFile(path.join(source, name), path.join(dest, name));
        }
    }
};

const cwd = process.cwd();
const [source, dest] = process.argv.slice(2).slice(-2).map((value) => path.join(cwd, value));

afs.mkdir(dest, {recursive: true})
.then(async () => {
    await copy(source, dest);
})
.catch((error) => {
    console.error(error);
    process.exit(1);
});
