# Class: Logger

The **Logger** class implements the logger functionality.

The logger is constructed on top of a console object, where the
messages are logged.

Use `log.always()` instead of the `console.log()`, since it accounts for
different contexts, created for example when using REPL.

There is no `critical` level, corresponding to errors that prevent
the program to run, since these are actually related to bugs;
use `assert()` instead.

The messages may include formatting directives, with additional
arguments, as defined by the Node.js console (not really necessary
with ES6).

All output functions accept an optional string message and possibly
some arguments,
as processed by the standard Node.js
[`util.format(msg, ...args)`](https://nodejs.org/dist/latest-v10.x/docs/api/util.html#util_util_format_format_args)
function.

If the logging code is more complex than a single line,
for example if it needs a long loop,
it is recommended to explicitly check the log level and,
if not high enough, skip the code entirely.

```javascript
  if (log.isVerbose) {
    for (const [folderName, folder] of Object.entries(folders)) {
      log.trace(`'${folderName}' ${folder.toolchainOptions}`)
    }
  }
```

There are cases when the logger must be created very early in the
life cycle of an application, even before it is practically possible
to determine the log level.

For these cases, if the logger is created without a log level,
it is set to a **preliminary state**, and all log lines are
stored in an **internal buffer**, until the log
level is set, when the buffer is walked and the lines are processed.

## Constructors

### new Logger()

> **new Logger**(`params`: \{`level`: [`LogLevel`](../type-aliases/LogLevel.md);`console`: `Console`; \}): [`Logger`](Logger.md)

Create a **Logger** instance.

The typical use case is to create a logger with a given log level,
usually `info`.

```javascript
const log = new Logger({
  level: 'info'
})
```

By default, the system console is used.

The complete use case is to create the logger instance with both a
`console` and a `level`. This might be particularly useful in tests,
where a mock console can be used to capture log messages.

```javascript
const log = new Logger({
  console: mockConsole,
  level: 'info'
})
```

If present, the `console` must be an object derived from the
node **Console**, possibly with some methods overridden.

The `level` property is optional since it can be set later.
Without it, the constructor will
create the logger in a preliminary state, and all log lines will be stored
in an internal buffer until the log level is set.

```javascript
const log = new Logger()
```

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `params` | `object` | The generic object used to pass parameters to the constructor. |
| `params.level`? | [`LogLevel`](../type-aliases/LogLevel.md) | The name of the log level; if not passed, the logger is created in a preliminary state, and all log lines will be stored in an internal buffer, until the log level is set. Optional. |
| `params.console`? | `Console` | The underlying console object used to log the message. Optional. If not passed, the JavaScript standard `console` object is used. |

#### Returns

[`Logger`](Logger.md)

#### Defined in

[logger.ts:233](https://github.com/xpack/logger-ts/blob/2846243d6dac2448aa7de3003e2e9e9b7885e439/src/lib/logger.ts#L233)

## Log Level Checks

### isSilent

> `get` **isSilent**(): `boolean`

Accessor to check the log level.

#### Remarks

- changed to an accessor in v3.0.0.

#### Returns

`boolean`

True if the log level is `silent` or higher.

#### Defined in

[logger.ts:356](https://github.com/xpack/logger-ts/blob/2846243d6dac2448aa7de3003e2e9e9b7885e439/src/lib/logger.ts#L356)

***

### isError

> `get` **isError**(): `boolean`

Accessor to check the log level.

#### Remarks

- changed to an accessor in v3.0.0.

#### Returns

`boolean`

True if the log level is `error` or higher.

#### Defined in

[logger.ts:370](https://github.com/xpack/logger-ts/blob/2846243d6dac2448aa7de3003e2e9e9b7885e439/src/lib/logger.ts#L370)

***

### isWarn

> `get` **isWarn**(): `boolean`

Accessor to check the log level.

#### Remarks

- changed to an accessor in v3.0.0.

#### Returns

`boolean`

True if the log level is `warn` or higher.

#### Defined in

[logger.ts:384](https://github.com/xpack/logger-ts/blob/2846243d6dac2448aa7de3003e2e9e9b7885e439/src/lib/logger.ts#L384)

***

### isInfo

> `get` **isInfo**(): `boolean`

Accessor to check the log level.

#### Remarks

- changed to an accessor in v3.0.0.

#### Returns

`boolean`

True if the log level is `info` or higher.

#### Defined in

[logger.ts:398](https://github.com/xpack/logger-ts/blob/2846243d6dac2448aa7de3003e2e9e9b7885e439/src/lib/logger.ts#L398)

***

### isVerbose

> `get` **isVerbose**(): `boolean`

Accessor to check the log level.

#### Remarks

- changed to an accessor in v3.0.0.

#### Returns

`boolean`

True if the log level is `verbose` or higher.

#### Defined in

[logger.ts:412](https://github.com/xpack/logger-ts/blob/2846243d6dac2448aa7de3003e2e9e9b7885e439/src/lib/logger.ts#L412)

***

### isDebug

> `get` **isDebug**(): `boolean`

Accessor to check the log level.

#### Remarks

- changed to an accessor in v3.0.0.

#### Returns

`boolean`

True if the log level is `debug` or higher.

#### Defined in

[logger.ts:426](https://github.com/xpack/logger-ts/blob/2846243d6dac2448aa7de3003e2e9e9b7885e439/src/lib/logger.ts#L426)

***

### isTrace

> `get` **isTrace**(): `boolean`

Accessor to check the log level.

#### Remarks

- changed to an accessor in v3.0.0.

#### Returns

`boolean`

True if the log level is `trace` or higher.

#### Defined in

[logger.ts:440](https://github.com/xpack/logger-ts/blob/2846243d6dac2448aa7de3003e2e9e9b7885e439/src/lib/logger.ts#L440)

***

### isAll

> `get` **isAll**(): `boolean`

Accessor to check the log level.

#### Remarks

- changed to an accessor in v3.0.0.

#### Returns

`boolean`

True if the log level is `all`.

#### Defined in

[logger.ts:454](https://github.com/xpack/logger-ts/blob/2846243d6dac2448aa7de3003e2e9e9b7885e439/src/lib/logger.ts#L454)

## Log Level Management

### hasLevel

> `get` **hasLevel**(): `boolean`

Accessor to check if the log level was initialised.

If the logger was created without an explicit log level, the
logger is in a preliminary state and all log lines will be stored
in an internal buffer until the log level is set.

#### Example

```console
if (!log.hasLevel) {
  log.level = defaultLevel
}
```

#### Remarks

- changed to an accessor in v5.0.0
- added as a method in v2.1.0

#### Returns

`boolean`

True if the level was set.

#### Defined in

[logger.ts:287](https://github.com/xpack/logger-ts/blob/2846243d6dac2448aa7de3003e2e9e9b7885e439/src/lib/logger.ts#L287)

***

### level

> `get` **level**(): `undefined` \| [`LogLevel`](../type-aliases/LogLevel.md)

Accessor to get the log level.

#### Example

```javascript
console.log(log.level)
```

> `set` **level**(`level`: `undefined` \| [`LogLevel`](../type-aliases/LogLevel.md)): `void`

Accessor to set the log level.

If the log level is not one of the known strings, an assert will fire.

If this is the first time when the log level is set,
flush the internal buffer.

#### Example

```javascript
log.level = 'info'
```

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `level` | `undefined` \| [`LogLevel`](../type-aliases/LogLevel.md) | A string with the new log level. |

#### Returns

`undefined` \| [`LogLevel`](../type-aliases/LogLevel.md)

A string with the log level name.

#### Defined in

[logger.ts:342](https://github.com/xpack/logger-ts/blob/2846243d6dac2448aa7de3003e2e9e9b7885e439/src/lib/logger.ts#L342)

## Other

### console

> `get` **console**(): `Console`

Accessor to get the underlying `console` object.

Direct access to the console object is useful in tests, when
the console is a mock object, which allows to check the logged
messages.

#### Returns

`Console`

The console object used by the logger.

#### Defined in

[logger.ts:469](https://github.com/xpack/logger-ts/blob/2846243d6dac2448aa7de3003e2e9e9b7885e439/src/lib/logger.ts#L469)

***

### isLevel()

> **isLevel**(`level`: [`LogLevel`](../type-aliases/LogLevel.md)): `boolean`

Check if the log level is set to a given level name.

This is a more generic version of the accessors (like `isDebug`, etc),
to be used when the log level is not know at compile time.

It can also be used to ensure that the log level is not decreased,
for example:

#### Example

```javascript
if (!log.islevel(newLevel)) {
  log.level = newLevel
}
```

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `level` | [`LogLevel`](../type-aliases/LogLevel.md) | The name of the log level. |

#### Returns

`boolean`

True if the current log level is equal to the given
  level or higher.

#### Remarks

- added in v6.0.0

#### Defined in

[logger.ts:500](https://github.com/xpack/logger-ts/blob/2846243d6dac2448aa7de3003e2e9e9b7885e439/src/lib/logger.ts#L500)

***

### \_console

> `protected` `readonly` **\_console**: `Console` = `console`

The console object used to output the log messages.

#### Defined in

[logger.ts:181](https://github.com/xpack/logger-ts/blob/2846243d6dac2448aa7de3003e2e9e9b7885e439/src/lib/logger.ts#L181)

***

### levelNumericValue

> `protected` **levelNumericValue**: `number` = `Logger.numericLevelUndefined`

The numerical value of the log level.

#### Defined in

[logger.ts:183](https://github.com/xpack/logger-ts/blob/2846243d6dac2448aa7de3003e2e9e9b7885e439/src/lib/logger.ts#L183)

***

### levelName

> `protected` **levelName**: `undefined` \| [`LogLevel`](../type-aliases/LogLevel.md) = `undefined`

The name of the log level.

#### Defined in

[logger.ts:185](https://github.com/xpack/logger-ts/blob/2846243d6dac2448aa7de3003e2e9e9b7885e439/src/lib/logger.ts#L185)

***

### buffer

> `protected` **buffer**: `LoggerBufferRecord`[] = `[]`

Empty buffer where preliminary log lines are stored
until the log level is set.

#### Defined in

[logger.ts:189](https://github.com/xpack/logger-ts/blob/2846243d6dac2448aa7de3003e2e9e9b7885e439/src/lib/logger.ts#L189)

***

### write()

> `protected` **write**(`numericLevel`: `number`, `loggerFunction`: `LoggerFunction`, `message`: `undefined` \| `string`): `void`

The internal log writer.

If the log level was defined, call the actual logger function, otherwise
store the log lines in the array buffer, for later
processing, when the log level is finally defined.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `numericLevel` | `number` | The log numeric level. |
| `loggerFunction` | `LoggerFunction` | The function to be used to write the message. |
| `message` | `undefined` \| `string` | The log message. |

#### Returns

`void`

#### Defined in

[logger.ts:520](https://github.com/xpack/logger-ts/blob/2846243d6dac2448aa7de3003e2e9e9b7885e439/src/lib/logger.ts#L520)

***

### defaultLevel

> `static` **defaultLevel**: [`LogLevel`](../type-aliases/LogLevel.md) = `'info'`

The recommended default level.

#### Defined in

[logger.ts:155](https://github.com/xpack/logger-ts/blob/2846243d6dac2448aa7de3003e2e9e9b7885e439/src/lib/logger.ts#L155)

***

### numericLevels

> `static` **numericLevels**: \{`silent`: `0`;`error`: `10`;`warn`: `20`;`info`: `30`;`verbose`: `40`;`debug`: `50`;`trace`: `60`;`all`: `70`; \}

Internal numerical values for the log level.

| Name | Type | Default value | Defined in |
| :------ | :------ | :------ | :------ |
| `silent` | `number` | 0 | [logger.ts:161](https://github.com/xpack/logger-ts/blob/2846243d6dac2448aa7de3003e2e9e9b7885e439/src/lib/logger.ts#L161) |
| `error` | `number` | 10 | [logger.ts:162](https://github.com/xpack/logger-ts/blob/2846243d6dac2448aa7de3003e2e9e9b7885e439/src/lib/logger.ts#L162) |
| `warn` | `number` | 20 | [logger.ts:163](https://github.com/xpack/logger-ts/blob/2846243d6dac2448aa7de3003e2e9e9b7885e439/src/lib/logger.ts#L163) |
| `info` | `number` | 30 | [logger.ts:164](https://github.com/xpack/logger-ts/blob/2846243d6dac2448aa7de3003e2e9e9b7885e439/src/lib/logger.ts#L164) |
| `verbose` | `number` | 40 | [logger.ts:165](https://github.com/xpack/logger-ts/blob/2846243d6dac2448aa7de3003e2e9e9b7885e439/src/lib/logger.ts#L165) |
| `debug` | `number` | 50 | [logger.ts:166](https://github.com/xpack/logger-ts/blob/2846243d6dac2448aa7de3003e2e9e9b7885e439/src/lib/logger.ts#L166) |
| `trace` | `number` | 60 | [logger.ts:167](https://github.com/xpack/logger-ts/blob/2846243d6dac2448aa7de3003e2e9e9b7885e439/src/lib/logger.ts#L167) |
| `all` | `number` | 70 | [logger.ts:168](https://github.com/xpack/logger-ts/blob/2846243d6dac2448aa7de3003e2e9e9b7885e439/src/lib/logger.ts#L168) |

#### Defined in

[logger.ts:160](https://github.com/xpack/logger-ts/blob/2846243d6dac2448aa7de3003e2e9e9b7885e439/src/lib/logger.ts#L160)

***

### numericLevelUndefined

> `static` **numericLevelUndefined**: `number` = `Infinity`

The value used for the undefined log level (maximum value).

#### Defined in

[logger.ts:172](https://github.com/xpack/logger-ts/blob/2846243d6dac2448aa7de3003e2e9e9b7885e439/src/lib/logger.ts#L172)

***

### numericLevelAlways

> `static` **numericLevelAlways**: `number` = `-1`

The value used for the `always` case (minimum value).

#### Defined in

[logger.ts:175](https://github.com/xpack/logger-ts/blob/2846243d6dac2448aa7de3003e2e9e9b7885e439/src/lib/logger.ts#L175)

## Output

### always()

> **always**(`message`: `any`, ...`args`: `any`[]): `void`

Always log a message, regardless of the log level, (even `'silent'`,
when no other messages are logged).

The message is passed via `console.log()`.

#### Example

```javascript
log.always(version)
```

#### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `message` | `any` | `''` | Message to log, as accepted by `util.format()`. |
| ...`args` | `any`[] | `undefined` | Optional variable arguments. |

#### Returns

`void`

#### Defined in

[logger.ts:561](https://github.com/xpack/logger-ts/blob/2846243d6dac2448aa7de3003e2e9e9b7885e439/src/lib/logger.ts#L561)

***

### error()

> **error**(`message`: `any`, ...`args`: `any`[]): `void`

Log an error message, if the log level is `error` or higher.

The message is prefixed with `error: ` and
passed via `console.error()`.

#### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `message` | `any` | `''` | Message to log, as accepted by `util.format()`. |
| ...`args` | `any`[] | `undefined` | Optional variable arguments. |

#### Returns

`void`

#### Examples

```javascript
log.error('Not good...')
```

There is a special case when the input is an `Error` object. It
is expanded, including a full stack trace, and passed via
`console.error()`.

```javascript
try {
  // ...
} catch (err) {
  log.error(err)
}
```

#### Defined in

[logger.ts:596](https://github.com/xpack/logger-ts/blob/2846243d6dac2448aa7de3003e2e9e9b7885e439/src/lib/logger.ts#L596)

***

### output()

> **output**(`message`: `any`, ...`args`: `any`[]): `void`

Log an error message, if the log level is `error` or higher.

It differs from `error()` by **not** prefixing the string with `error: `
and using `console.log()` instead of `console.error()`.

#### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `message` | `any` | `''` | Message to log, as accepted by `util.format()`. |
| ...`args` | `any`[] | `undefined` | Optional variable arguments. |

#### Returns

`void`

#### Examples

```javascript
log.output('Not good either...')
```

```javascript
try {
  // ...
} catch (err) {
  // Do not show the stack trace.
  log.output(err)
}
```

#### Defined in

[logger.ts:635](https://github.com/xpack/logger-ts/blob/2846243d6dac2448aa7de3003e2e9e9b7885e439/src/lib/logger.ts#L635)

***

### warn()

> **warn**(`message`: `any`, ...`args`: `any`[]): `void`

Log a warning message, if the log level is `warn` or higher.

The message is prefixed with `warning: ` and
passed via `console.error()`.

#### Example

```javascript
log.info(title)
```

#### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `message` | `any` | `''` | Message to log, as accepted by `util.format()`. |
| ...`args` | `any`[] | `undefined` | Optional variable arguments. |

#### Returns

`void`

#### Defined in

[logger.ts:658](https://github.com/xpack/logger-ts/blob/2846243d6dac2448aa7de3003e2e9e9b7885e439/src/lib/logger.ts#L658)

***

### info()

> **info**(`message`: `any`, ...`args`: `any`[]): `void`

Log an informative message, if the log level is `info` or higher.

The message is passed via `console.log()`.

#### Example

```javascript
log.info(title)
```

#### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `message` | `any` | `''` | Message to log, as accepted by `util.format()`. |
| ...`args` | `any`[] | `undefined` | Optional variable arguments. |

#### Returns

`void`

#### Defined in

[logger.ts:681](https://github.com/xpack/logger-ts/blob/2846243d6dac2448aa7de3003e2e9e9b7885e439/src/lib/logger.ts#L681)

***

### verbose()

> **verbose**(`message`: `any`, ...`args`: `any`[]): `void`

Log a verbose message, if the log level is `verbose` or higher.

The message is passed via `console.log()`.

#### Example

```javascript
log.verbose('Configurations:')
```

#### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `message` | `any` | `''` | Message to log, as accepted by `util.format()`. |
| ...`args` | `any`[] | `undefined` | Optional variable arguments. |

#### Returns

`void`

#### Defined in

[logger.ts:703](https://github.com/xpack/logger-ts/blob/2846243d6dac2448aa7de3003e2e9e9b7885e439/src/lib/logger.ts#L703)

***

### debug()

> **debug**(`message`: `any`, ...`args`: `any`[]): `void`

Log a debug message, if the log level is `'debug'` or higher.

The message is prefixed with `debug: ` and
passed via `console.log()`.

#### Example

```javascript
log.debug(`spawn: ${cmd}`)
```

#### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `message` | `any` | `''` | Message to log, as accepted by `util.format()`. |
| ...`args` | `any`[] | `undefined` | Optional variable arguments. |

#### Returns

`void`

#### Defined in

[logger.ts:726](https://github.com/xpack/logger-ts/blob/2846243d6dac2448aa7de3003e2e9e9b7885e439/src/lib/logger.ts#L726)

***

### trace()

> **trace**(`message`: `any`, ...`args`: `any`[]): `void`

Log a trace message, if the log level is `trace` or higher.

The message is prefixed with `trace: ` and
passed via `console.log()`.

#### Example

```javascript
log.trace(`${this.constructor.name}.doRun()`)
```

#### Parameters

| Parameter | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `message` | `any` | `''` | Message to log, as accepted by `util.format()`. |
| ...`args` | `any`[] | `undefined` | Optional variable arguments. |

#### Returns

`void`

#### Defined in

[logger.ts:750](https://github.com/xpack/logger-ts/blob/2846243d6dac2448aa7de3003e2e9e9b7885e439/src/lib/logger.ts#L750)
