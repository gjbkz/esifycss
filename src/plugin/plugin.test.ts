import test from 'ava';
import {plugin} from './plugin';
import * as postcss from 'postcss';

test('plugin', async (t): Promise<void> => {
    const css = '.foo{bar:baz}';
    const from = 'a.css';
    const result = await postcss([plugin]).process(css, {from});
    t.truthy(result);
});
