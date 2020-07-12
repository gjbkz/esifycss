import test from 'ava';
import * as postcss from 'postcss';
import {minify} from './minify';

interface ITest {
    css: string,
    expected: string,
}

([
    {
        css: '\n\n\n',
        expected: '',
    },
    {
        css: [
            ' @import url("foo.css") print  ; ;',
            '\n.foo  #bar >  div { ; ; foo : bar ; ; bar : "foo" ; ;; } ;\n\n',
        ].join('\n;;\n'),
        expected: [
            '@import url("foo.css") print;',
            '.foo #bar>div{foo:bar;bar:"foo"}',
        ].join(''),
    },
] as Array<ITest>).forEach(({css, expected}, index) => {
    test(`#${index + 1}`, (t) => {
        const root = minify(postcss.parse(css));
        t.is(root.toString(), expected);
    });
});
