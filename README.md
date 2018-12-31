[![npm (scoped)](https://img.shields.io/npm/v/@xpack/logger.svg)](https://www.npmjs.com/package/@xpack/logger) 
[![license](https://img.shields.io/github/license/xpack/logger-js.svg)](https://github.com/xpack/logger-js/blob/xpack/LICENSE) 
[![Standard](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com/)
[![Travis](https://img.shields.io/travis/xpack/logger-js.svg?label=linux)](https://travis-ci.org/xpack/logger-js)
[![AppVeyor](https://ci.appveyor.com/api/projects/status/rydiijfkxr11essq?svg=true)](https://ci.appveyor.com/project/ilg-ul/logger-js) 
[![GitHub issues](https://img.shields.io/github/issues/xpack/logger-js.svg)](https://github.com/xpack/logger-js/issues)
[![GitHub pulls](https://img.shields.io/github/issues-pr/xpack/logger-js.svg)](https://github.com/xpack/logger-js/pulls)

## A generic console logger class

A Node.js module with a class that implements a generic console logger.

## Prerequisites

A recent [Node.js](https://nodejs.org) (>=8.x), since the ECMAScript 6 class 
syntax is used.

## Easy install

The module is available as 
[`@xpack/logger`](https://www.npmjs.com/package/@xpack/logger) 
from the public repository; use `npm` to install it inside the module where 
it is needed:

```bash
$ npm install @xpack/logger --save
```

The module does not provide any executables, and generally there are no 
reasons to install it globally.

The development repository is available from the GitHub 
[xpack/logger-js](https://github.com/xpack/logger-js) 
project.

## Compatibility notices

According to [semver](https://semver.org) requirements, 
incompatible API changes require higher major numbers.

### v2.x

The logger constructor was changed to use the generic arguments object.

If upgrading from previous versions, change the syntax from:

```javascript
const logger = new Logger(console, 'info')
```

to:

```javascript
const logger = new Logger({
  console,
  level: 'info'
})
```

## User info

This section is intended for those who want to use this module in their
own code.

The `@xpack/logger` module can be included in Node.js applications as 
usual, with `require()`.

```javascript
const Logger = require('@xpack/logger').Logger
```

### Log levels

The following strings are recognised as valid level names:

- `'silent'` (0)
- `'error'` (10)
- `'warn'` (20)
- `'info'` (30)
- `'verbose'` (40)
- `'debug'` (50)
- `'trace'` (60)
- `'all'` (70)

Internally they are converted to integer values, and these integers 
(the values in parenthesis) are used in comparisons. Higher values 
mean more verbosity.

### Delayed log level use cases

There are cases when the logger must be created very early in the
life cycle of an application, even before it is practically possible
to determine the log level.

For these cases, if the logger is created without a log level,
it is set to a **preliminary state**, and **all log lines are
stored in an internal buffer**, until the moment the log
level is set, when the buffer is walked and the lines are processed.

### Constructor

#### `Logger(Object args)`

The common use case is to create the logger instance with a `console` and a 
string `level` name.

The `console` must be an object with at least two methods, 
`log()` and `error()`, as defined in the Node.js documentation for 
[console](https://nodejs.org/dist/latest-v10.x/docs/api/console.html).

Example:

```javascript
const logger = new Logger({
  console, 
  level:'info'
})
```

The `level` property is optional. Without it, the constructor will
create the logger in a preliminary state, when all log lines are stored 
in an internal buffer until the log level is set.

Example:

```javascript
const logger = new Logger({
  console
})
```

### Managing the log levels

The log level is managed by a setter/getter pair.

#### `set level (String level)`

Set the log level. If this is the first time the log level is set, flush the
internal buffer.

Example:

```javascript
logger.level = 'info'
```

#### `String get level ()`

Get the current log level, as a string.

Example:

```javascript
console.log(logger.level)
```

### Logging lines

All functions accept an optional string message and possibly some arguments,
as processed by the standard Node.js 
[`util.format(msg, ...args)`](https://nodejs.org/dist/latest-v10.x/docs/api/util.html#util_util_format_format_args) 
function.

#### `always (String msg = '', ...args)`

Log always, regardless of the log level, even `'silent'`, when no other 
messages are logged. The message is passed via `console.log`

Example:

```javascript
logger.always(version)
```

#### `error (String msg = '', ...args)`

Log errors, if the log level is `'error'` or higher. The message is prefixed 
with `error: ` and passed via `console.error`.

Example:

```javascript
logger.error('Not good...')
```

#### `error (Error err)`

This is a special case when the input is an `Error` object. It is expanded,
including a full stack trace, and passed via `console.error`.

Example:

```javascript
try {
  // ...
} catch (ex) {
  log.error(ex)
}
```

#### `output (String msg = '', ...args)`

Log errors, if the log level is `'error'` or higher. The message is passed 
via `console.log`.

It differs from `error()` by not prefixing the string with `error: ` and using 
`console.log` instead of `console.error`.

Examples:

```javascript
log.output('Not good either...')
```

```javascript
try {
  // ...
} catch (ex) {
  // Do not show the stack trace.
  log.output(ex.message)
}
```

#### `warn (String msg = '', ...args)`

Log warnings, if the log level is `'warn'` or higher. The message is prefixed 
with `warning: ` and passed via `console.error`.

Example:

```javascript
log.warn('Beware...')
```

#### `info (String msg = '', ...args)`

Log informative messages, if the log level is `'info'` or higher. 
The message  passed via `console.log`.

Example:

```javascript
log.info(title)
```

#### `verbose (String msg = '', ...args)`

Log more informative messages, if the log level is `'verbose'` or higher. 
The message  passed via `console.log`.

Example:

```javascript
log.verbose('Configurations:')
```

#### `debug (String msg = '', ...args)`

Log debug messages, if the log level is `'debug'` or higher. 
The message  passed via `console.log`.

Example:

```javascript
log.debug(`spawn: ${cmd}`)
```

#### `trace (String msg = '', ...args)`

Log debug messages, if the log level is `'trace'` or higher. 
The message  passed via `console.log`.

Example:

```javascript
log.trace(`${this.constructor.name}.doRun()`)
```

### Checking log levels

If the logging code is more complex than a single line, 
for example it needs a long loop, 
it is recommended to explicitly check the log level and
if not high enough, skip the code entirely.

Example:

```javascript
  if (log.isVerbose()) {
    for (const [folderName, folder] of Object.entries(folders)) {
      log.trace(`'${folderName}' ${folder.toolchainOptions}`)
    }
  }
```

#### `Boolean isSilent ()`

Return `true` if the log level is `'silent'` or higher.

#### `Boolean isError ()`

Return `true` if the log level is `'error'` or higher.

#### `Boolean isWarn ()`

Return `true` if the log level is `'warn'` or higher.

#### `Boolean isInfo ()`

Return `true` if the log level is `'info'` or higher.

#### `Boolean isVerbose ()`

Return `true` if the log level is `'verbose'` or higher.

#### `Boolean isDebug ()`

Return `true` if the log level is `'debug'` or higher.

#### `Boolean isTrace ()`

Return `true` if the log level is `'trace'` or higher.

#### `Boolean isAll ()`

Return `true` if the log level is `'all'`.


## Developer info

This section is intended for those who want to contribute to the
development of this module.

### Git repository

For a macOS development machine, use:

```console
$ git clone https://github.com/xpack/logger-js.git logger-js.git
$ cd logger-js.git
$ npm install
$ npm link 
$ ls -l ${HOME}/Library/npm/lib/node_modules/@xpack
```

For setups where `npm` is installed in system folders, use `sudo npm link`.

A link to the development folder should appear in the 
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

* commit all changes
* `npm run test` (`fix` included)
* update `CHANGELOG.md`; commit with a message like _CHANGELOG: prepare v0.1.2_
* `npm version patch`
* push all changes to GitHub; this should trigger CI
* wait for CI tests to complete
* `npm publish` (use `--access public` when published for the first time)

## License

The original content is released under the 
[MIT License](https://opensource.org/licenses/MIT), with all rights 
reserved to [Liviu Ionescu](https://github.com/ilg-ul).
