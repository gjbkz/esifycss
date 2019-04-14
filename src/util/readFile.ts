import fs from 'fs';
import util from 'util';
export const readFile = util.promisify(fs.readFile);
