# rollup-plugin-embed-css

This plugin wraps [esifycss](https://github.com/gjbkz/esifycss).

## Installation

```bash
npm install --save-dev rollup-plugin-embed-css
```

## Usage

```javascript
import embedCSS from 'rollup-plugin-embed-css';
export default {
  input: '...',
  plugins: [
    embedCSS({/* Options */}),
  ],
  output: {
    format: '...',
    file: '...',
  },
};
```

## Options

You can pass all [esifycss options](https://github.com/gjbkz/esifycss#options) including `include` and `exclude` filters. Set `css: true` to emit `esifycssOutput.css`, or `css: "styles.css"` to choose its name.

## LICENSE

The rollup-plugin-embed-css project is licensed under the terms of the Apache 2.0 License.

## Development

This package is maintained in the esifycss repository using npm workspaces.
Run `npm ci`, `npm run build`, and `npm test` from the repository root.
The npm package name and default/named plugin exports are preserved.
When releasing a new core version, update this package's compatible `esifycss`
range and the root lockfile in the same version commit. A new major core version
requires a matching new major range. The integration test checks that the plugin
loads the local workspace core rather than a registry copy.

Imported from gjbkz/rollup-plugin-embed-css at commit `73eb4991dae093c6b83b92a12ecf401e8208555e`; see CHANGELOG.md for its prior release history.
