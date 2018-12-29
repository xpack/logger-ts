[![npm (scoped)](https://img.shields.io/npm/v/@xpack/logger.svg)](https://www.npmjs.com/package/@xpack/logger) 
[![license](https://img.shields.io/github/license/xpack/logger-js.svg)](https://github.com/xpack/logger-js/blob/xpack/LICENSE) 
[![Standard](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com/)
[![Travis](https://img.shields.io/travis/xpack/logger-js.svg?label=linux)](https://travis-ci.org/xpack/logger-js)
[![AppVeyor](https://ci.appveyor.com/api/projects/status/rydiijfkxr11essq?svg=true)](https://ci.appveyor.com/project/ilg-ul/logger-js) 
[![GitHub issues](https://img.shields.io/github/issues/xpack/logger-js.svg)](https://github.com/xpack/logger-js/issues)
[![GitHub pulls](https://img.shields.io/github/issues-pr/xpack/logger-js.svg)](https://github.com/xpack/logger-js/pulls)

## A generic logger class

A Node.js module with a classes that implements a generic console logger.

## Prerequisites

A recent [Node.js](https://nodejs.org) (>=8.x), since the ECMAScript 6 class 
syntax is used.

## Easy install

The module is available as 
[`@xpack/logger`](https://www.npmjs.com/package/@xpack/logger) 
from the public repository, use `npm` to install it inside the module where 
it is needed:

```bash
$ npm install @xpack/logger --save
```

The module does not provide any executables, and generally there are few 
reasons to install it globally.

The development repository is available from the GitHub 
[xpack/logger-js](https://github.com/xpack/logger-js) 
project.

## User info

The module can be included in Node.js applications as usual.

```javascript
const Logger = require('@xpack/logger').Logger
```

TODO: add more explanations.

## Developer info

### Git repo

For a macOS development machine, use:

```console
$ git clone https://github.com/xpack/logger-js.git logger-js.git
$ cd logger-js.git
$ npm install
$ npm link 
$ ls -l ${HOME}/Library/npm/lib/node_modules/@xpack
```

(For setups where npm is installed in system folders, use `sudo`.)

A link to the development folder should be present in the system
`node_modules` folder.

In projects that use this module under development, link back from the
global location:

```console
$ npm link @xpack/logger
```

### Tests

The tests use the [`node-tap`](http://www.node-tap.org) framework 
(_A Test-Anything-Protocol library for Node.js_, written by Isaac Schlueter).

As for any `npm` package, the standard way to run the project tests is via 
`npm test`:

```bash
$ cd logger-js.git
$ npm install
$ npm test
```

A typical test result looks like:

```
$ npm run test

> @xpack/logger@0.1.15 test /Users/ilg/My Files/MacBookPro Projects/xPack/npm-modules/logger-js.git
> standard && npm run test-tap -s

test/tap/author.js .................................... 8/8
test/tap/cmd-copy.js ................................ 40/40
test/tap/errors.js .................................. 18/18
test/tap/interactive.js ............................. 14/14
test/tap/logger.js ................................ 147/147
test/tap/module-invocation.js ......................... 9/9
test/tap/options-common.js ........................ 126/126
total ............................................. 362/362

  362 passing (10s)

  ok
```

To run a specific test with more verbose output, use `npm run tap`:

```
$ npm run tap test/tap/cmd-copy.js -s

test/tap/cmd-copy.js
  xtest copy
    ✓ exit code is syntax
    ✓ has two errors
    ✓ has --file error
    ✓ has --output error
    ✓ has Usage

  xtest copy -h
    ✓ exit code is success
    ✓ has enough output
    ✓ has title
    ✓ has Usage
    ✓ has copy options
    ✓ has --file
    ✓ has --output
    ✓ stderr is empty

  xtest cop -h
    ✓ exit code is success
    ✓ has enough output
    ✓ has title
    ✓ has Usage
    ✓ stderr is empty

  xtest cop --file xxx --output yyy
    ✓ exit code is input
    ✓ stdout is empty
    ✓ strerr is ENOENT

  unpack
    ✓ cmd-code.tgz unpacked into /var/folders/n7/kxqjc5zs4qs0nb44v1l2r2j00000gn/T/xtest-copy
    ✓ chmod ro file
    ✓ mkdir folder
    ✓ chmod ro folder

  xtest cop --file input.json --output output.json
    ✓ exit code is success
    ✓ stdout is empty
    ✓ stderr is empty
    ✓ content is read in
    ✓ json was parsed
    ✓ has name

  xtest cop --file input --output output -v
    ✓ exit code
    ✓ message is Done
    ✓ stderr is empty

  xtest cop --file input --output ro/output -v
    ✓ exit code is output
    ✓ up to writing
    ✓ stderr is EACCES

  cleanup
    ✓ chmod rw file
    ✓ chmod rw folder
    ✓ remove tmpdir


  40 passing (2s)
```

### Coverage tests

Coverage tests are a good indication on how much of the source files is 
exercised by the tests. Ideally all source files should be covered 100%, 
for all 4 criteria (statements, branches, functions, lines).

To run the coverage tests, use `npm run test-coverage`:

```
$ npm run test-coverage

> @xpack/logger@0.1.15 test-coverage /Users/ilg/My Files/MacBookPro Projects/xPack/npm-modules/logger-js.git
> tap --coverage --reporter=classic --timeout 600 --no-color "test/tap/*.js"

test/tap/author.js .................................... 8/8
test/tap/cmd-copy.js ................................ 40/40
test/tap/errors.js .................................. 18/18
test/tap/interactive.js ............................. 14/14
test/tap/logger.js ................................ 147/147
test/tap/module-invocation.js ......................... 9/9
test/tap/options-common.js ........................ 126/126
total ............................................. 362/362

  362 passing (20s)

  ok
------------------------------|----------|----------|----------|----------|----------------|
File                          |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
------------------------------|----------|----------|----------|----------|----------------|
All files                     |      100 |    89.01 |    96.43 |      100 |                |
 logger-js.git     |      100 |      100 |      100 |      100 |                |
  index.js                    |      100 |      100 |      100 |      100 |                |
 logger-js.git/lib |      100 |    89.01 |    96.43 |      100 |                |
  cli-application.js          |      100 |    85.71 |    90.91 |      100 |                |
  cli-command.js              |      100 |    78.57 |      100 |      100 |                |
  cli-error.js                |      100 |      100 |      100 |      100 |                |
  cli-help.js                 |      100 |    90.43 |      100 |      100 |                |
  cli-logger.js               |      100 |       72 |      100 |      100 |                |
  cli-options.js              |      100 |    98.39 |      100 |      100 |                |
------------------------------|----------|----------|----------|----------|----------------|
```

### Continuous Integration (CI)

The continuous integration tests are performed via 
[Travis CI](https://travis-ci.org/xpack/logger-js) and 
[AppVeyor](https://ci.appveyor.com/project/ilg-ul/logger-js).

To speed up things, the `node_modules` folder is cached between builds.

### Standard compliance

The module uses ECMAScript 6 class definitions.

As style, it uses the [JavaScript Standard Style](https://standardjs.com/), 
automatically checked at each commit via Travis CI.

Known and accepted exceptions:

- `// eslint-disable-line node/no-deprecated-api` to continue using the 
deprecated `domain` module

To manually fix compliance with the style guide (where possible):

```
$ npm run fix

> @xpack/logger@0.1.12 fix /Users/ilg/My Files/MacBookPro Projects/xPack/npm-modules/logger-js.git
> standard --fix

```

### Documentation metadata

The documentation metadata follows the [JSdoc](http://usejsdoc.org) tags.

To enforce checking at file level, add the following comments right after 
the `use strict`:

```
'use strict'
/* eslint valid-jsdoc: "error" */
/* eslint max-len: [ "error", 80, { "ignoreUrls": true } ] */
```

Note: be sure C style comments are used, C++ styles are not parsed by 
[ESLint](http://eslint.org).

### How to publish

* commit all changes
* `npm run test` (`fix` included)
* update `CHANGELOG.md`; commit with a message like _CHANGELOG: prepare v0.1.2_
* `npm version patch`
* push all changes to GitHub; this should trigger CI
* wait for CI tests to complete
* `npm publish`

## License

The original content is released under the 
[MIT License](https://opensource.org/licenses/MIT), with all rights 
reserved to [Liviu Ionescu](https://github.com/ilg-ul).
