[![npm (scoped)](https://img.shields.io/npm/v/@xpack/logger.svg)](https://www.npmjs.com/package/@xpack/logger)
[![license](https://img.shields.io/github/license/xpack/logger-js.svg)](https://github.com/xpack/logger-js/blob/xpack/LICENSE)
[![Standard](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com/)
[![Actions Status](https://github.com/xpack/logger-js/workflows/CI%20on%20Push/badge.svg)](https://github.com/xpack/logger-js/actions)
[![GitHub issues](https://img.shields.io/github/issues/xpack/logger-js.svg)](https://github.com/xpack/logger-js/issues/)
[![GitHub pulls](https://img.shields.io/github/issues-pr/xpack/logger-js.svg)](https://github.com/xpack/logger-js/pulls)

# Developer info

This page documents the prerequisites and procedures used during the
development of the `@xpack/logger` module.

This project is written in TypeScript.

## Prerequisites

The prerequisites are:

- node >= 10.x & npm
- <https://www.npmjs.com/package/@tsconfig/node10>

## Clone the project repository

The project is hosted on GitHub:

- <https://github.com/xpack/logger-js.git>

To clone the `master` branch, use:

```sh
mkdir ${HOME}/Work/vscode-extensions
cd ${HOME}/Work/vscode-extensions
git clone \
https://github.com/xpack/logger-js.git logger-js.git
```

For development, to clone the `develop` branch, use:

```sh
git clone --branch develop \
https://github.com/xpack/logger-js.git logger-js.git
```

## Satisfy dependencies

```sh
npm install
```

## Add links dor development

```sh
cd logger-js.git
npm link
```

And in projects refering this:

```sh
npm link @xpack/logger
```

## Start the compile background task

```sh
npm run compile-watch
```

## Language standard compliance

The current version is TypeScript 4:

- <https://www.typescriptlang.org>
- <https://www.typescriptlang.org/docs/handbook>

## Standard style

As style, the project uses the TypeScript variant of
[Standard Style](https://standardjs.com/#typescript),
automatically checked at each commit via CI.

Generally, to fit two editor windows side by side in a screen,
all files should limit the line length to 80.

```js
/* eslint max-len: [ "error", 80, { "ignoreUrls": true } ] */
```

The syntax for other exceptions is:

```js
// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
```

Known and accepted exceptions:

- `/* eslint-disable @typescript-eslint/no-floating-promises */` in tests

To manually fix compliance with the style guide (where possible):

```console
$ npm run fix

> @xpack/logger@0.1.0 fix
> ts-standard --fix src
```

## Tests

The tests use the [`node-tap`](http://www.node-tap.org) framework
(_A Test-Anything-Protocol library for Node.js_, written by Isaac Schlueter).

Tests can be written in TypeScript, assuming `ts-node` is also installed
(<https://node-tap.org/docs/using-with/#using-tap-with-typescript>)

As for any `npm` package, the standard way to run the project tests is via
`npm run test`:

```sh
cd logger-js.git
npm install
npm run test
```

A typical test result looks like:

```console
$ npm run test

> @xpack/logger@3.0.1 test
> standard && npm run test-tap -s

test/tap/010-mock-console.js .......................... 7/7
test/tap/020-logger-single.js ..................... 186/186
test/tap/030-logger-multi.js ...................... 184/184
test/tap/040-is-level.js ............................ 72/72
test/tap/050-buffer.js ............................ 108/108
test/tap/060-logger-empty.js ........................ 25/25
test/tap/070-logger-default.js ........................ 2/2
test/tap/080-undefined.js ........................... 38/38
total ............................................. 622/622

  622 passing (819.993ms)

  ok
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |     100 |      100 |     100 |     100 |                   
 logger-js.git     |     100 |      100 |     100 |     100 |                   
  index.js         |     100 |      100 |     100 |     100 |                   
 logger-js.git/lib |     100 |      100 |     100 |     100 |                   
  logger.js        |     100 |      100 |     100 |     100 |                   
-------------------|---------|----------|---------|---------|-------------------
```

To run a specific test with more verbose output, use `npm run tap`:

```console
$ npm run tap test/tap/010-mock-console.js

> @xpack/logger@3.0.1 tap
> tap --reporter=spec --timeout 300 "test/tap/010-mock-console.js"


test/tap/010-mock-console.js
  mock console
    ✓ stdout is empty
    ✓ stderr is empty
    ✓ stdout has one entry
    ✓ stdout is output
    ✓ stderr is empty
    ✓ stderr has one entry
    ✓ stderr is error


  7 passing (260.048ms)
----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------|---------|----------|---------|---------|-------------------
All files |       0 |        0 |       0 |       0 |                   
----------|---------|----------|---------|---------|-------------------
```

### Coverage tests

Coverage tests are a good indication on how much of the source files is
exercised by the tests. Ideally all source files should be covered 100%,
for all 4 criteria (statements, branches, functions, lines).

Thus, passing coverage tests was enforced for all tests, as seen before.

### Continuous Integration (CI)

The continuous integration tests are performed via
[GitHub Actions](https://github.com/features/actions) on Ubuntu,
Windows and macOS, using node 10, 12, 14.

## TSDoc (TypeScript documentation)

- <https://tsdoc.org>
- <https://typedoc.org/guides/doccomments/>
- <https://jsdoc.app/index.html>
