import test from 'ava';
import {plugin, pluginName} from './plugin';
import * as postcss from 'postcss';

test('plugin', async (t): Promise<void> => {
    const css = [
        '@keyframes aaa {0%{opacity:0}100%{opacity:1}}',
        '.foo:first-child[data-hello=abc]{animation-name: aaa}',
        '#bar1,#bar2:nth-of-type(2):not([data-hello=abc]){animation: linear aaa 1s}',
    ].join('\n');
    const from = 'a.css';
    const result = await postcss([plugin]).process(css, {from});
    const pluginWarning = result.warnings().find((warning) => warning.plugin === pluginName);
    t.truthy(pluginWarning);
    if (pluginWarning) {
        const mapping = JSON.parse(pluginWarning.text);
        t.log(mapping);
        t.log(result.css);
    }
});
