import * as path from 'path';
import * as fs from 'fs';
import {ISessionOptions} from '../runner/types.js';
import {IEsifyCSSCommand} from './types';
const {readFile} = fs.promises;

export const loadParameters = async (
    program: IEsifyCSSCommand,
    directory: string = process.cwd(),
): Promise<ISessionOptions> => {
    const parameters: Partial<ISessionOptions> = {
        include: program.args,
        helper: program.helper,
        css: program.css as string,
        ext: program.ext as string,
        exclude: program.exclude,
        esifycssPluginParameter: {
            mangle: !program.noMangle,
        },
        watch: program.watch,
    };
    if (program.config) {
        const configPath = path.isAbsolute(program.config) ? program.config : path.join(directory, program.config);
        const configJSON = await readFile(configPath, 'utf8');
        Object.assign(parameters, JSON.parse(configJSON) as ISessionOptions);
    }
    return parameters;
};
