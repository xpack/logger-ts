[![npm (scoped)](https://img.shields.io/npm/v/@xpack/logger.svg)](https://www.npmjs.com/package/@xpack/logger)
[![license](https://img.shields.io/github/license/xpack/logger-js.svg)](https://github.com/xpack/logger-js/blob/xpack/LICENSE)
[![Standard](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com/)
[![Travis](https://img.shields.io/travis/xpack/logger-js.svg?label=linux)](https://travis-ci.org/xpack/logger-js)
[![AppVeyor](https://ci.appveyor.com/api/projects/status/rydiijfkxr11essq?svg=true)](https://ci.appveyor.com/project/ilg-ul/logger-js)
[![GitHub issues](https://img.shields.io/github/issues/xpack/logger-js.svg)](https://github.com/xpack/logger-js/issues)
[![GitHub pulls](https://img.shields.io/github/issues-pr/xpack/logger-js.svg)](https://github.com/xpack/logger-js/pulls)

## logger-js - maintainer info

This page documents some of the operations required during module
development and maintenance.

For the user information, see the
[README](https://github.com/xpack/logger-js/blob/master/README.md) file.

### Git repository

```console
$ git clone https://github.com/xpack/logger-js.git logger-js.git
$ cd logger-js.git
$ npm install
$ npm link
$ ls -l ${HOME}/.nvm/versions/node/$(node --version)/lib/node_modules/@xpack
```

A link to the development folder should appear in the
`node_modules` folder.

In projects that use this module under development, link back from the
global location:

```console
$ cd <project-folder>
$ npm link @xpack/logger
```

### Tests

The tests use the [`node-tap`](http://www.node-tap.org) framework
(_A Test-Anything-Protocol library for Node.js_, written by Isaac Schlueter).

As for any `npm` package, the standard way to run the project tests is via
`npm run test`:

```console
$ cd logger-js.git
$ npm install
$ npm run test
```

A typical test result looks like:

```console
$ npm run test

> @xpack/logger@1.0.0 test /Users/ilg/My Files/MacBookPro Projects/xPack/npm-modules/logger-js.git
> standard && npm run test-tap -s

test/tap/010-mock-console.js .......................... 7/7
test/tap/020-logger-single.js ..................... 183/183
test/tap/030-logger-multi.js ...................... 184/184
test/tap/040-is-level.js ............................ 72/72
test/tap/050-buffer.js ............................ 108/108
test/tap/060-logger-empty.js ........................ 25/25
total ............................................. 579/579

  579 passing (2s)

  ok
```

To run a specific test with more verbose output, use `npm run tap`:

```console
$ npm run tap test/tap/010-mock-console.js

> @xpack/logger@1.0.0 tap /Users/ilg/My Files/MacBookPro Projects/xPack/npm-modules/logger-js.git
> tap --reporter=spec --timeout 300 --no-color "test/tap/010-mock-console.js"


test/tap/010-mock-console.js
  mock console
    ✓ stdout is empty
    ✓ stderr is empty
    ✓ stdout has one entry
    ✓ stdout is output
    ✓ stderr is empty
    ✓ stderr has one entry
    ✓ stderr is error


  7 passing (367.947ms)
```

### Coverage tests

Coverage tests are a good indication on how much of the source files is
exercised by the tests. Ideally all source files should be covered 100%,
for all 4 criteria (statements, branches, functions, lines).

To run the coverage tests, use `npm run test-coverage`:

```console
$ npm run test-coverage

> @xpack/logger@1.0.0 test-coverage /Users/ilg/My Files/MacBookPro Projects/xPack/npm-modules/logger-js.git
> tap --coverage --reporter=classic --timeout 600 --no-color "test/tap/*.js"

test/tap/010-mock-console.js .......................... 7/7
test/tap/020-logger-single.js ..................... 183/183
test/tap/030-logger-multi.js ...................... 184/184
test/tap/040-is-level.js ............................ 72/72
test/tap/050-buffer.js ............................ 108/108
test/tap/060-logger-empty.js ........................ 25/25
total ............................................. 579/579

  579 passing (4s)

  ok
-------------------|----------|----------|----------|----------|-------------------|
File               |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
-------------------|----------|----------|----------|----------|-------------------|
All files          |      100 |      100 |      100 |      100 |                   |
 logger-js.git     |      100 |      100 |      100 |      100 |                   |
  index.js         |      100 |      100 |      100 |      100 |                   |
 logger-js.git/lib |      100 |      100 |      100 |      100 |                   |
  logger.js        |      100 |      100 |      100 |      100 |                   |
-------------------|----------|----------|----------|----------|-------------------|
```

### Continuous Integration (CI)

The continuous integration tests are performed via
[Travis CI](https://travis-ci.org/xpack/logger-js) and
[AppVeyor](https://ci.appveyor.com/project/ilg-ul/logger-js).

To speed up things, the `node_modules` folder is cached between builds.

The tests are currently performed with node 8, 10, 12.

### Standard compliance

The module uses ECMAScript 6 class definitions.

As style, it uses the [JavaScript Standard Style](https://standardjs.com/),
automatically checked at each commit via Travis CI.

Known and accepted exceptions:

- none

To manually fix compliance with the style guide (where possible):

```console
$ npm run fix

> @xpack/logger@1.0.0 fix /Users/ilg/My Files/MacBookPro Projects/xPack/npm-modules/logger-js.git
> standard --fix

```

### Documentation metadata

The documentation metadata follows the [JSdoc](http://usejsdoc.org) tags.

To enforce checking at file level, add the following comments right after
the `use strict`:

```javascript
'use strict'
/* eslint valid-jsdoc: "error" */
/* eslint max-len: [ "error", 80, { "ignoreUrls": true } ] */
```

Note: be sure C style comments are used, C++ styles are not parsed by
[ESLint](http://eslint.org).

### How to publish

- `npm run fix`
- commit all changes
- `npm run test-coverage`
- update `CHANGELOG.md`; commit with a message like _CHANGELOG: prepare v0.1.2_
- `npm version patch` (bug fixes), `npm version minor` (compatible API
  additions), `npm version major` (incompatible API changes)
- push all changes to GitHub; this should trigger CI
- wait for CI tests to complete
- `npm publish` (use `--access public` when publishing for the first time)
