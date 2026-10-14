# EsifyCSS workspace

EsifyCSS generates JavaScript or TypeScript modules from CSS. This repository
maintains the core and its Rollup integration together, preserving both npm names.

- [esifycss](packages/esifycss/README.md): PostCSS plugin, Runner, and CLI.
- [rollup-plugin-embed-css](packages/rollup-plugin-embed-css/README.md): Rollup 4 integration.

## Development

Node.js 22 or newer is required. Run all commands from the repository root:

```sh
npm ci
npm run build
npm run lint
npm test
```

npm workspaces links the plugin to the local core, so tests exercise both changes
together. Shared development tools and one lockfile live at the root. Builds use
Node.js file operations; lint configuration is local and no dependency installs
git hooks. The plugin's integration tests build both embedded and extracted CSS.

The existing BrowserStack suite remains available with `npm run test-client` and
a manually triggered workflow. It requires BrowserStack credentials and installs
its fixture dependencies. It is separate from the default build checks.

## Releases

Keep package versions independent and update CHANGELOG.md manually. If the core
version changes, update the plugin's `esifycss` dependency as needed. Build and test
both packages before inspecting the selected package's tarball:

```sh
npm pack --workspace esifycss --dry-run --ignore-scripts
npm pack --workspace rollup-plugin-embed-css --dry-run --ignore-scripts
```

The root is private and cannot be published. GitHub releases tagged `v<version>`
publish only esifycss; `rollup-plugin-embed-css-v<version>` releases publish only
the plugin. Creating a release is a publishing operation; migration alone does
not publish either package or archive the former plugin repository.

## Maintenance policy

Prioritize compatibility fixes, security updates, and existing users. Add new
features or integrations only for concrete maintained use cases. Specialized CSS
parsing stays in upstream libraries rather than being reimplemented here.
