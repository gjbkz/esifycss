import * as parser from '@hookun/parse-animation-shorthand';
import {test} from 'node:test';
import * as assert from 'node:assert/strict';
import type {AtRule, Declaration, Rule} from 'postcss';
import {extractPluginResult} from '../runner/extractPluginResult';
import {postcss} from '../util/postcss';
import {plugin} from './plugin';

const getFirstDeclaration = (
    rule: Rule,
): Declaration => {
    if (rule.nodes) {
        if (rule.nodes[1]) {
            throw new Error(`The given rule has multiple declarations: ${rule}`);
        }
        return rule.nodes[0] as Declaration;
    }
    throw new Error(`The given rule has no nodes: ${rule}`);
};

test('plugin', async (): Promise<void> => {
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
        assert.strictEqual(identifiers.every((identifier) => Boolean(identifier)), true);
        assert.strictEqual(identifiers.length, new Set(identifiers).size);
    }
    const rootA = postcss.parse(resultA.css);
    const rootB = postcss.parse(resultB.css);
    const nodes = [...(rootA.nodes || []), ...(rootB.nodes || [])];
    let index = 0;
    {
        const node = nodes[index++] as AtRule;
        assert.strictEqual(node.type, 'atrule');
        assert.strictEqual(node.name, 'keyframes');
        assert.strictEqual(node.params, `${mapA.keyframes.aaa}`);
    }
    {
        const node = nodes[index++] as Rule;
        assert.strictEqual(node.type, 'rule');
        assert.strictEqual(node.selector, `.${mapA.className.foo}:first-child[data-hello=abc]`);
        {
            const declaration = getFirstDeclaration(node);
            assert.strictEqual(declaration.prop, 'animation-name');
            assert.strictEqual(declaration.value, `${mapA.keyframes.aaa}`);
        }
    }
    {
        const node = nodes[index++] as Rule;
        assert.strictEqual(node.type, 'rule');
        assert.strictEqual(node.selector, `#${mapA.id.bar1},#${mapA.id.bar2}:nth-of-type(2):not([data-hello=abc])`);
        {
            const declaration = getFirstDeclaration(node);
            assert.strictEqual(declaration.prop, 'animation');
            assert.deepStrictEqual(
                parser.parse(declaration.value),
                parser.parse(`linear ${mapA.keyframes.aaa} 1s 123ms`),
            );
        }
    }
    {
        const node = nodes[index++] as Rule;
        assert.strictEqual(node.type, 'rule');
        assert.strictEqual(node.selector, `.${mapB.className.foo}>.foo`);
        {
            const declaration = getFirstDeclaration(node);
            assert.strictEqual(declaration.prop, 'animation-name');
            assert.strictEqual(declaration.value, `${mapB.keyframes.aaa}`);
        }
    }
    {
        const node = nodes[index++] as Rule;
        assert.strictEqual(node.type, 'rule');
        assert.strictEqual(node.selector, `#${mapB.id.bar}>#bar`);
        {
            const declaration = getFirstDeclaration(node);
            assert.strictEqual(declaration.prop, 'animation-name');
            assert.strictEqual(declaration.value, 'ccc');
        }
    }
    {
        const node = nodes[index++] as AtRule;
        assert.strictEqual(node.type, 'atrule');
        assert.strictEqual(node.name, 'keyframes');
        assert.strictEqual(node.params, `${mapB.keyframes.aaa}`);
    }
    {
        const node = nodes[index++] as Rule;
        assert.strictEqual(node.type, 'rule');
        assert.strictEqual(node.selector, `.${mapB.className.foo}`);
        {
            const declaration = getFirstDeclaration(node);
            assert.strictEqual(declaration.prop, 'animation-name');
            assert.strictEqual(declaration.value, `${mapA.keyframes.aaa}`);
        }
    }
    {
        const node = nodes[index++] as Rule;
        assert.strictEqual(node.type, 'rule');
        assert.strictEqual(node.selector, `#${mapB.id.bar}`);
        {
            const declaration = getFirstDeclaration(node);
            assert.strictEqual(declaration.prop, 'animation-name');
            assert.strictEqual(declaration.value, 'ccc');
        }
    }
});
