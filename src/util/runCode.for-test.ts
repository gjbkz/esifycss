import * as path from 'path';
import * as vm from 'vm';
import * as rollup from 'rollup';
import * as postcss from 'postcss';
import {createSandbox} from '../util/createSandbox.for-test';
import {IEsifyCSSResult} from '../postcssPlugin/types';
import {writeFile} from './fs';

export interface IRunCodeResult extends IEsifyCSSResult {
    root: postcss.Root,
}

export const runCode = async (file: string): Promise<IRunCodeResult> => {
    const testCodePath = `${file}-import.js`;
    await writeFile(testCodePath, `import * as imported from './${path.basename(file)}';exports = imported;`);
    const bundle = await rollup.rollup({input: testCodePath});
    const {output: [output, undef]} = await bundle.generate({format: 'es'});
    if (undef) {
        throw new Error(`Unexpected multiple outputs: ${undef.code}`);
    }
    const sandbox = createSandbox<IEsifyCSSResult>();
    vm.runInNewContext(output.code, sandbox);
    const {exports: {className = {}, id = {}, keyframes = {}}} = sandbox;
    return {className, id, keyframes, root: postcss.parse(sandbox.document.css)};
};
