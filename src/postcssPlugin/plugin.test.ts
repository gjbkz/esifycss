import test from 'ava';
import * as postcss from 'postcss';
import * as parser from '@hookun/parse-animation-shorthand';
import {plugin} from './plugin';
import {extractPluginResult} from '../runner/extractPluginResult';

const getFirstDeclaration = (
    rule: postcss.Rule,
): postcss.Declaration => {
    if (rule.nodes) {
        if (rule.nodes[1]) {
            throw new Error(`The given rule has multiple declarations: ${rule}`);
        }
        return rule.nodes[0] as postcss.Declaration;
    }
    throw new Error(`The given rule has no nodes: ${rule}`);
};

test('plugin', async (t): Promise<void> => {
    const transformer = plugin();
    const resultA = await postcss([transformer]).process([
        '@import "./b.css" c-;',
        '@keyframes aaa {0%{opacity:0}100%{opacity:1}}',
        '.foo:first-child[data-hello=abc]{animation-name: aaa}',
        '#bar1,#bar2:nth-of-type(2):not([data-hello=abc]){animation: linear aaa 1s 123ms}',
        '.c-foo>.raw-foo{animation-name: c-aaa}',
        '#c-bar>#raw-bar{animation-name: raw-ccc}',
    ].join('\n'), {from: '/a/a.css'});
    const mapA = extractPluginResult(resultA);
    const resultB = await postcss([transformer]).process([
        '@import "./a.css" c-;',
        '@keyframes aaa {0%{opacity:0}100%{opacity:1}}',
        '.foo{animation-name: c-aaa}',
        '#bar{animation-name: raw-ccc}',
    ].join('\n'), {from: '/a/b.css'});
    const mapB = extractPluginResult(resultB);
    {
        const identifiers = [
            mapA.className.foo,
            mapA.id.bar1,
            mapA.id.bar2,
            mapA.keyframes.aaa,
            mapB.className.foo,
            mapB.id.bar,
            mapB.keyframes.aaa,
        ];
        t.true(identifiers.every((identifier) => Boolean(identifier)));
        t.is(identifiers.length, new Set(identifiers).size);
    }
    const rootA = postcss.parse(resultA.css);
    const rootB = postcss.parse(resultB.css);
    const nodes = [...(rootA.nodes || []), ...(rootB.nodes || [])];
    let index = 0;
    {
        const node = nodes[index++] as postcss.AtRule;
        t.is(node.type, 'atrule');
        t.is(node.name, 'keyframes');
        t.is(node.params, mapA.keyframes.aaa);
    }
    {
        const node = nodes[index++] as postcss.Rule;
        t.is(node.type, 'rule');
        t.is(node.selector, `.${mapA.className.foo}:first-child[data-hello=abc]`);
        {
            const declaration = getFirstDeclaration(node);
            t.is(declaration.prop, 'animation-name');
            t.is(declaration.value, mapA.keyframes.aaa);
        }
    }
    {
        const node = nodes[index++] as postcss.Rule;
        t.is(node.type, 'rule');
        t.is(node.selector, `#${mapA.id.bar1},#${mapA.id.bar2}:nth-of-type(2):not([data-hello=abc])`);
        {
            const declaration = getFirstDeclaration(node);
            t.is(declaration.prop, 'animation');
            t.deepEqual(
                parser.parse(declaration.value),
                parser.parse(`linear ${mapA.keyframes.aaa} 1s 123ms`),
            );
        }
    }
    {
        const node = nodes[index++] as postcss.Rule;
        t.is(node.type, 'rule');
        t.is(node.selector, `.${mapB.className.foo}>.foo`);
        {
            const declaration = getFirstDeclaration(node);
            t.is(declaration.prop, 'animation-name');
            t.is(declaration.value, mapB.keyframes.aaa);
        }
    }
    {
        const node = nodes[index++] as postcss.Rule;
        t.is(node.type, 'rule');
        t.is(node.selector, `#${mapB.id.bar}>#bar`);
        {
            const declaration = getFirstDeclaration(node);
            t.is(declaration.prop, 'animation-name');
            t.is(declaration.value, 'ccc');
        }
    }
    {
        const node = nodes[index++] as postcss.AtRule;
        t.is(node.type, 'atrule');
        t.is(node.name, 'keyframes');
        t.is(node.params, mapB.keyframes.aaa);
    }
    {
        const node = nodes[index++] as postcss.Rule;
        t.is(node.type, 'rule');
        t.is(node.selector, `.${mapB.className.foo}`);
        {
            const declaration = getFirstDeclaration(node);
            t.is(declaration.prop, 'animation-name');
            t.is(declaration.value, mapA.keyframes.aaa);
        }
    }
    {
        const node = nodes[index++] as postcss.Rule;
        t.is(node.type, 'rule');
        t.is(node.selector, `#${mapB.id.bar}`);
        {
            const declaration = getFirstDeclaration(node);
            t.is(declaration.prop, 'animation-name');
            t.is(declaration.value, 'ccc');
        }
    }
});
