[![npm (scoped)](https://img.shields.io/npm/v/@xpack/logger.svg)](https://www.npmjs.com/package/@xpack/logger)
[![license](https://img.shields.io/github/license/xpack/logger-js.svg)](https://github.com/xpack/logger-js/blob/xpack/LICENSE)
[![TS-Standard - Typescript Standard Style Guide](https://badgen.net/badge/code%20style/ts-standard/blue?icon=typescript)](https://github.com/standard/ts-standard)
[![Actions Status](https://github.com/xpack/logger-js/workflows/CI%20on%20Push/badge.svg)](https://github.com/xpack/logger-js/actions)
[![GitHub issues](https://img.shields.io/github/issues/xpack/logger-js.svg)](https://github.com/xpack/logger-js/issues/)
[![GitHub pulls](https://img.shields.io/github/issues-pr/xpack/logger-js.svg)](https://github.com/xpack/logger-js/pulls)

## A generic console logger class

A Node.js module with a generic console logger.

## Prerequisites

A recent [Node.js](https://nodejs.org) (>=8.x), since the ECMAScript 6 class
syntax is used.

## Easy install

The module is available as
[`@xpack/logger`](https://www.npmjs.com/package/@xpack/logger)
from the public repository; use `npm` to install it inside the module where
it is needed:

```console
npm install @xpack/logger
```

The module does not provide any executables, and generally there are no
reasons to install it globally.

The development repository is available from the GitHub
[xpack/logger-js](https://github.com/xpack/logger-js)
project.

## Compatibility notices

According to [semver](https://semver.org) requirements,
incompatible API changes require higher major numbers.

### v4.x

The code was migrated to TypeScript.

The migration itself should not introduce any incompatibilities,
actually it should be fairly compatible with the latest v3.x,
but, for just in case, the safer path was to consider it a major
release.

### v3.x

All `isXyx` functions (returning a boolean related to
the log level) were changed to getters.

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
own projects.

The `@xpack/logger` module can be included in Node.js applications as
usual, with `require()`.

```javascript
const Logger = require('@xpack/logger').Logger
```

The typical use case is to create the logger, then log at different
levels:

```javascript
const log = new Logger({
  level: 'info'
})

log.info('hello') // Displayed on stdout.
log.debug('world') // Ignored.
```

In more complex use cases, the log level can be tested and the possibly
long operations be performed only if necessary.

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

### Delaying setting the log level

There are cases when the logger must be created very early in the
life cycle of an application, even before it is practically possible
to determine the log level.

For these cases, if the logger is created without a log level,
it is set to a **preliminary state**, and **all log lines are
stored in an internal buffer**, until the log
level is set, when the buffer is walked and the lines are processed.

### Constructor

#### `Logger(Object params)`

The common use case is to create the logger instance with a `console` and a
string `level` name.

If present, the `console` must be an object with at least two methods,
`log()` and `error()`, as defined in the Node.js documentation for
[console](https://nodejs.org/dist/latest-v10.x/docs/api/console.html).

By default, the system console is used.

Example:

```javascript
const logger = new Logger({
  console: myConsole,
  level: 'info'
})
```

The `level` property is optional. Without it, the constructor will
create the logger in a preliminary state, and all log lines will be stored
in an internal buffer until the log level is set.

Example:

```javascript
const logger = new Logger()
```

### Managing the log levels

The log level is managed by a setter/getter pair.

#### `set level (String level)` (setter)

Set the log level. If this is the first time the log level is set, flush the
internal buffer.

Example:

```javascript
logger.level = 'info'
```

#### `String get level ()` (getter)

Get the current log level, as a string.

Example:

```javascript
console.log(logger.level)
```

#### `Boolean hasLevel ()`

[Added in v2.1.0]

Return `true` if the level was set.

Example:

```console
if (!logger.hasLevel()) {
  logger.level = defaultLevel
}
```

### Logging lines

All functions accept an optional string message and possibly some arguments,
as processed by the standard Node.js
[`util.format(msg, ...args)`](https://nodejs.org/dist/latest-v10.x/docs/api/util.html#util_util_format_format_args)
function.

#### `always (String msg = '', ...args)`

Log always, regardless of the log level, even `'silent'`, when no other
messages are logged. The message is passed via `console.log()`

Example:

```javascript
logger.always(version)
```

#### `error (String msg = '', ...args)`

Log errors, if the log level is `'error'` or higher. The message is prefixed
with `error: ` and passed via `console.error()`.

Example:

```javascript
logger.error('Not good...')
```

#### `error (Error err)`

This is a special case when the input is an `Error` object. It is expanded,
including a full stack trace, and passed via `console.error()`.

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
`console.log()` instead of `console.error()`.

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
with `warning: ` and passed via `console.error()`.

Example:

```javascript
log.warn('Beware...')
```

#### `info (String msg = '', ...args)`

Log informative messages, if the log level is `'info'` or higher.
The message is passed via `console.log()`.

Example:

```javascript
log.info(title)
```

#### `verbose (String msg = '', ...args)`

Log more informative messages, if the log level is `'verbose'` or higher.
The message is passed via `console.log()`.

Example:

```javascript
log.verbose('Configurations:')
```

#### `debug (String msg = '', ...args)`

Log debug messages, if the log level is `'debug'` or higher.
The message is passed via `console.log()`.

Example:

```javascript
log.debug(`spawn: ${cmd}`)
```

#### `trace (String msg = '', ...args)`

Log debug messages, if the log level is `'trace'` or higher.
The message is passed via `console.log()`.

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
  if (log.isVerbose) {
    for (const [folderName, folder] of Object.entries(folders)) {
      log.trace(`'${folderName}' ${folder.toolchainOptions}`)
    }
  }
```

[Changed to getters in v3.0.0]

#### `Boolean isSilent` (getter)

Return `true` if the log level is `'silent'` or higher.

#### `Boolean isError` (getter)

Return `true` if the log level is `'error'` or higher.

#### `Boolean isWarn` (getter)

Return `true` if the log level is `'warn'` or higher.

#### `Boolean isInfo` (getter)

Return `true` if the log level is `'info'` or higher.

#### `Boolean isVerbose` (getter)

Return `true` if the log level is `'verbose'` or higher.

#### `Boolean isDebug` (getter)

Return `true` if the log level is `'debug'` or higher.

#### `Boolean isTrace` (getter)

Return `true` if the log level is `'trace'` or higher.

#### `Boolean isAll` (getter)

Return `true` if the log level is `'all'`.

#### `Logger.defaultLevel`

A static definition with the default logger level (`info`).

## Maintainer info

This page documents how to use this module in an user application.
For developer and maintainer information, see the separate
[README-DEVELOPER](https://github.com/xpack/logger-ts/blob/master/README-DEVELOPER.md) and
[README-MAINTAINER](https://github.com/xpack/logger-ts/blob/master/README-MAINTAINER.md)
pages.

## License

The original content is released under the
[MIT License](https://opensource.org/licenses/MIT), with all rights
reserved to [Liviu Ionescu](https://github.com/ilg-ul/).
