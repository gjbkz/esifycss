# parcel-plugin-esifycss

Maintained in the [EsifyCSS workspace](../../README.md). Requires Node.js 22+.

Imported from `gjbkz/parcel-plugin-esifycss` at commit `2f29f6471e61485de20e97bac2279dc8fc79cd68`.
See CHANGELOG.md for prior release history.

## Usage

This package supports **Parcel 1 (`parcel-bundler` 1.12.5+)**, using its plugin API.
Install it alongside esifycss and Parcel 1; Parcel discovers `parcel-plugin-*`
dependencies automatically. It is not a Parcel 2 transformer.

```sh
npm install --save-dev parcel-bundler@1 parcel-plugin-esifycss
```

Import a CSS file directly from JavaScript or TypeScript:

```js
import {className, id, keyframes} from './style.css';
```

CSS is embedded through the core helper. The adapter uses the helper's raw-rule
format so independent workers and split bundles do not need a shared compression
dictionary. Identifiers are deterministic across workers. Override the mangler
with `esifycssPluginParameter.mangler` when needed.

Configuration is read from `.esifycssrc`, `esifycss.config.js`, or the `esifycss`
key in package.json. PostCSS options and identifier options are passed to the
core. Parcel controls file selection and watching; the adapter supplies its own
runtime helper, so `helper`, `ext`, `include`, and `watch` do not control generated
files. The standalone `css` output option is unsupported.

The CommonJS function, `default`, and `esifyCSSPlugin` properties are preserved.
Update the compatible core dependency range and the root lockfile in the same
commit as a new core release, especially when changing the core major version.
