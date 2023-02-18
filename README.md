[![npm (scoped)](https://img.shields.io/npm/v/@xpack/logger.svg)](https://www.npmjs.com/package/@xpack/logger)
[![license](https://img.shields.io/github/license/xpack/logger-ts.svg)](https://github.com/xpack/logger-ts/blob/xpack/LICENSE)
[![TS-Standard - Typescript Standard Style Guide](https://badgen.net/badge/code%20style/ts-standard/blue?icon=typescript)](https://github.com/standard/ts-standard)
[![Actions Status](https://github.com/xpack/logger-ts/workflows/CI%20on%20Push/badge.svg)](https://github.com/xpack/logger-ts/actions)
[![GitHub issues](https://img.shields.io/github/issues/xpack/logger-ts.svg)](https://github.com/xpack/logger-ts/issues/)
[![GitHub pulls](https://img.shields.io/github/issues-pr/xpack/logger-ts.svg)](https://github.com/xpack/logger-ts/pulls)

## A generic console logger class

A Node.js ES6 module with a generic console logger.

## Prerequisites

A recent [Node.js](https://nodejs.org) (>=14.13), since the TypeScript code
is compiled into ECMAScript 2020 code.

## Easy install

The module is available as
[`@xpack/logger`](https://www.npmjs.com/package/@xpack/logger)
from the public [`npmjs`](https://www.npmjs.com) repository;
use `npm` to install it inside the project where
it is needed:

```console
npm install @xpack/logger@latest
```

The module does not provide any executables, and generally there are no
reasons to install it globally.

The development repository is available from the GitHub
[xpack/logger-ts](https://github.com/xpack/logger-ts/)
project.

## User info

This section is intended for those who want to use this module in their
own projects.

The `@xpack/logger` module can be imported in both TypeScript
and JavaScript Node.js code:

```typescript
import { Logger } from '@xpack/logger'
```

The typical use case is to create an instance of the Logger object,
then log messages at different levels:

```javascript
const log = new Logger({
  level: 'info'
})

log.info('hello') // Displayed on stdout.
log.debug('world') // Ignored.
```

In more complex use cases, the log level can be tested and the (possibly)
long operations be performed only if necessary.

### Log levels

The following strings are recognised as valid level names:

```typescript
export type LogLevel =
  'silent' | 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'trace' | 'all'
```

Internally the string levels are converted to integer values,
and these integers are used in comparisons. Higher values
mean more verbosity.

### Delaying setting the log level

There are cases when the logger must be created very early in the
life cycle of an application, even before it is practically possible
to determine the log level.

For these cases, if the logger is created without a log level,
it is set to a **preliminary state**, and all log lines are
stored in an internal buffer**, until the log
level is set, when the buffer is walked and the lines are processed.

### Output methods

- `always (message: any = '', ...args: any[]): void`
- `error (message: any = '', ...args: any[]): void`
- `error (message: Error): void`
- `output (message: any = '', ...args: any[]): void`
- `warn (message: any = '', ...args: any[]): void`
- `info (message: any = '', ...args: any[]): void`
- `verbose (message: any = '', ...args: any[]): void`
- `debug (message: any = '', ...args: any[]): void`
- `trace (message: any = '', ...args: any[]): void`

### Reference

For more details on the class definition, including all methods,
accessors, members, etc,
please see the typedoc
[reference pages](https://xpack.github.io/logger-ts/stable/).

## Compatibility notices

According to [semver](https://semver.org) requirements,
incompatible API changes require higher major numbers.

### v6.x

The package was fully migrated to ES6 modules, and can no longer be
consumed by legacy CommonJS package.

There were also some minor internal renames, but this should not be
a problem.

### v5.x

For consistency reasons, `hasLevel` was changed from a method to a getter.

Internally, the log level starts as `undefined` instead of the
string `'undefined'`, as in previous versions.

This should not be a problem, given that the method to check if
the level was set is via `hasLevel()`.

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
const log = new Logger(console, 'info')
```

to:

```javascript
const log = new Logger({
  console,
  level: 'info'
})
```

## Maintainer & developer info

This page documents how to use this module in an user application.
For developer and maintainer information, see the separate
[README-DEVELOPER](https://github.com/xpack/logger-ts/blob/master/README-DEVELOPER.md) and
[README-MAINTAINER](https://github.com/xpack/logger-ts/blob/master/README-MAINTAINER.md)
pages.

## License

The original content is released under the
[MIT License](https://opensource.org/licenses/MIT), with all rights
reserved to [Liviu Ionescu](https://github.com/ilg-ul/).
