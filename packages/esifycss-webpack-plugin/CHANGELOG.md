# Changelog

## Unreleased

- Maintain the plugin in the esifycss workspace with shared build tools and real Webpack 5 integration tests.
- Breaking: require Node.js 22+ and declare Webpack 5 as a peer dependency. Publish these changes in the next minor release (0.2.0 or later).

## v0.1.3 (2021-09-11)

### Bug Fixes

- support another type of ResolveData ([d1478e1](https://github.com/kei-ito/esifycss-loader/commit/d1478e19a423cc7c8293094bcd307d9d02db3f82))


## v0.1.2 (2021-09-11)

### Bug Fixes

- input may have resolve hook ([fe9770c](https://github.com/kei-ito/esifycss-loader/commit/fe9770c74501e0f17266c95bb58a0a8d16fa9481))

### Tests

- exclude lib ([5e97838](https://github.com/kei-ito/esifycss-loader/commit/5e978382198a154cf9331113b27cf79ef1eb9ba1))


## v0.1.1 (2021-09-11)

### Bug Fixes

- add cjs.js for default export ([3e113e5](https://github.com/kei-ito/esifycss-loader/commit/3e113e59b61e455eead60dc083cd1748fb14f185))


## v0.1.0 (2021-09-11)

### Features

- first commit ([b8df717](https://github.com/kei-ito/esifycss-loader/commit/b8df717757f9da2014fc07a6812748eefb9cedc5))

### Bug Fixes

- package.main ([7ed783f](https://github.com/kei-ito/esifycss-loader/commit/7ed783f68c88302e7b035587193d5ff7f287bc0a))

### Tests

- move utilities ([65cacb1](https://github.com/kei-ito/esifycss-loader/commit/65cacb13e7d1f8aaeb6c937eded2abf3a173fb20))
- add 2 tests ([27b304e](https://github.com/kei-ito/esifycss-loader/commit/27b304e5d327c1b5ba8869e409a86818cc7be243))

### Code Refactoring

- add fileExistsAt ([d63139e](https://github.com/kei-ito/esifycss-loader/commit/d63139e71e684a6a74561bfbded575af8538410c))

### Documentation

- update README ([d59a7ac](https://github.com/kei-ito/esifycss-loader/commit/d59a7ac78c78c4e304d167ba9bb8db8cad3504c3))

### Build System

- setup typescript ([80b5592](https://github.com/kei-ito/esifycss-loader/commit/80b559235adfbf9fe83cb1e8686d1a5c1736a41c))

### Dependency Upgrades

- @typescript-eslint/eslint-plugin:4.30.0→4.31.0 @typescript-eslint/parser:4.30.0→4.31.0 typescript:4.4.2→4.4.3 ([aac01fc](https://github.com/kei-ito/esifycss-loader/commit/aac01fca7522f8533b4881cb862cdf3aff5e0443))
