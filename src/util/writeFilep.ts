import * as path from 'path';
import * as fs from 'fs';
const {mkdir, writeFile} = fs.promises;

export const writeFilep = async (
    filePath: string,
    data: string | Uint8Array,
): Promise<void> => {
    await mkdir(path.dirname(filePath), {recursive: true});
    await writeFile(filePath, data);
};
