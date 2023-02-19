[![npm (scoped)](https://img.shields.io/npm/v/@xpack/logger.svg)](https://www.npmjs.com/package/@xpack/logger/)
[![license](https://img.shields.io/github/license/xpack/logger-ts.svg)](https://github.com/xpack/logger-ts/blob/xpack/LICENSE)
[![TS-Standard - Typescript Standard Style Guide](https://badgen.net/badge/code%20style/ts-standard/blue?icon=typescript)](https://github.com/standard/ts-standard/)
[![Actions Status](https://github.com/xpack/logger-ts/workflows/CI%20on%20Push/badge.svg)](https://github.com/xpack/logger-ts/actions/)
[![GitHub issues](https://img.shields.io/github/issues/xpack/logger-ts.svg)](https://github.com/xpack/logger-ts/issues/)
[![GitHub pulls](https://img.shields.io/github/issues-pr/xpack/logger-ts.svg)](https://github.com/xpack/logger-ts/pulls/)

# Maintainer & developer info

## Project repository

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

## Prerequisites

The prerequisites are:

- node >= 14.13
- npm
- <https://www.npmjs.com/package/@tsconfig/node14>

To ensure compatibility with older node, revert to an older one:

```sh
nvm use --lts 14
code
```

## Satisfy dependencies

```sh
npm install
```

## Add links for development

```sh
cd logger-ts.git
npm link
```

And in the projects referring it:

```sh
npm link @xpack/logger
```

## Start the compile background task

The TypeScript compiler can automatically recompile modified files. For
this, start it in `watch` mode.

```sh
npm run compile-watch
```

## Language standard compliance

The current version is TypeScript 4:

- <https://www.typescriptlang.org>
- <https://www.typescriptlang.org/docs/handbook>

The compiler is configured to produce `node16` files, which means
ECMAScript6 with modules, which can be imported by any other project
which uses ES6


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

- none

To manually fix compliance with the style guide (where possible):

```console
% npm run fix

> @xpack/logger@6.0.0 fix
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

> @xpack/logger@6.0.0 pretest
> npm run compile && npm run lint


> @xpack/logger@6.0.0 compile
> tsc -p ./


> @xpack/logger@6.0.0 lint
> ts-standard src


> @xpack/logger@6.0.0 test
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

> @xpack/logger@6.0.0 tap
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

The continuous integration tests are performed via GitHub
[Actions](https://github.com/xpack/logger-ts/actions/) on Ubuntu,
Windows and macOS, using node 14, 16, 18.

## How to make new releases

### Release schedule

There are no fixed releases.

### Check Git

In the `xpack/logger-ts` Git repo:

- switch to the `develop` branch
- if needed, merge the `master` branch

No need to add a tag here, it'll be added when the release is created.

### Update npm packages

- `npm outdated`
- `npm update` or edit and `npm install`
- repeat and possibly manually edit `package.json` until everything is
  up to date
- commit the changes

Keep:

- [`@types/node`](https://www.npmjs.com/package/@types/node?activeTab=versions)
  locked to the oldest supported node
  [version](https://nodejs.org/en/) available for Typescript.

### Determine the next version

Use the semver semantics. Determine the next version (like `6.0.0`),
and eventually update the
`package.json` file; the format is `6.0.0-pre`.

### Fix possible open issues

Check GitHub issues and pull requests:

- <https://github.com/xpack/logger-ts/issues/>

### Update `README-MAINTAINER.md`

Update the `README-MAINTAINER.md` file to reflect the changes
related to the new version.

## Update `CHANGELOG.md`

- check the latest commits `npm run git-log`
- open the `CHANGELOG.md` file
- check if all previous fixed issues are in
- add a line _* v6.0.0 released_
- commit with a message like _prepare v6.0.0_

## Prepare to publish to npmjs.com

- terminate all running tasks (**Terminal** → **Terminate Task...**)
- select the `develop` branch
- commit everything
- `npm run fix`
- in the develop branch, commit all changes
- `npm run test`
- `npm run typedoc`
- `npm run pack`; check the list of packaged files, possibly
  update `.npmignore`
- `npm version patch` (bug fixes), `npm version minor` (compatible API
  additions), `npm version major` (incompatible API changes)
- push all changes to GitHub;
- the `postversion` npm script should also update tags via
  `git push origin --tags`; this should trigger CI
- **wait for CI tests to complete**
- check <https://github.com/xpack/logger-ts/actions/>

## Documentation

The documentation site is built with [TypeDoc](https://typedoc.org) and
published in the project GitHub
[Pages](https://xpack.github.io/logger-ts/).

Deployment is performed by a dedicated workflow in GitHub
[Actions](https://github.com/xpack/logger-ts/actions/workflows/typedoc.yml)

## Publish

- `npm publish --tag next` (use `--access public` when publishing for the first time)

Check if the version is present at
[@xpack/logger Versions](https://www.npmjs.com/package/@xpack/logger?activeTab=versions).

### Test

Test it with:

```bash
npm install -global @xpack/logger@next
```

### Merge into `master`

In this Git repo:

- select the `master` branch
- merge `develop`
- push all branches

### Tag the npm package as `latest`

When the release is considered stable, promote it as `latest`:

- `npm dist-tag ls @xpack/logger`
- `npm dist-tag add @xpack/logger@6.0.0 latest`
- `npm dist-tag ls @xpack/logger`

## Useful links

- <https://www.typescriptlang.org/docs/>
- <https://typedoc.org>, <https://typedoc.org/guides/doccomments/>
- <https://tsdoc.org>
- <https://jsdoc.app/index.html>
- <https://www.npmjs.com/package/typedoc-theme-yaf>
- <https://github.com/citkane/typedoc-plugin-versions>
