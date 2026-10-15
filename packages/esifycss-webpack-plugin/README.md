# esifycss-webpack-plugin

Maintained in the [EsifyCSS workspace](../../README.md). Requires Node.js 22+.

Imported from `gjbkz/esifycss-webpack-plugin` at commit `51101ea347d55ac35f3fbac12ac7b67237049ba6`.
See CHANGELOG.md for prior release history.

## Usage

Generate `.module.css.js` or `.module.css.ts` files with esifycss, then add this
resolver to a Webpack 5 configuration. It redirects `.module.css` imports to
an existing generated JavaScript file, or TypeScript file if no JavaScript file
exists. TypeScript files still need your normal Webpack TypeScript loader.

```js
const EsifyCSSWebpackPlugin = require('esifycss-webpack-plugin');
module.exports = {plugins: [new EsifyCSSWebpackPlugin()]};
```

The CommonJS constructor, `EsifyCSSWebpackPlugin` named export, and default export
are preserved. This resolver does not run the CSS generator itself.
