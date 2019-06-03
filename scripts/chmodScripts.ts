import * as path from 'path';
import * as fs from 'fs';
const afs = fs.promises;

export const permitExecution = async (
    file: string,
): Promise<void> => {
    const stats = await afs.stat(file);
    await afs.chmod(file, stats.mode | fs.constants.S_IXUSR);
};

export const chmodScripts = async (): Promise<void> => {
    const binDirectory = path.join(__dirname, '../lib/bin');
    const files = (await afs.readdir(binDirectory))
    .filter((name) => path.extname(name) === '.js')
    .map((name) => path.join(binDirectory, name));
    await Promise.all(files.map(permitExecution));
};

if (!module.parent) {
    chmodScripts()
    .catch((error) => {
        process.stderr.write(`${error}`);
        process.exit(1);
    });
}

