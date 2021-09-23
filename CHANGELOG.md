# Changelog

## v1.4.35 (2021-09-23)

### Bug Fixes

- update file ([17387b5](https://github.com/kei-ito/esifycss/commit/17387b565f88d305ed32d1e06c2e98ec86a6e4da))
- cache the whole result ([9612833](https://github.com/kei-ito/esifycss/commit/96128331a236c805851e62d6176ef3051e5d3183))


## v1.4.34 (2021-09-23)

### Bug Fixes

- parseScripts caches the results to keep css after minification ([76edcb4](https://github.com/kei-ito/esifycss/commit/76edcb40e32693f04219ddfb75adc98439db0ee2))

### Tests

- output css should have all styles ([c141495](https://github.com/kei-ito/esifycss/commit/c1414951e7a24dd9bf8a8406a796a64bff1b194e))

### Dependency Upgrades

- @types/node:16.9.1→16.9.6 @typescript-eslint/eslint-plugin:4.31.1→4.31.2 @typescript-eslint/parser:4.31.0→4.31.2 postcss:8.3.6→8.3.7 rollup:2.56.3→2.57.0 ([4e35a84](https://github.com/kei-ito/esifycss/commit/4e35a84aa0439fe6c980268e3a6c7d08083da1b3))


## v1.4.33 (2021-09-11)

### Documentation

- update the Next.js example ([fd7370a](https://github.com/kei-ito/esifycss/commit/fd7370a1374f159dec4e1b48fab67a9397a28bfd))


## v1.4.32 (2021-09-11)

### Features

- suppress worthless overwrites ([f204e0e](https://github.com/kei-ito/esifycss/commit/f204e0e1ea8b9a0f5e9af8b6fa08705b1b15038a))

### Bug Fixes

- update output css on change ([1c59e7b](https://github.com/kei-ito/esifycss/commit/1c59e7b94f2fdbabdfca66933bde9dcfd8d413e6))


## v1.4.31 (2021-09-11)

### Features

- add preamble to generated files ([2af96b3](https://github.com/kei-ito/esifycss/commit/2af96b3339a90a046bfb86346abb05fe44a351ff))

### Build System

- rebuild samples ([2ead14b](https://github.com/kei-ito/esifycss/commit/2ead14bc4dd233ae7c1d0632a5aceca86d47be95))

### Dependency Upgrades

- @types/node:16.7.13→16.9.1 commander:8.1.0→8.2.0 typescript:4.4.2→4.4.3 ([764e7ee](https://github.com/kei-ito/esifycss/commit/764e7ee174c500fe889602cf636c1cfca97cdd4d))


## v1.4.29 (2021-09-11)

### Features

- minifyScriptForCSS removes import declarations ([1e73fd1](https://github.com/kei-ito/esifycss/commit/1e73fd1977b4cad833575211b427604cf5da54db))

### Bug Fixes

- temporary scripts must have addStyle ([5f24765](https://github.com/kei-ito/esifycss/commit/5f24765428be96a25d823ce07761126aca095184))
- omit addStyle() from generated code if the output is css ([2f1bd46](https://github.com/kei-ito/esifycss/commit/2f1bd4647ffb5ab7b3e91556c67ce925d3a7675a))
- automatically exclude the path of css output ([d7f3eda](https://github.com/kei-ito/esifycss/commit/d7f3edadcd509899325167d5558838fe0a1f3c32))
- ignore parse animation error (#403) ([df4896a](https://github.com/kei-ito/esifycss/commit/df4896a112687a8d5e9ba0dc912c9b22bc760cec))

### Tests

- run twice to reproduce the error ([86ef1bc](https://github.com/kei-ito/esifycss/commit/86ef1bc30eafa6475c251fd5a2ee7bc04f4bb150))

### Documentation

- update README ([b0bd5ed](https://github.com/kei-ito/esifycss/commit/b0bd5eddd26503ec6248d18bc9c67ccacf285563))


## v1.4.28 (2021-09-09)

### Bug Fixes

- indexen command ([a51cf70](https://github.com/kei-ito/esifycss/commit/a51cf70064820a1925ed8dd56a87f07a06d7efdf))

### Tests

- add timeout ([148653f](https://github.com/kei-ito/esifycss/commit/148653fd151c2cf2d10acdc3ef2d62fd5877ae06))
- fix ava config ([81acbbb](https://github.com/kei-ito/esifycss/commit/81acbbb6ecb385fe4ee53b6342ff122f54b79ccd))

### Documentation

- update a badge ([3f6cab1](https://github.com/kei-ito/esifycss/commit/3f6cab16f8d90a2de0a02e384227db7a2fbf968f))

### Continuous Integration

- run TestClient ([ee69947](https://github.com/kei-ito/esifycss/commit/ee6994750d47187d2a0c2b8ebd8bb1dd81fc64e7))

### Dependency Upgrades

- downgrade @types/node-fetch ([502e6a5](https://github.com/kei-ito/esifycss/commit/502e6a519eee9e23ac075d04241bb7fa3ca1ce28))
- downgrade node-fetch ([3c2aee6](https://github.com/kei-ito/esifycss/commit/3c2aee62a885a76275ff9906310cf9641cf50fa4))
- @nlib/eslint-config:3.17.24→3.17.25 @nlib/githooks:0.0.5→0.1.0 @types/anymatch:1.3.1→3.0.0 @types/node:15.14.9→16.7.13 @types/node-fetch:2.5.12→3.0.3 @typescript-eslint/eslint-plugin:4.30.0→4.31.0 @typescript-eslint/parser:4.30.0→4.31.0 ([760378f](https://github.com/kei-ito/esifycss/commit/760378f21bca4f168ce41b406625ae375706427c))
- uninstall @nlib/changelog @nlib/lint-commit ([172c4b2](https://github.com/kei-ito/esifycss/commit/172c4b2309008b42e77bf99caae01b170cf75041))
- acorn:8.4.1→8.5.0 acorn-walk:8.1.1→8.2.0 commander:7.2.0→8.1.0 node-fetch:2.6.1→3.0.0 postcss-scss:3.0.5→4.0.0 ts-node:9.1.1→10.2.1 ([5fcd8db](https://github.com/kei-ito/esifycss/commit/5fcd8dbd9667697b7877236656d49f9c541e6ac1))
- setup githooks (#274) ([c3db89d](https://github.com/kei-ito/esifycss/commit/c3db89d6252f110e04066a1b781d182f626f5b07))


## v1.4.27 (2021-03-14)

### Dependency Upgrades

- upgrade dependencies (#235) ([8074d39](https://github.com/kei-ito/esifycss/commit/8074d39f170ce02e2bf63280664b6be5dd428923))


## v1.4.26 (2020-12-20)

### Dependency Upgrades

- upgrade dependencies (#165) ([2c1b842](https://github.com/kei-ito/esifycss/commit/2c1b842b1af71357e310bd62e110032256b4f43c))


## v1.4.25 (2020-10-30)

### Continuous Integration

- update TestClient condition ([78feb22](https://github.com/kei-ito/esifycss/commit/78feb2260250e4935821749e836516efa19cd68d))
- update TestClient condition ([af18829](https://github.com/kei-ito/esifycss/commit/af188299339499a6932b22b04abd7a3478bd3e6f))
- update TestClient condition ([25cabb6](https://github.com/kei-ito/esifycss/commit/25cabb624e8f106c6e312fef73e56a87d99d9ec5))

### Dependency Upgrades

- upgrade dependencies (#107) ([d5bc422](https://github.com/kei-ito/esifycss/commit/d5bc4226cdfb09b42862881424ffb814554e76b9))


## v1.4.24 (2020-10-04)

### Continuous Integration

- fix scripts before publish ([bbadd29](https://github.com/kei-ito/esifycss/commit/bbadd290e2777ca23c4b66713b63a0e511e3e4f0))
- remove the prepack scripts ([c1ad02c](https://github.com/kei-ito/esifycss/commit/c1ad02c5a0bb5ed1b9d1c0275250e729dd1d6aca))

### Dependency Upgrades

- @nlib/changelog@0.1.9 ([b33409d](https://github.com/kei-ito/esifycss/commit/b33409d056771cf99d271a87ec4a3b3398e331f7))
- setup nlib-lint-commit ([6e240fa](https://github.com/kei-ito/esifycss/commit/6e240fa6e17e9b4ed4e9413bbd7610427c86e2d7))


## v1.4.23 (2020-10-01)

### Code Refactoring

- use require.main === module ([66d47d0](https://github.com/kei-ito/esifycss/commit/66d47d055b3ae879ef77a6cff1e4070578240a10))
- fit to postcss 8 ([92bd7c8](https://github.com/kei-ito/esifycss/commit/92bd7c8b77e9c81689f3ef24d5f7592dc9ffdbd4))

### Styles

- fix eslint errors ([c873264](https://github.com/kei-ito/esifycss/commit/c8732640373786710af5963a2f63c19beb6b291e))

### Dependency Upgrades

- upgrade dependencies ([863dce4](https://github.com/kei-ito/esifycss/commit/863dce4d455ce335dc9746ceb5dfe2ac3be1a69e))


## v1.4.22 (2020-07-12)

### Bug Fixes

- support <url> ([af229eb](https://github.com/kei-ito/esifycss/commit/af229ebe5d2772ee9f733d0b1f18163f12e10331))

### Tests

- parse multiple animations ([cafbd8b](https://github.com/kei-ito/esifycss/commit/cafbd8b139fc69edec8cf78780f298207420b84a))

### Code Refactoring

- remove comments in walker ([d6573ab](https://github.com/kei-ito/esifycss/commit/d6573ab6640e19e5e2f1857946c42f41afda5f8d))
- use type ([6390995](https://github.com/kei-ito/esifycss/commit/6390995d0b3889a8d313a0178d74e87fb8511246))


## v1.4.21 (2020-07-11)

### Code Refactoring

- use parse-animation-shorthand instead of nbnf ([a984029](https://github.com/kei-ito/esifycss/commit/a984029359345d91cdd25640d84cca319605bca9))

### Build System

- setup github actions (#83) ([f9a1892](https://github.com/kei-ito/esifycss/commit/f9a1892c71439464db5a6744ede5c47aa399b73e))


## v1.4.20 (2020-06-25)

### Bug Fixes

- copy .d.ts ([4142305](https://github.com/kei-ito/esifycss/commit/41423054add33dbb46d7c09c3630212148d5d68c))


## v1.4.19 (2020-06-24)

### Bug Fixes

- set ecmaVersion (#79) ([37cfcb7](https://github.com/kei-ito/esifycss/commit/37cfcb787b0db2e8d4a3d3fbf91d1e73581f93d2))

### Tests

- dynamic import (#79) ([0dfe44a](https://github.com/kei-ito/esifycss/commit/0dfe44a9fea168357afef3f5ae0bfa67bbcd88b3))


## v1.4.18 (2020-06-24)

### Bug Fixes

- remove acorn-dynamic-import (#79) ([ee1c7f3](https://github.com/kei-ito/esifycss/commit/ee1c7f3540d8091f833672764abba7bb5a80c8ef))


## v1.4.17 (2020-06-19)

### Bug Fixes

- ignore invalid arguments ([495f034](https://github.com/kei-ito/esifycss/commit/495f0347ac58c6480b8371b11851b34852394bcd))


## v1.4.16 (2020-06-17)

### Bug Fixes

- leave import statements ([c1b6610](https://github.com/kei-ito/esifycss/commit/c1b6610655ec0de996ed2e00fc7d6ba470f435d3))


## v1.4.15 (2020-06-17)

### Bug Fixes

- ignore AssignmentExpression ([b991b2c](https://github.com/kei-ito/esifycss/commit/b991b2ce0335fbc2fde208df2ff88c136bc8e6e2))


## v1.4.14 (2020-06-15)

### Bug Fixes

- support locally declared addStyle functions ([d59b3a9](https://github.com/kei-ito/esifycss/commit/d59b3a92d520850cd4da461c42661e9802a11aea))


## v1.4.13 (2020-06-02)

### Bug Fixes

- remove the uninstalled package ([99548ce](https://github.com/kei-ito/esifycss/commit/99548cee942180b40348b2137bb2396c2e0a2862))

### Tests

- set timeout in ava configuration ([2f7ae5e](https://github.com/kei-ito/esifycss/commit/2f7ae5e67426e70d7bd1e2c3fdfe1a6b5d2d082f))
- set timeout ([ba255ea](https://github.com/kei-ito/esifycss/commit/ba255ea889473da23a2f71ba4488afdc14a93cd9))
- set timeout ([a36b976](https://github.com/kei-ito/esifycss/commit/a36b97639026127088ef1dbb71789db8a4fd4307))
- set timeout ([cd6da04](https://github.com/kei-ito/esifycss/commit/cd6da042178f997471f9a43b4eb494ccade59ca6))
- set timeout ([324680f](https://github.com/kei-ito/esifycss/commit/324680fb774fed850573bb23cf285e16e582379c))

### Code Refactoring

- split tests ([2e61cac](https://github.com/kei-ito/esifycss/commit/2e61cac5459e0ff1ad591c46e6bf0b3d92eb02e9))
- fix eslint errors ([33a011c](https://github.com/kei-ito/esifycss/commit/33a011c1dfafdad8f6736b74e1830468db8b6c70))


## v1.4.12 (2020-01-23)


## v1.4.11 (2020-01-22)

### Bug Fixes

- include types ([de03027](https://github.com/kei-ito/esifycss/commit/de030277dafcb6958c5eb64a998ccf64de0aeaa6))


## v1.4.10 (2020-01-21)

### Bug Fixes

- add some utilities ([62b50a7](https://github.com/kei-ito/esifycss/commit/62b50a70d4ef2db8d5ef857487f66fe753cc34f5))


## v1.4.9 (2020-01-21)

### Bug Fixes

- index.ts ([449608b](https://github.com/kei-ito/esifycss/commit/449608bc5dbfc142764990d3eeb5a937d18a39b3))


## v1.4.8 (2020-01-21)

### Bug Fixes

- remove helper ([0919f38](https://github.com/kei-ito/esifycss/commit/0919f38516b8f42418c39fb1dae15a52c1941525))


## v1.4.7 (2020-01-21)

### Bug Fixes

- remove .ts extension ([9e169f2](https://github.com/kei-ito/esifycss/commit/9e169f250a9edacc706790420d6c39ce97d11226))
- build script ([69cd62c](https://github.com/kei-ito/esifycss/commit/69cd62c69fee8aa4d7350bdd6aed8f877b051b7b))
- determine helper import from source string ([8ea1e48](https://github.com/kei-ito/esifycss/commit/8ea1e4876f387167523b7aac4581823e94ecb49e))

### Code Refactoring

- add IStringLiteral ([c9d2752](https://github.com/kei-ito/esifycss/commit/c9d27524e4c664c91aa460fbe6bfc252112f5e57))


## v1.4.6 (2020-01-21)

### Tests

- fix tests ([c17f983](https://github.com/kei-ito/esifycss/commit/c17f98303cc057e6f2ba14230efe437fdf9fae52))


## v1.4.5 (2020-01-21)

### Bug Fixes

- update minifier not to use RegExp ([6702084](https://github.com/kei-ito/esifycss/commit/6702084413dbd02433bda16c308922a517e2e3b7))
- addStyle accepts an array of css objects ([38faafc](https://github.com/kei-ito/esifycss/commit/38faafc903bb4b0e3664dd59b931148bc2e402d2))

### Tests

- parseCSSModuleScript ([5c05722](https://github.com/kei-ito/esifycss/commit/5c0572250bc1b54e4624c5db499646fb4a4fcf59))

### Code Refactoring

- update types ([bf194bb](https://github.com/kei-ito/esifycss/commit/bf194bbc5f1010634ea25e00e5b2cb2041791c76))
- add cssKey ([7d89478](https://github.com/kei-ito/esifycss/commit/7d89478e96f6fe7e0a493d8ae3f2f102866dc462))
- minifyScripts ([da12e6d](https://github.com/kei-ito/esifycss/commit/da12e6d133d2348e47d55c92ba326d3831625b00))


## v1.4.4 (2020-01-20)

### Bug Fixes

- use acorn to remove import declarations (#59) ([279ccc2](https://github.com/kei-ito/esifycss/commit/279ccc2aa354ffd26b65a3cd80e7b89bf1758912))


## v1.4.3 (2020-01-19)

### Bug Fixes

- keep addStyle (#58) ([3fb510e](https://github.com/kei-ito/esifycss/commit/3fb510e8e6727491a8dde7272f1e822c270154db))


## v1.4.2 (2020-01-18)

### Bug Fixes

- generatescript (#57) ([cf1855b](https://github.com/kei-ito/esifycss/commit/cf1855bc42e78b71f3f09923647a5e9c977587b2))


## v1.4.1 (2020-01-18)

### Features

- expose helperPath ([0bc6fca](https://github.com/kei-ito/esifycss/commit/0bc6fcacb36206ebccc21401d976756d3ad0c4bb))


## v1.4.0 (2020-01-18)

### Features

- output css (#55) ([701b733](https://github.com/kei-ito/esifycss/commit/701b7332f4eafe0aafd2c528d9052e2a0881ccbb))

### Tests

- fix css test ([393c134](https://github.com/kei-ito/esifycss/commit/393c1346dfced65e85e302618eb377d2f1425b2a))

### Documentation

- update README ([a021455](https://github.com/kei-ito/esifycss/commit/a021455bc78ad1ba53d57fd1bc607a5ffd90f57f))


## v1.3.14 (2020-01-06)


## v1.3.13 (2019-12-09)


## v1.3.12 (2019-12-09)

### Documentation

- postcssOptions ([594f90e](https://github.com/kei-ito/esifycss/commit/594f90ea809e44aee4435c896a30e849a01737dd))


## v1.3.11 (2019-12-07)

### Bug Fixes

- ignore charset rules ([572d552](https://github.com/kei-ito/esifycss/commit/572d552b5cd26a10e888a96bfce2618280aa9995))


## v1.3.9 (2019-12-06)

### Features

- support postcss.ProcessOptions ([026c237](https://github.com/kei-ito/esifycss/commit/026c23705cf507d07cc730ba601fb95cb6d865c8))

### Tests

- scss ([c00d7d6](https://github.com/kei-ito/esifycss/commit/c00d7d67138bb884ba65554e5ec4267f2df3cecf))


## v1.3.8 (2019-11-14)

### Code Refactoring

- fix an eslint error ([0136a32](https://github.com/kei-ito/esifycss/commit/0136a32018a39684c127879175c70339868c3003))


## v1.3.7 (2019-10-30)

### Bug Fixes

- remove spaces ([dbb3cbb](https://github.com/kei-ito/esifycss/commit/dbb3cbb90b1d9e49c9bff7019eb9438010ba3d51))

### Tests

- wait messages ([e5303c1](https://github.com/kei-ito/esifycss/commit/e5303c1cca3fa9395112dcbcc909d79bb84fe744))

### Code Refactoring

- update setDictionary ([b4ccde1](https://github.com/kei-ito/esifycss/commit/b4ccde17ccf8bb28e5e4fd67fe9a73367970ac25))

### Documentation

- update README ([d4c5d76](https://github.com/kei-ito/esifycss/commit/d4c5d76165573db8a4ba127d2e4d6a870ded4103))


## v1.3.6 (2019-09-20)

### Code Refactoring

- fix type errors (#41) ([9d62f7e](https://github.com/kei-ito/esifycss/commit/9d62f7ecdb1d4d4b51af2ff9fafcc802490964ad))


## v1.3.5 (2019-09-04)

### Bug Fixes

- minifyCSSInScript is not asnyc ([240f045](https://github.com/kei-ito/esifycss/commit/240f0459a549ee95e55af96572f6ab32c078efbb))


## v1.3.4 (2019-09-04)

### Bug Fixes

- allow dynamic import ([1e3561b](https://github.com/kei-ito/esifycss/commit/1e3561ba1c9b8108a82d602ada4547b662615d7a))


## v1.3.3 (2019-07-15)


## v1.3.2 (2019-07-08)

### Features

- add css.d.ts for typeRoots ([81bcdde](https://github.com/kei-ito/esifycss/commit/81bcdde27527409da330c51a76e7bcda3d187ccb))


## v1.3.1 (2019-07-05)

### Features

- use acorn to extract CSS in script ([7585e32](https://github.com/kei-ito/esifycss/commit/7585e325c937502deeffaa6c1974798c15a60c3c))


## v1.3.0 (2019-07-05)

### Features

- add getHelperScript and update processCSS ([696045a](https://github.com/kei-ito/esifycss/commit/696045ab40b0ab7ef2fcad2e60a2f7f70d5b6c86))

### Tests

- fix the message to be wait ([db75c1e](https://github.com/kei-ito/esifycss/commit/db75c1e5ebb07145ddb24ab2a39e34af24424590))

### Code Refactoring

- change the encoding format ([4d310ce](https://github.com/kei-ito/esifycss/commit/4d310ce8f81b30f1ac0a4106c599c06d6bc4c4ef))


## v1.2.11 (2019-07-05)

### Tests

- add tests for serializeCSSAnimationShorthand ([5f9eff2](https://github.com/kei-ito/esifycss/commit/5f9eff2865b5a1a03730b027224ed44a81448ea6))

### Code Refactoring

- split serializeTimingFunction ([21fdf2c](https://github.com/kei-ito/esifycss/commit/21fdf2cfef9c84b424c7d1b518c18ef3bb5200d0))

### Documentation

- update CLI help ([dcdd80d](https://github.com/kei-ito/esifycss/commit/dcdd80d522db064518a1d09c7e1d0e1df9e1d3b2))


## v1.2.10 (2019-07-03)

### Bug Fixes

- normalize path for Windows ([c5d013f](https://github.com/kei-ito/esifycss/commit/c5d013f69d8b4369e4f6735d0e06ae02af3bcbc0))
- allow raw css to work in watch-mode ([c6e9fb3](https://github.com/kei-ito/esifycss/commit/c6e9fb388443ce29f6015eab46a0cb70272e3392))

### Tests

- test the generated code ([b9d65d9](https://github.com/kei-ito/esifycss/commit/b9d65d95c1fef9335f7f7a3c0dde95ecd5db0ece))

### Code Refactoring

- fill the listener ([9cd3fdd](https://github.com/kei-ito/esifycss/commit/9cd3fdd71fff0e2075bd58b612f4110134d7fad7))


## v1.2.9 (2019-07-02)

### Features

- update mangler function ([de49888](https://github.com/kei-ito/esifycss/commit/de49888827fd2a315b1252906a0de945aa1ca0a1))
- add the extensions option ([7c81df8](https://github.com/kei-ito/esifycss/commit/7c81df85d584a955c99b1f519660dbd8f4af9376))

### Code Refactoring

- fix codeclimate issues ([d5bb626](https://github.com/kei-ito/esifycss/commit/d5bb626888eed7bde3433e4efa990df007958948))
- fix an eslint error ([6db7da6](https://github.com/kei-ito/esifycss/commit/6db7da6169375fe807206889f805f2cc9760b87d))

### Styles

- change the log format ([724fa7f](https://github.com/kei-ito/esifycss/commit/724fa7fbbdfa68b17901eebba241d2dc7e8f2e77))

### Documentation

- update example ([a021bbf](https://github.com/kei-ito/esifycss/commit/a021bbfa98e2a14e6c4dd3531eb42904eb0d8dc2))
- add images ([9038721](https://github.com/kei-ito/esifycss/commit/9038721698d8d4a4278701e5d700c449f52e458a))


## v1.2.8 (2019-06-22)

### Bug Fixes

- class → className ([9d3b3c1](https://github.com/kei-ito/esifycss/commit/9d3b3c159376dd5da58e8a63f2a7d8ab963833f5))


## v1.2.7 (2019-06-21)

### Features

- export tokenizeString and delete countTokens ([2883942](https://github.com/kei-ito/esifycss/commit/28839422d859ea631ddfa810a5970ca1919226ca))


## v1.2.6 (2019-06-21)

### Features

- export createOptimizedIdentifier ([64d3ed8](https://github.com/kei-ito/esifycss/commit/64d3ed877e373d799627124ca04be893a79a1f33))


## v1.2.5 (2019-06-21)

### Bug Fixes

- rename ([9bbdcfc](https://github.com/kei-ito/esifycss/commit/9bbdcfcd2e2973f085fea2be93346d48145813bc))


## v1.2.4 (2019-06-21)

### Features

- export some modules for minification ([372197d](https://github.com/kei-ito/esifycss/commit/372197d5cd1c198f6983b845a29cdbf0fb2b615a))


## v1.2.3 (2019-06-21)

### Bug Fixes

- add safe-base64 encoding and make it default ([37fde07](https://github.com/kei-ito/esifycss/commit/37fde07ba4878462d4c71d13d82658aaef94aac1))


## v1.2.2 (2019-06-21)

### Bug Fixes

- include declarations ([cc2b48c](https://github.com/kei-ito/esifycss/commit/cc2b48cff854d4375072f236cc78fb9a03c4460e))


## v1.2.1 (2019-06-21)

### Features

- delete the minifyScript option ([b0b1a24](https://github.com/kei-ito/esifycss/commit/b0b1a24431c2f6a8e2be5012cb2ee09aed6f199d))

### Documentation

- rename IXXXParameters and update README ([30a29fa](https://github.com/kei-ito/esifycss/commit/30a29fa1609d56af2b37ab1d270064b07d93904d))
- add some comments ([6893026](https://github.com/kei-ito/esifycss/commit/6893026743402b160c5bf594c12422a41303400c))


## v1.2.0 (2019-06-20)

### Features

- add rawPrefix option ([86783ad](https://github.com/kei-ito/esifycss/commit/86783ad44c6ae077461a8a232012e26cef2786f3))

### Bug Fixes

- add normalizePath ([38fd430](https://github.com/kei-ito/esifycss/commit/38fd4300712e29798c1e0a5f51b94c54eb5ed14b))

### Code Refactoring

- remove a debug code ([0f0e885](https://github.com/kei-ito/esifycss/commit/0f0e885dbaa365c75d08b4fbb4e4fe867a15c7c1))
- merge wordToString to decode ([e871d54](https://github.com/kei-ito/esifycss/commit/e871d54f8ec3e41dabb8d95cd5ec2dcf025de5d5))

### Documentation

- update README ([fcc3480](https://github.com/kei-ito/esifycss/commit/fcc348089221953357ab8a4d9d06e9b950db5f61))
- update README ([7a10f8d](https://github.com/kei-ito/esifycss/commit/7a10f8daa5ffb76ba62daca1f0d089d5111cea46))
- update README ([161c8b6](https://github.com/kei-ito/esifycss/commit/161c8b6d586e1ea78598d58ea08ea85de6c7bc65))


## v1.1.2 (2019-06-19)

### Features

- add processCSS and hide the public handlers ([8425ef2](https://github.com/kei-ito/esifycss/commit/8425ef21175670a4dc309746ce00f032914bf772))


## v1.1.1 (2019-06-19)

### Features

- expose the event handlers ([2a51bef](https://github.com/kei-ito/esifycss/commit/2a51befeefba66fad02468722d1508efe76ff2cf))


## v1.1.0 (2019-06-19)

### Features

- the 1st arg of the constructor is optional ([b3bbb86](https://github.com/kei-ito/esifycss/commit/b3bbb860a17e15a4dd3388e67a3d5dcaeeb72f11))
- rename output to helper ([b26dce5](https://github.com/kei-ito/esifycss/commit/b26dce51dde9a31c6531e3dcd0e1bdeb9f6af7dd))
- all options are optional ([4375f02](https://github.com/kei-ito/esifycss/commit/4375f0224f3a0c543440fba16d293d5271b9ea4e))

### Tests

- fix the command ([9dde927](https://github.com/kei-ito/esifycss/commit/9dde927ef7bada5f8cd9517789cc2628fbec7440))

### Documentation

- fix the appveyor badge ([67cf241](https://github.com/kei-ito/esifycss/commit/67cf241d6b0c0e29092d90a7f0e1dd48b00b6baa))


## v1.0.1 (2019-06-18)

### Features

- parse @import and transform identifiers ([71805e8](https://github.com/kei-ito/esifycss/commit/71805e876c39d0428c14862fb4c6df24a77a0d0f))
- add noMangle option ([c5377fa](https://github.com/kei-ito/esifycss/commit/c5377fad814d58c09757a014559369c49663ceee))
- rewrite and reconfigure Renovate (#19) ([914f7ff](https://github.com/kei-ito/esifycss/commit/914f7ff85016228c60083bff983e6733a672e810))

### Code Refactoring

- move interfaces ([af374cb](https://github.com/kei-ito/esifycss/commit/af374cb30857603ce310a2750377043cdf204cb3))

### Documentation

- update README ([64b93cf](https://github.com/kei-ito/esifycss/commit/64b93cfd714329f6adbabbfe30ec35776af685f8))
- include sample outputs ([4dff76a](https://github.com/kei-ito/esifycss/commit/4dff76a243793477db67f14387746746530baf69))
- add sample ([2906d01](https://github.com/kei-ito/esifycss/commit/2906d01b882605e5abf952b70f708308c403f312))
- update README ([6e02055](https://github.com/kei-ito/esifycss/commit/6e0205520ea68dd04f7814e4c5e7c28f10516b4e))


## v0.1.16 (2019-01-24)

### Code Refactoring

- fix eslint errors ([8f51d72](https://github.com/kei-ito/esifycss/commit/8f51d727bda6e36e7b74b946b1908fa7cf92fa4f))


## v0.1.15 (2018-10-15)


## v0.1.14 (2018-10-15)


## v0.1.13 (2018-10-12)


## v0.1.12 (2018-10-11)


## v0.1.11 (2018-10-11)


## v0.1.10 (2018-10-05)


## v0.1.9 (2018-10-05)


## v0.1.8 (2018-09-28)


## v0.1.7 (2018-09-27)


## v0.1.6 (2018-09-27)


## v0.1.5 (2018-09-26)


## v0.1.4 (2018-09-26)


## v0.1.3 (2018-09-21)


## v0.1.1 (2018-09-21)


## v0.1.0 (2018-09-21)


