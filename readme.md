# esifycss

[![Greenkeeper badge](https://badges.greenkeeper.io/kei-ito/esifycss.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/kei-ito/esifycss.svg?branch=master)](https://travis-ci.org/kei-ito/esifycss)
[![Build status](https://ci.appveyor.com/api/projects/status/github/kei-ito/esifycss?branch=master&svg=true)](https://ci.appveyor.com/project/kei-ito/esifycss/branch/master)
[![codecov](https://codecov.io/gh/kei-ito/esifycss/branch/master/graph/badge.svg)](https://codecov.io/gh/kei-ito/esifycss)

Generates modules from CSS.

## How it works

Assume you have following [`foo.css`](sample/foo.css):

```css
:root {
    --myColor: red;
}

.foo {
    color: var(--myColor);
}
```

Then, run the command:

```
$ esifycss --mangle --dest output.css
```

You'll get following files:

```javascript
// foo.css.js
export const classes = {"foo":"_0"};
export const properties = {"myColor":"red"};
export default {classes, properties};
```

```css
/* output.css */
:root {
  --myColor: red;
}
._0 {
  color: var(--myColor);
}
```

Class names are minified uniquely and it makes styles modular.
This means you don't have to think about naming somethings.

## Installation

```bash
npm install --save-dev esifycss
```

## Usage

```
Usage: esifycss [options] <patterns ...>

Options:

  -V, --version        output the version number
  -c, --config <path>  Path to configuration files
  -d, --dest <path>    Path to output concatenated css
  -w, --watch          Watch files and update definitions automatically
  -m, --mangle         Minify classnames for production build
  -h, --help           output usage information
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

- `plugins`: An array which passed to [postcss](http://api.postcss.org/postcss.html).
- `processOptions`: An object which passed to [postcss.parse](http://api.postcss.org/postcss.html#.parse) or [processor.process](http://api.postcss.org/Processor.html#process).
- `mangle`: Boolean. See the mangler section below.
- `base`: String. See the mangler section below.
- `classesOnly`: Boolean. If it is true, a CSS file exports classes as default export. Otherwise, `{classes, properties}` is exported.
- `mangler`: Function(String *id*, String *className*) → String. See the mangler section below. If it is set, the `mangle` and `base` options are ignored.
- `dest`: String. If it exists, the CSS code is written to options.dest.

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
    options.base = options.base || process.cwd();
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

MIT
