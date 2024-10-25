# Class: Logger

The **Logger** class implements the logger functionality.

## Remarks

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

## Example

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

> **new Logger**(`params`): [`Logger`](Logger.md)

Create a **Logger** instance.

#### Parameters

• **params** = `{}`

The generic object used to pass parameters to the
constructor.

• **params.level?**: [`LogLevel`](../type-aliases/LogLevel.md)

Log level.

**Remarks**

The name of the log level; if not passed, the logger is created in
a preliminary state, and all log lines will be stored in an internal
buffer, until the log level is set.

• **params.console?**: `Console`

Underlying console.

**Remarks**

The console object used to log the message;
by default, the JavaScript standard `console` object is used.

#### Returns

[`Logger`](Logger.md)

#### Remarks

The typical use case is to create a logger with a given log level,
usually `info`.

#### Examples

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

#### Defined in

[logger.ts:243](https://github.com/xpack/logger-ts/blob/62f0bf298555a020ff5b41904da48c7de7b9f72e/src/lib/logger.ts#L243)

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

[logger.ts:374](https://github.com/xpack/logger-ts/blob/62f0bf298555a020ff5b41904da48c7de7b9f72e/src/lib/logger.ts#L374)

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

[logger.ts:388](https://github.com/xpack/logger-ts/blob/62f0bf298555a020ff5b41904da48c7de7b9f72e/src/lib/logger.ts#L388)

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

[logger.ts:402](https://github.com/xpack/logger-ts/blob/62f0bf298555a020ff5b41904da48c7de7b9f72e/src/lib/logger.ts#L402)

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

[logger.ts:416](https://github.com/xpack/logger-ts/blob/62f0bf298555a020ff5b41904da48c7de7b9f72e/src/lib/logger.ts#L416)

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

[logger.ts:430](https://github.com/xpack/logger-ts/blob/62f0bf298555a020ff5b41904da48c7de7b9f72e/src/lib/logger.ts#L430)

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

[logger.ts:444](https://github.com/xpack/logger-ts/blob/62f0bf298555a020ff5b41904da48c7de7b9f72e/src/lib/logger.ts#L444)

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

[logger.ts:458](https://github.com/xpack/logger-ts/blob/62f0bf298555a020ff5b41904da48c7de7b9f72e/src/lib/logger.ts#L458)

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

[logger.ts:472](https://github.com/xpack/logger-ts/blob/62f0bf298555a020ff5b41904da48c7de7b9f72e/src/lib/logger.ts#L472)

## Log Level Management

### hasLevel

> `get` **hasLevel**(): `boolean`

Accessor to check if the log level was initialised.

#### Remarks

If the logger was created without an explicit log level, the
logger is in a preliminary state and all log lines will be stored
in an internal buffer until the log level is set.

#### Example

```console
if (!log.hasLevel) {
  log.level = defaultLevel
}
```

- changed to an accessor in v5.0.0
- added as a method in v2.1.0

#### Returns

`boolean`

True if the level was set.

#### Defined in

[logger.ts:302](https://github.com/xpack/logger-ts/blob/62f0bf298555a020ff5b41904da48c7de7b9f72e/src/lib/logger.ts#L302)

***

### level

> `get` **level**(): `undefined` \| [`LogLevel`](../type-aliases/LogLevel.md)

Accessor to get the log level.

#### Remarks

Get the current log level, as a string.

#### Example

```javascript
console.log(log.level)
```

> `set` **level**(`level`): `void`

Accessor to set the log level.

#### Remarks

Set the log level. If this is the first time when the log level is set,
flush the internal buffer.

#### Example

```javascript
log.level = 'info'
```
If the log level is not one of the known strings, an assert will fire.

#### Parameters

• **level**: `undefined` \| [`LogLevel`](../type-aliases/LogLevel.md)

The new log level.

#### Returns

`undefined` \| [`LogLevel`](../type-aliases/LogLevel.md)

The log level name.

#### Defined in

[logger.ts:360](https://github.com/xpack/logger-ts/blob/62f0bf298555a020ff5b41904da48c7de7b9f72e/src/lib/logger.ts#L360)

## Other

### console

> `get` **console**(): `Console`

Accessor to get the underlying `console` object.

#### Remarks

Direct access to the console object is useful in tests, when
the console is a mock object, which allows to check the logged
messages.

#### Returns

`Console`

The console object used by the logger.

#### Defined in

[logger.ts:488](https://github.com/xpack/logger-ts/blob/62f0bf298555a020ff5b41904da48c7de7b9f72e/src/lib/logger.ts#L488)

***

### isLevel()

> **isLevel**(`level`): `boolean`

Check if the log level is set to a given level name.

#### Parameters

• **level**: [`LogLevel`](../type-aliases/LogLevel.md)

The name of the log level.

#### Returns

`boolean`

True if the current log level is equal to the given
  level or higher.

#### Remarks

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

- added in v6.0.0

#### Defined in

[logger.ts:518](https://github.com/xpack/logger-ts/blob/62f0bf298555a020ff5b41904da48c7de7b9f72e/src/lib/logger.ts#L518)

***

### \_console

> `protected` `readonly` **\_console**: `Console` = `console`

The console object used to output the log messages.

#### Defined in

[logger.ts:186](https://github.com/xpack/logger-ts/blob/62f0bf298555a020ff5b41904da48c7de7b9f72e/src/lib/logger.ts#L186)

***

### levelNumericValue

> `protected` **levelNumericValue**: `number` = `Logger.numericLevelUndefined`

The numerical value of the log level.

#### Defined in

[logger.ts:188](https://github.com/xpack/logger-ts/blob/62f0bf298555a020ff5b41904da48c7de7b9f72e/src/lib/logger.ts#L188)

***

### levelName

> `protected` **levelName**: `undefined` \| [`LogLevel`](../type-aliases/LogLevel.md) = `undefined`

The name of the log level.

#### Defined in

[logger.ts:190](https://github.com/xpack/logger-ts/blob/62f0bf298555a020ff5b41904da48c7de7b9f72e/src/lib/logger.ts#L190)

***

### buffer

> `protected` **buffer**: [`LoggerBufferRecord`](../interfaces/LoggerBufferRecord.md)[] = `[]`

Empty buffer where preliminary log lines are stored
until the log level is set.

#### Defined in

[logger.ts:194](https://github.com/xpack/logger-ts/blob/62f0bf298555a020ff5b41904da48c7de7b9f72e/src/lib/logger.ts#L194)

***

### write()

> `protected` **write**(`numericLevel`, `loggerFunction`, `message`): `void`

The internal log writer.

#### Parameters

• **numericLevel**: `number`

The log numeric level.

• **loggerFunction**: [`LoggerFunction`](../type-aliases/LoggerFunction.md)

The function to be used to write
the message.

• **message**: `undefined` \| `string`

The log message.

#### Returns

`void`

#### Remarks

If the log level was defined, call the function, otherwise
store the log line details in the array buffer, for later
processing, when the log level is defined.

#### Defined in

[logger.ts:539](https://github.com/xpack/logger-ts/blob/62f0bf298555a020ff5b41904da48c7de7b9f72e/src/lib/logger.ts#L539)

***

### defaultLevel

> `static` **defaultLevel**: [`LogLevel`](../type-aliases/LogLevel.md) = `'info'`

The recommended default level.

#### Defined in

[logger.ts:160](https://github.com/xpack/logger-ts/blob/62f0bf298555a020ff5b41904da48c7de7b9f72e/src/lib/logger.ts#L160)

***

### numericLevels

> `static` **numericLevels**: `object`

Internal numerical values for the log level.

#### silent

> **silent**: `number` = `0`

#### error

> **error**: `number` = `10`

#### warn

> **warn**: `number` = `20`

#### info

> **info**: `number` = `30`

#### verbose

> **verbose**: `number` = `40`

#### debug

> **debug**: `number` = `50`

#### trace

> **trace**: `number` = `60`

#### all

> **all**: `number` = `70`

#### Defined in

[logger.ts:165](https://github.com/xpack/logger-ts/blob/62f0bf298555a020ff5b41904da48c7de7b9f72e/src/lib/logger.ts#L165)

***

### numericLevelUndefined

> `static` **numericLevelUndefined**: `number` = `Infinity`

The value used for the undefined log level (maximum value).

#### Defined in

[logger.ts:177](https://github.com/xpack/logger-ts/blob/62f0bf298555a020ff5b41904da48c7de7b9f72e/src/lib/logger.ts#L177)

***

### numericLevelAlways

> `static` **numericLevelAlways**: `number` = `-1`

The value used for the `always` case (minimum value).

#### Defined in

[logger.ts:180](https://github.com/xpack/logger-ts/blob/62f0bf298555a020ff5b41904da48c7de7b9f72e/src/lib/logger.ts#L180)

## Output

### always()

> **always**(`message`, ...`args`): `void`

Log a message.

#### Parameters

• **message**: `any` = `''`

Message to log, as accepted by `util.format()`.

• ...**args**: `any`[]

Optional variable arguments.

#### Returns

`void`

#### Remarks

Log the message always, regardless of the log level, (even `'silent'`,
when no other messages are logged).

The message is passed via `console.log()`.

#### Example

```javascript
log.always(version)
```

#### Defined in

[logger.ts:583](https://github.com/xpack/logger-ts/blob/62f0bf298555a020ff5b41904da48c7de7b9f72e/src/lib/logger.ts#L583)

***

### error()

> **error**(`message`, ...`args`): `void`

Log an error message.

#### Parameters

• **message**: `any` = `''`

Message to log, as accepted by `util.format()`.

• ...**args**: `any`[]

Optional variable arguments.

#### Returns

`void`

#### Remarks

Log a message if the log level is `error` or higher.

The message is prefixed with `error: ` and
passed via `console.error()`.

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

[logger.ts:621](https://github.com/xpack/logger-ts/blob/62f0bf298555a020ff5b41904da48c7de7b9f72e/src/lib/logger.ts#L621)

***

### output()

> **output**(`message`, ...`args`): `void`

Log an error message.

#### Parameters

• **message**: `any` = `''`

Message to log, as accepted by `util.format()`.

• ...**args**: `any`[]

Optional variable arguments.

#### Returns

`void`

#### Remarks

Log a message if the log level is `error` or higher.

It differs from `error()` by **not** prefixing the string with `error: `
and using `console.log()` instead of `console.error()`.

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

[logger.ts:663](https://github.com/xpack/logger-ts/blob/62f0bf298555a020ff5b41904da48c7de7b9f72e/src/lib/logger.ts#L663)

***

### warn()

> **warn**(`message`, ...`args`): `void`

Log a warning message.

#### Parameters

• **message**: `any` = `''`

Message to log, as accepted by `util.format()`.

• ...**args**: `any`[]

Optional variable arguments.

#### Returns

`void`

#### Remarks

Log a message if the log level is `warn` or higher.

The message is prefixed with `warning: ` and
passed via `console.error()`.

#### Example

```javascript
log.info(title)
```

#### Defined in

[logger.ts:689](https://github.com/xpack/logger-ts/blob/62f0bf298555a020ff5b41904da48c7de7b9f72e/src/lib/logger.ts#L689)

***

### info()

> **info**(`message`, ...`args`): `void`

Log an informative message.

#### Parameters

• **message**: `any` = `''`

Message to log, as accepted by `util.format()`.

• ...**args**: `any`[]

Optional variable arguments.

#### Returns

`void`

#### Remarks

Log a message if the log level is `info` or higher.

The message is passed via `console.log()`.

#### Example

```javascript
log.info(title)
```

#### Defined in

[logger.ts:715](https://github.com/xpack/logger-ts/blob/62f0bf298555a020ff5b41904da48c7de7b9f72e/src/lib/logger.ts#L715)

***

### verbose()

> **verbose**(`message`, ...`args`): `void`

Log a verbose message.

#### Parameters

• **message**: `any` = `''`

Message to log, as accepted by `util.format()`.

• ...**args**: `any`[]

Optional variable arguments.

#### Returns

`void`

#### Remarks

Log a message if the log level is `verbose` or higher.

The message is passed via `console.log()`.

#### Example

```javascript
log.verbose('Configurations:')
```

#### Defined in

[logger.ts:740](https://github.com/xpack/logger-ts/blob/62f0bf298555a020ff5b41904da48c7de7b9f72e/src/lib/logger.ts#L740)

***

### debug()

> **debug**(`message`, ...`args`): `void`

Log a debug message.

#### Parameters

• **message**: `any` = `''`

Message to log, as accepted by `util.format()`.

• ...**args**: `any`[]

Optional variable arguments.

#### Returns

`void`

#### Remarks

Log a message if the log level is `'debug'` or higher.

The message is prefixed with `debug: ` and
passed via `console.log()`.

#### Example

```javascript
log.debug(`spawn: ${cmd}`)
```

#### Defined in

[logger.ts:766](https://github.com/xpack/logger-ts/blob/62f0bf298555a020ff5b41904da48c7de7b9f72e/src/lib/logger.ts#L766)

***

### trace()

> **trace**(`message`, ...`args`): `void`

Log a trace message.

#### Parameters

• **message**: `any` = `''`

Message to log, as accepted by `util.format()`.

• ...**args**: `any`[]

Optional variable arguments.

#### Returns

`void`

#### Remarks

Log a message if the log level is `trace` or higher.

The message is prefixed with `trace: ` and
passed via `console.log()`.

#### Example

```javascript
log.trace(`${this.constructor.name}.doRun()`)
```

#### Defined in

[logger.ts:793](https://github.com/xpack/logger-ts/blob/62f0bf298555a020ff5b41904da48c7de7b9f72e/src/lib/logger.ts#L793)
