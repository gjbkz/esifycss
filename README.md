# EsifyCSS

[![CircleCI](https://circleci.com/gh/kei-ito/esifycss.svg?style=svg)](https://circleci.com/gh/kei-ito/esifycss)
[![Build Status](https://travis-ci.com/kei-ito/esifycss.svg?branch=master)](https://travis-ci.com/kei-ito/esifycss)
[![Build status](https://ci.appveyor.com/api/projects/status/h4smn477ndhl0nwo/branch/master?svg=true)](https://ci.appveyor.com/project/kei-ito/esifycss-upbse/branch/master)
[![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=WDQvOHgwbkRNTUFyUVkrc0RmdGgva0diVk01Tm9LWU95ZFNGVTByeHhpVT0tLUc2RW9lNnNaY2k4QkVCSjMyalRGTVE9PQ==--007efb48774305e72904bb3a15d3b0d048dbfb91)](https://www.browserstack.com/automate/public-build/WDQvOHgwbkRNTUFyUVkrc0RmdGgva0diVk01Tm9LWU95ZFNGVTByeHhpVT0tLUc2RW9lNnNaY2k4QkVCSjMyalRGTVE9PQ==--007efb48774305e72904bb3a15d3b0d048dbfb91)
[![codecov](https://codecov.io/gh/kei-ito/esifycss/branch/master/graph/badge.svg)](https://codecov.io/gh/kei-ito/esifycss)

Generates modules from CSS.

EsifyCSS consists of a **PostCSS plugin** and a **Runner**.

## PostCSS plugin

The plugin converts the identifiers in CSS and minifies them.
It outputs the result of minifications using [Root.warn()].

[Root.warn()]: http://api.postcss.org/Root.html#warn

## Runner

A runner process `.css` files in your project with PostCSS and output the results to `.css.js` or `.css.ts`.

## Example

Assume you have following [`sample.css`](sample/00-src/sample.css):

```css
@keyframes foo {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(720deg);
    }
}

#bar1 {
    animation: 1s foo;
}

#bar2 {
    animation: 2s foo;
}

.baz1 {
    animation: 3s foo;
}

.baz2 {
    animation: 4s bon;
}
```

Then, run the command:

```
$ esifycss sample.css
```

You'll get the following file:

```javascript
// sample.css.js
import {addStyle} from './helper.js';
addStyle(/* begin(css) */"@keyframes sample_46css_45keyframes_45foo{0%{transform:rotate(0deg);}100%{transform:rotate(720deg);}}"/* end(css) */);
addStyle(/* begin(css) */"#sample_46css_45id_45bar1{animation:1s sample_46css_45keyframes_45foo;}"/* end(css) */);
addStyle(/* begin(css) */"#sample_46css_45id_45bar2{animation:2s sample_46css_45keyframes_45foo;}"/* end(css) */);
addStyle(/* begin(css) */".sample_46css_45class_45baz1{animation:3s sample_46css_45keyframes_45foo;}"/* end(css) */);
addStyle(/* begin(css) */".sample_46css_45class_45baz2{animation:4s bon;}"/* end(css) */);
export const className = {
    "baz1": "sample_46css_45class_45baz1",
    "baz2": "sample_46css_45class_45baz2"
};
export const id = {
    "bar1": "sample_46css_45id_45bar1",
    "bar2": "sample_46css_45id_45bar2"
};
export const keyframes = {
    "foo": "sample_46css_45keyframes_45foo"
};
```

Class names are minified uniquely and it makes styles modular.
This means you don't have to think about naming somethings.

## Installation

```bash
npm install --save-dev esifycss
```

## Usage

```
Usage: esifycss [options] <include ...>

Options:
  -V, --version         output the version number
  --output <path>       A path to the helper script.
  --config <path>       A path to configuration files.
  --exclude <path ...>  Paths or patterns to be excluded.
  --watch               Watch files and update the modules automatically.
  -h, --help            output usage information
```

## `@import` Syntax

You can use `@import` syntax when the style declarations requires class names in external files (e.g. `.a>.b`).

```css
/* a.css */
.classA {...}
```

```css
/* b.css */
.classB {...}
```

```css
@import './a.css';
@import './b.css';
.sample>$1.classA {...}
.sample>$2.classB {...}
```

Imports are named automatically as $1, $2, ...

You can also name the imports.

```css
@import './a.css' modA;
@import './b.css' modB;
.sample>modA.classA {...}
.sample>modB.classB {...}
```

## Options

- `config`: `string`. A path to configuration files.
- `dest`: `string`. A path to concatenated css.
- `watch`: `boolean`. Watch files and update module automatically.
- `mangle`: `boolean`. Minify classnames for production build.
- `ext`: `string`. An extension of generated modules.
- `baseDir`: `string`. A path which is used to generate modules to outputDir.
- `outputDir`: `string`. A path to a directory where modules are generated.
- `classesOnly`: `boolean`. If it is true, a CSS file exports classes as default export. Otherwise, {classes, properties} is exported.
- `plugins`: `Array<PostCSSPlugin>`. An array which passed to [postcss](http://api.postcss.org/postcss.html).
- `processOptions`: `{...}`. An object which passed to [postcss.parse](http://api.postcss.org/postcss.html#.parse) or [processor.process](http://api.postcss.org/Processor.html#process).
- `base`: `string`. See the mangler section below.
- `mangler`: `(id: string, className: string) => String`. See the mangler section below. If it is set, the `mangle` and `base` options are ignored.

### `mangler` option

`mangler` is a function generates a class name from (id, className).
`base` and `mangle` options are shorthand for built-in `mangler` functions.
They works as the code below.

```javascript
if (!options.mangler) {
  if (options.mangle) {
    const labeler = options.labeler || new embedCSS.Labeler();
    options.mangler = (id, className) => `_${labeler.label(`${id}/${className}`)}`;
    // ('/home/foo/bar.css', 'a') → _0
    // ('/home/foo/bar.css', 'b') → _1
    // ('/home/foo/baz.css', 'a') → _2
  } else {
    options.base = options.base || options.baseDir || process.cwd();
    options.mangler = (id, className) => [
      path.relative(options.base, id).replace(/^(\w)/, '_$1').replace(/[^\w]+/g, '_'),
      className,
    ].join('_');
    // Assume base is /home
    // ('/home/foo/bar.css', 'a') → _foo_bar_css_a
    // ('/home/foo/bar.css', 'b') → _foo_bar_css_b
    // ('/home/foo/baz.css', 'a') → _foo_baz_css_a
  }
}
```

## LICENSE

The esifycss project is licensed under the terms of the Apache 2.0 License.
