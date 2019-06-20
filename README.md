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

## JavaScript API

TBW

## Options

TBW

- `include`: `string | Array<string>`.
- `helper`: `string`.
- `exclude`: `anymatch.Matcher`.
- `watch`: `boolean`.
- `chokidar`: `chokidar.WatchOptions`.
- `stdout`: `stream.Writable`.
- `stderr`: `stream.Writable`.
- `postcssPlugins`: `Array<postcss.AcceptedPlugin>`.
- `esifycssPluginParameter`: `IPluginParameter`.
- `minifyScript`: `boolean`.

## LICENSE

The esifycss project is licensed under the terms of the Apache 2.0 License.
