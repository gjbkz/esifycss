# EsifyCSS workspace

EsifyCSS generates JavaScript or TypeScript modules from CSS. This repository
maintains the core and its bundler integrations together, preserving their npm names.

- [esifycss](packages/esifycss/README.md): PostCSS plugin, Runner, and CLI.
- [rollup-plugin-embed-css](packages/rollup-plugin-embed-css/README.md): Rollup 4 integration.
- [esifycss-webpack-plugin](packages/esifycss-webpack-plugin/README.md): Webpack 5 resolver for generated CSS modules.

## Development

Node.js 22 or newer is required. Run all commands from the repository root:

```sh
npm ci
npm run build
npm run lint
npm test
```

npm workspaces links the plugins to the local core, so tests exercise changes
together. Shared development tools and one lockfile live at the root. Builds use
Node.js file operations; Biome lint configuration is local and no dependency installs
git hooks. Integration tests build Rollup and Webpack bundles.

The BrowserStack suite runs automatically for same-repository pull requests and
can also be started manually or with `npm run test-client`. Fork and Dependabot
pull requests are skipped because they cannot access repository secrets. Configure
`BROWSERSTACK_USERNAME` and `BROWSERSTACK_ACCESS_KEY` in repository secrets.
The suite installs its fixture dependencies and is separate from `npm test`.

## Releases

Release tags and npm Trusted Publisher settings are listed in
[release.yml](.github/workflows/release.yml). Follow the shared
[release procedure](https://github.com/nlibjs/actions#release-procedure).

## Maintenance policy

Prioritize compatibility fixes, security updates, and existing users. Add new
features or integrations only for concrete maintained use cases. Specialized CSS
parsing stays in upstream libraries rather than being reimplemented here.
