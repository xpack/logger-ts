[![GitHub package.json version](https://img.shields.io/github/package-json/v/xpack/logger-ts)](https://github.com/xpack/logger-ts/blob/mater/package.json)
[![npm (scoped)](https://img.shields.io/npm/v/@xpack/logger.svg)](https://www.npmjs.com/package/@xpack/logger)
[![license](https://img.shields.io/github/license/xpack/logger-ts.svg)](https://github.com/xpack/logger-ts/blob/xpack/LICENSE)

# A Node.js CommonJS/ES6 module with a generic console logger class

This project provides a **TypeScript** Node.js **CommonJS**/**ES6** module
with a re-entrant console logger suitable for REPL/server/multi-instance
use cases.

Note: Compatibility with legacy CommonJS is required until VS Code extensions
will be updated to import ES6 modules.

The open source project is hosted on GitHub as
[xpack/logger-ts](https://github.com/xpack/logger-ts).

## Maintainer & developer info

This page documents how to use this module in an user application.
For maintainer information, see the separate
[README-MAINTAINER](https://github.com/xpack/logger-ts/blob/master/README-MAINTAINER.md)
page.

## Prerequisites

A recent [Node.js](https://nodejs.org) (>=16.0.0), since the TypeScript code
is compiled into ECMAScript 2020 code, and the tests use ES6 modules.

## Install

The module is available as
[`@xpack/logger`](https://www.npmjs.com/package/@xpack/logger/)
from the public [`npmjs`](https://www.npmjs.com) repository;
it can be added as a dependency to any TypeScript or JavaScript
project with `npm install`:

```console
npm install --save @xpack/logger@latest
```

The module does not provide any executables, and generally there are no
reasons to install it globally.

## User info

This section is intended for those who plan to use this module in their
own projects.

The `@xpack/logger` module can be imported into both TypeScript
and JavaScript Node.js code

In TypeScript and ECMAScript modules, use `import`:

```typescript
import { Logger } from '@xpack/logger'
```

In JavaScript with CommonJS, use `require()`:

```javascript
const { Logger } = request('@xpack/logger')
```

The module can be included in any application and the class can be used
directly or a custom class can be derived from it for a custom behaviour.

The typical use case is to create an instance of the `Logger` object,
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

```javascript
const log = new Logger()
log.trace('...') // Not shown immediately
log.level = 'trace' // Set level and show the buffered messages.

log.info('hello') // Displayed on stdout.
log.debug('world') // Ignored.
```

### Output methods

The following methods are available to log messages:

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

For more details on the available class definitions, including all methods,
accessors, properties, etc,
please see the TypeDoc
[reference pages](https://xpack.github.io/logger-ts).

## Known problems

- none

## Status

The `@xpack/logger` module is fully functional and stable.

The main client for this module is the `xpm` CLI application.

## Tests

The module is tested
with 100% coverage and CI tested on every push via GitHub
[Actions](https://github.com/xpack/logger-ts/actions).

## Compatibility notices

According to [semver](https://semver.org) rules:

> Major version X (X.y.z | X > 0) MUST be incremented if any
backwards incompatible changes are introduced to the public API.

### v6.0.0

The project was migrated to TypeScript and the code is compiled into
**CommonJS** modules, with an **ES6** wrapper, and can be consumed by both
TypeScript and JavaScript packages.

There were also some minor internal renames, but this should not be
a problem.

The function `isLevel(level)` was added.

### v5.0.0

For consistency reasons, `hasLevel` was changed from a method to an
accessor.

Internally, the log level starts as `undefined` instead of the
string `'undefined'`, as in previous versions.

This should not be a problem, given that the method to check if
the level was set is via `hasLevel()`.

### v4.0.0

The code was migrated to TypeScript.

The migration itself should not introduce any incompatibilities,
actually it should be fairly compatible with the latest v3.x,
but, for just in case, the safer path was to consider it a major
release.

### v3.0.0

All `isXyx` functions (returning a boolean related to
the log level) were changed to accessors.

### v2.0.0

The logger constructor was changed to use a generic
parameters object.

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

## License

The original content is released under the
[MIT License](https://opensource.org/license/mit/),
with all rights reserved to
[Liviu Ionescu](https://github.com/ilg-ul).
