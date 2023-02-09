[![npm (scoped)](https://img.shields.io/npm/v/@xpack/logger.svg)](https://www.npmjs.com/package/@xpack/logger)
[![license](https://img.shields.io/github/license/xpack/logger-ts.svg)](https://github.com/xpack/logger-ts/blob/xpack/LICENSE)
[![TS-Standard - Typescript Standard Style Guide](https://badgen.net/badge/code%20style/ts-standard/blue?icon=typescript)](https://github.com/standard/ts-standard)
[![Actions Status](https://github.com/xpack/logger-ts/workflows/CI%20on%20Push/badge.svg)](https://github.com/xpack/logger-ts/actions)
[![GitHub issues](https://img.shields.io/github/issues/xpack/logger-ts.svg)](https://github.com/xpack/logger-ts/issues/)
[![GitHub pulls](https://img.shields.io/github/issues-pr/xpack/logger-ts.svg)](https://github.com/xpack/logger-ts/pulls)

# Developer info

This page documents the prerequisites and procedures used during the
development of the `@xpack/logger` module.

This project is written in TypeScript.

## Prerequisites

The prerequisites are:

- node >= 14.13
- npm
- <https://www.npmjs.com/package/@tsconfig/node14>

## Clone the project repository

The project is hosted on GitHub:

- <https://github.com/xpack/logger-ts.git>

To clone the `master` branch, use:

```sh
mkdir ${HOME}/Work/vscode-extensions && cd ${HOME}/Work/vscode-extensions
git clone \
https://github.com/xpack/logger-ts.git logger-ts.git
```

For development, to clone the `develop` branch, use:

```sh
git clone --branch develop \
https://github.com/xpack/logger-ts.git logger-ts.git
```

## Satisfy dependencies

```sh
npm install
```

## Add links dor development

```sh
cd logger-ts.git
npm link
```

And in projects referring this:

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
% npm run fix

> @xpack/logger@5.0.4 fix
> ts-standard --fix src && standard --fix test

```

## Tests

The tests use the [`node-tap`](http://www.node-tap.org) framework
(_A Test-Anything-Protocol library for Node.js_, written by Isaac Schlueter).

Tests can be written in TypeScript, assuming `ts-node` is also installed
(<https://node-tap.org/docs/using-with/#using-tap-with-typescript>)

As for any `npm` package, the standard way to run the project tests is via
`npm run test`:

```sh
cd logger-ts.git
npm install
npm run test
```

A typical test result looks like:

```console
% npm run test

> @xpack/logger@5.0.4 pretest
> npm run compile && npm run lint


> @xpack/logger@5.0.4 compile
> tsc -p ./


> @xpack/logger@5.0.4 lint
> ts-standard src


> @xpack/logger@5.0.4 test
> npm run test-tap100 -s

tests/tap/010-mock-console.js .......................... 7/7
tests/tap/020-logger-single.js ..................... 186/186
tests/tap/030-logger-multi.js ...................... 184/184
tests/tap/040-is-level.js ............................ 72/72
tests/tap/050-buffer.js ............................ 108/108
tests/tap/060-logger-empty.js ........................ 25/25
tests/tap/070-logger-default.js ........................ 2/2
tests/tap/080-undefined.js ........................... 38/38
total .............................................. 622/622

  622 passing (676.623ms)

  ok
------------|---------|----------|---------|---------|-------------------
File        | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------|---------|----------|---------|---------|-------------------
All files   |     100 |      100 |     100 |     100 |
 src        |     100 |      100 |     100 |     100 |
  index.ts  |     100 |      100 |     100 |     100 |
 src/lib    |     100 |      100 |     100 |     100 |
  logger.ts |     100 |      100 |     100 |     100 |
------------|---------|----------|---------|---------|-------------------
%
```

To run a specific test with more verbose output, use `npm run tap`:

```console
$ npm run tap tests/tap/010-mock-console.js

> @xpack/logger@5.0.4 tap
> tap --reporter=spec --timeout 300 "tests/tap/010-mock-console.js"


tests/tap/010-mock-console.js
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
Windows and macOS, using node 14, 16, 18.

## TSDoc (TypeScript documentation)

- <https://tsdoc.org>
- <https://typedoc.org/guides/doccomments/>
- <https://jsdoc.app/index.html>
