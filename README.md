# EsifyCSS

[![CircleCI](https://circleci.com/gh/kei-ito/esifycss.svg?style=svg)](https://circleci.com/gh/kei-ito/esifycss)
[![Build Status](https://travis-ci.com/kei-ito/esifycss.svg?branch=master)](https://travis-ci.com/kei-ito/esifycss)
[![Build status](https://ci.appveyor.com/api/projects/status/g4839cvn53ph9boi/branch/master?svg=true)](https://ci.appveyor.com/project/kei-ito/esifycss/branch/master)
[![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=WDQvOHgwbkRNTUFyUVkrc0RmdGgva0diVk01Tm9LWU95ZFNGVTByeHhpVT0tLUc2RW9lNnNaY2k4QkVCSjMyalRGTVE9PQ==--007efb48774305e72904bb3a15d3b0d048dbfb91)](https://www.browserstack.com/automate/public-build/WDQvOHgwbkRNTUFyUVkrc0RmdGgva0diVk01Tm9LWU95ZFNGVTByeHhpVT0tLUc2RW9lNnNaY2k4QkVCSjMyalRGTVE9PQ==--007efb48774305e72904bb3a15d3b0d048dbfb91)
[![codecov](https://codecov.io/gh/kei-ito/esifycss/branch/master/graph/badge.svg)](https://codecov.io/gh/kei-ito/esifycss)

Generates modules from CSS.

EsifyCSS consists of a **PostCSS plugin** and a **Runner**.

## PostCSS plugin

The plugin converts the identifiers in CSS and minifies them.
It outputs the result of minifications using [Root.warn()].

[Root.warn()]: http://api.postcss.org/Root.html#warn

## Runner

A runner process `.css` files in your project with PostCSS and output the
results to `.css.js` or `.css.ts`.

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
    animation: 4s bar;
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
addStyle([
  "qBsBKAMCSUCWGYaSceIEuBUCWGYawBceIEE",
  "gBASCOGiBQKAMIE",
  "gBAiBCOGkBQKAMIE",
  "mBAkBCOGoBQKAMIE",
  "mBAoBCOGMQKyBIE"
]);
export const className = {
    "baz1": "_2",
    "baz2": "_3"
};
export const id = {
    "bar1": "_0",
    "bar2": "_1"
};
export const keyframes = {
    "foo": "_4"
};
```

Each string given to `addStyle` represents a CSS string.
They are inserted to the document's stylesheet by the helper script.
Classnames, identifiers, and keyframes are shortened uniquely and it makes
styles modular. This means you don't have to concern about naming somethings.

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

You can use `@import` syntax when the style declarations requires names in external files.

Example: Assume you have the following `a.css` and `b.css`.

```css
/* a.css */
.container {...} /* → ._0 */
```

```css
/* b.css */
.container {...} /* → ._1 */
```

The `container` class names will be shortened to unique names like
`_0` and `_1`.
You can import the shortened names with the `@import` syntax.

```css
/* "modA-" is prefix for a.css */
@import './a.css' modA-;
/* "bbbb" is prefix for b.css */
@import './b.css' BBB;
.wrapper>.modA-container {...} /* → ._2>._0 */
.wrapper>.BBBcontainer {...}   /* → ._2>._1 */
```

## JavaScript API for Runner

```javascript
import {Session} from 'esifycss';
new Session(options).start()
.then(() => console.log('Done'))
.catch((error) => console.error(error));
```

### Options

- `include`: `string | Array<string>`.
  Default: `**/*.css`.
  Pattern(s) to be included.
- `exclude`: `anymatch.Matcher`. Pattern(s) to be excluded.
- `helper`: `string`.
  Default: `helper.{hash}.css.js`.
  Where this plugin outputs the helper script.
  The hash is calculated from the include.
- `watch`: `boolean`.
  Default: `false`.
  If it is true, a watcher is enabled.
- `chokidar`: `chokidar.WatchOptions`.
  Options passed to chokidar.
- `stdout`: `stream.Writable`.
- `stderr`: `stream.Writable`.
- `postcssPlugins`: `Array<postcss.AcceptedPlugin>`.
  An array of postcss plugins.
- `esifycssPluginParameter`: See the next section.

## JavaScript API for Plugin

### Options

- `mangle`: `boolean`,
- `identifier`: `IIdentifier`,
- `mangler`: `IPluginMangler`,
- `rawPrefix`: `string`,

## LICENSE

The esifycss project is licensed under the terms of the Apache 2.0 License.
