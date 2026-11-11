/*
 * This file is part of the xPack project (http://xpack.github.io).
 * Copyright (c) 2017-2026 Liviu Ionescu. All rights reserved.
 *
 * Permission to use, copy, modify, and/or distribute this software
 * for any purpose is hereby granted, under the terms of the MIT license.
 *
 * If a copy of the license was not distributed with this file, it can
 * be obtained from https://opensource.org/license/mit/.
 */

/* eslint max-len: [ "error", 80, { "ignoreUrls": true } ] */

// ----------------------------------------------------------------------------

/*
 * This file implements a generic console logger.
 *
 * Use `log.always()` instead of the `console.log()`, since it accounts for
 * different contexts, created, for example, when using REPL.
 *
 * The messages may include formatting directives, with additional
 * arguments, as defined by the Node.js console (template literals are
 * often simpler).
 *
 * There is no `critical` level, corresponding to errors that prevent
 * the program to run, since these are actually related to bugs;
 * use `assert()` instead.
 *
 * Delayed log level use cases
 * ---------------------------
 *
 * There are cases when the logger must be created very early in the
 * life cycle of an application, even before it is practically possible
 * to determine the log level.
 *
 * For these cases, if the logger is created without a log level,
 * the logger is set to a preliminary state, and all log lines are
 * stored in an internal buffer, until the moment when the log
 * level is set, when the buffer is walked and the lines are processed.
 */

// ----------------------------------------------------------------------------

import { strict as assert } from 'node:assert'
import type { Console } from 'node:console'
import * as util from 'node:util'

// ----------------------------------------------------------------------------
// Public Types.

/**
 * Type of the strings recognised as valid level names.
 *
 * Internally these strings are converted into numeric values (see
 * `Logger.numericLevels`), and these numbers are used in comparisons.
 *
 * Higher values mean more verbosity.
 */
export type LogLevel =
  'silent' | 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'trace' | 'all'

/**
 * Type of the console objects accepted by the logger.
 *
 * The logger uses only the `log()` function, for the standard output, and
 * the `error()` function, for the standard error, so any object that has
 * them can be used, not only a Node.js `Console`: a mock console, a custom
 * object, or a minimal `{ log, error }` object.
 *
 * The functions are called as methods of the object, so they may use
 * `this`.
 */
export type LoggerConsole = Pick<Console, 'log' | 'error'>

// ----------------------------------------------------------------------------
// Internal definitions.

/**
 * @internal
 *
 * Type of the numeric log level.
 *
 * The numeric log level is stored internally and is used in log level
 * comparisons.
 */
export type NumericLogLevel = number

/**
 * @internal
 *
 * Type of a generic logger function processing a string message.
 */
export type LoggerFunction = (message: string) => void

/**
 * @internal
 *
 * Type of a record stored in the internal buffer.
 *
 * If the logger was constructed without a log level, all initial
 * messages are stored in a buffer, and processed at a later time,
 * when the log level is set.
 *
 * Each record in the buffer stores the message, the log level and
 * a function to process the message.
 */
export interface LoggerBufferRecord {
  /** The string message to be logged. */
  message: string
  /** The numeric log level at the time of the call. */
  numericLevel: NumericLogLevel
  /** The function to be called to log the message. */
  func: LoggerFunction
}

// ============================================================================

/**
 * The **Logger** class implements the logger functionality.
 *
 * The logger is constructed on top of a console object, where the
 * messages are logged. The class has a type parameter, the type of the
 * console, so that the `console` accessor returns the object that was
 * passed, with its own type: a `Logger` without a console is a
 * `Logger<Console>`, and a logger constructed with a `MockConsole` is a
 * `Logger<MockConsole>`, whose `console` accessor gives access to the
 * members of the mock without a cast. The type must have the `log()` and
 * `error()` functions (see `LoggerConsole`).
 *
 * @typeParam C - The type of the console object; the default is the
 *   Node.js `Console`, which is used when no console is passed.
 *
 * Use `log.always()` instead of the `console.log()`, since it accounts for
 * different contexts, created for example when using REPL.
 *
 * There is no `critical` level, corresponding to errors that prevent
 * the program to run, since these are actually related to bugs;
 * use `assert()` instead.
 *
 * The messages may include formatting directives, with additional
 * arguments, as defined by the Node.js console (template literals are
 * often simpler).
 *
 * All output methods accept an optional message, of any type, and
 * possibly some arguments, as processed by the standard Node.js
 * [`util.format(msg, ...args)`](https://nodejs.org/api/util.html#utilformatformat-args)
 * function.
 *
 * **Empty messages.** If the message is omitted or `undefined`, it is
 * replaced by an empty string, so `log.info()` and `log.info(undefined)`
 * write an empty line, and the methods with a prefix write only the
 * prefix (for example `debug: `). This differs from `console.log()`,
 * which writes `undefined`. Other falsy values are written as they are
 * (`null`, `0`, and `false` give `null`, `0`, and `false`), and
 * `undefined` is written as usual when it is not the first argument
 * (`log.info('value:', undefined)` gives `value: undefined`). Since
 * the empty string is still a message, any further arguments are
 * appended to it after a space (`log.info(undefined, 1)` gives ` 1`,
 * with a leading space). To write the text `undefined`, convert it
 * explicitly, for example `log.info(String(value))`.
 *
 * **Output methods.** The methods differ by the level from which they
 * are written (the threshold), by the console stream, and by a prefix
 * added to the message:
 *
 * | Method      | Written from level | Stream | Prefix       |
 * | ----------- | ------------------ | ------ | ------------ |
 * | `always()`  | every level        | stdout | none         |
 * | `error()`   | `error`            | stderr | `error: `    |
 * | `output()`  | `error`            | stdout | none         |
 * | `warn()`    | `warn`             | stderr | `warning: `  |
 * | `info()`    | `info`             | stdout | none         |
 * | `verbose()` | `verbose`          | stdout | none         |
 * | `debug()`   | `debug`            | stdout | `debug: `    |
 * | `trace()`   | `trace`            | stdout | `trace: `    |
 *
 * Here stdout is `console.log()` and stderr is `console.error()`. A
 * method is written when the log level is equal to or higher than its
 * threshold; at `silent` only `always()` is written. The method
 * `error()` omits its prefix when the first argument is an `Error`
 * (see below).
 *
 * The three methods that write on stdout without a prefix are used for
 * different purposes:
 *
 * - `always()` is for the messages that must be shown at every log level,
 *   including `silent`, like the version or the result requested by the
 *   user;
 * - `output()` is for the normal output of the application, which is
 *   suppressed at `silent`, together with all the other messages;
 * - `info()` is for informative messages, shown from the `info` level.
 *
 * **The prefix of an `Error`.** Only `error()` omits its prefix, and only
 * when the first argument is an `Error`: the first line of the expanded
 * error already starts with its name (like `Error: boom` or
 * `TypeError: bad`), which tells the severity. This is deliberate. The
 * other methods keep their prefix (`warning: Error: boom`,
 * `debug: Error: boom`), since without it a warning would look like an
 * error, and a debug message like a failure; and an `Error` that is not
 * the first argument of `error()` keeps the prefix too
 * (`error: failed: Error: boom`). It is the same for all the methods,
 * whether the message is written at once or buffered.
 *
 * **Logging errors.** `Error` objects (and objects derived from it) are
 * expanded by `util.format()`, as by `console.log()`: the first line has
 * the name and the message (for example `Error: boom`), and it is
 * followed by the stack trace and, if present, the `cause` chain, on
 * several lines. This is the same in all output methods, which differ
 * only by the stream and the prefix. The caller decides how much of an
 * error is shown:
 *
 * - to show the full details, including the stack trace, pass the error
 *   object, for example `log.error(err)`;
 * - to show a single line, pass only its message, for example
 *   `log.error(err.message)`, which outputs `error: boom`.
 *
 * A common pattern, which also works in the preliminary state, is to show
 * the message at the `error` level, and the full details only when the
 * log level is `debug` or higher:
 *
 * ```javascript
 * try {
 *   // ...
 * } catch (err) {
 *   // On stderr: `error: boom`.
 *   log.error(err instanceof Error ? err.message : String(err))
 *   // On stdout, only at `debug` or higher: `debug: Error: boom`,
 *   // followed by the stack trace.
 *   log.debug(err)
 * }
 * ```
 *
 * In TypeScript, the variable of a `catch` clause has the type `unknown`,
 * hence the `instanceof` check. To also keep the name of the error, use
 * `String(err)` instead of `err.message`: `log.error(String(err))`
 * outputs, for example, `error: TypeError: boom`.
 *
 * **Untrusted input.** The messages are written as they are, without
 * any escaping, so text that comes from outside the application (like
 * a file name, a user name, or the content of a network request) can
 * forge log lines, send control sequences to the terminal, and be
 * interpreted as format directives:
 *
 * - a newline in the text starts a new line in the output, and a prefix
 *   is added only to the first line, so the text `'bob\nerror: forged'`
 *   in a `warn()` call writes the line `warning: bob`, followed by a
 *   line that looks like a genuine `error: forged` message;
 * - control characters, like the ANSI escape sequences, are passed to
 *   the terminal unchanged;
 * - if the first argument contains directives (like `%s`, `%d`, or `%j`)
 *   and there are further arguments, the directives consume them, so
 *   `log.info(text, secret)` may write the secret; a single argument is
 *   not processed (`log.info('100%d')` writes `100%d`), but
 *   `log.info('100%d', 5)` writes `1005`.
 *
 * Therefore pass the untrusted text as an argument, never as the first
 * argument, with a constant format string:
 *
 * ```javascript
 * log.info('user: %s', name)
 * ```
 *
 * This prevents the interpretation of the directives, but `%s` writes a
 * string as it is, including the newlines and the control characters. To
 * also escape them, use `%j` (JSON) or `%O` (as `util.inspect()`), which
 * write the string between quotes, with a newline as `\n` and the
 * escape character as `\u001b` or `\x1B`:
 *
 * ```javascript
 * log.info('user: %j', name)
 * ```
 *
 * Note that `%j` calls the `toJSON()` method of an object, and that
 * `%j` and `%O` quote the strings.
 *
 * If the logging code is more complex than a single line,
 * for example if it needs a long loop,
 * it is recommended to explicitly check the log level and,
 * if not high enough, skip the code entirely.
 *
 * ```javascript
 *   if (log.isTrace) {
 *     for (const [folderName, folder] of Object.entries(folders)) {
 *       log.trace(`'${folderName}' ${folder.toolchainOptions}`)
 *     }
 *   }
 * ```
 *
 * There are cases when the logger must be created very early in the
 * life cycle of an application, even before it is practically possible
 * to determine the log level.
 *
 * For these cases, if the logger is created without a log level,
 * it is set to a **preliminary state**, and all log lines are
 * stored in an **internal buffer**, until the log
 * level is set, when the buffer is walked and the lines are processed.
 *
 * Nothing is written while the logger is in the preliminary state, not
 * even the messages of `always()` and `error()`. If the log level is never
 * set (for example when the application fails before it determines the
 * level), the buffered messages are never written and are lost. Set the
 * log level on every path, for example in a `catch` or `finally` block,
 * using `hasLevel` to check whether it was set:
 *
 * ```javascript
 * try {
 *   // Determine the log level, then set it.
 *   log.level = parseLevel(process.argv)
 * } catch (err) {
 *   if (!log.hasLevel) {
 *     log.level = Logger.recommendedLevel
 *   }
 *   log.error(err)
 * }
 * ```
 *
 * **Cost of the preliminary state.** With the level set, a message that
 * is below the level is skipped before it is formatted, which costs a
 * few nanoseconds. In the preliminary state the final level is not known,
 * so every message, including `debug()` and `trace()`, is formatted
 * immediately and stored in the buffer, until the level is set:
 *
 * - the formatting is done even for the messages that are later
 *   discarded; for example, an object passed to a `%o` directive is
 *   inspected at each call (about 3 microseconds, against 0.2
 *   microseconds for a short string message);
 * - the buffer is not limited, and a message of about 70 characters
 *   takes about 250 bytes, so a long running application that logs a lot
 *   before the level is set should set it as early as possible;
 * - since the message is formatted when it is logged, a later change of
 *   an argument does not alter the buffered message.
 *
 * The check of the level before an expensive preparation of the message
 * (see above) is true in the preliminary state, so the preparation is
 * done there too.
 */
export class Logger<C extends LoggerConsole = Console> {
  // --------------------------------------------------------------------------
  // Static Properties.

  /**
   * The recommended log level, `info`, for the applications that need a
   * level when none was chosen.
   *
   * The library never applies it: a logger created without a level stays
   * in the preliminary state, until the level is set, so the application
   * must use this value explicitly, for example
   * `log.level = Logger.recommendedLevel`.
   *
   * It is read-only: the compiler rejects an assignment, and at run time
   * the class is frozen, so an assignment throws a `TypeError`.
   *
   * @remarks
   * - added in v7.0.0, as the new name of `defaultLevel`
   *
   * @category Constants
   */
  static readonly recommendedLevel: LogLevel = 'info'

  /**
   * The previous name of `recommendedLevel`, with the same value.
   *
   * The name suggested that a logger created without a level gets this
   * level, which the library never did.
   *
   * @remarks
   * - deprecated in v7.0.0, to be removed in the next major version
   *
   * @deprecated Use `Logger.recommendedLevel`; it will be removed in the
   *   next major version.
   *
   * @category Constants
   */
  static readonly defaultLevel: LogLevel = Logger.recommendedLevel

  // Not an enum, to be able to define it inside the class,
  // not at global level.
  /**
   * Internal numerical values for the log level.
   *
   * The keys are exactly the level names of `LogLevel`; the compiler
   * reports an error if a name is missing or if there is an extra one.
   *
   * The object is frozen and its properties are read-only, so no code can
   * change the thresholds of the levels: the compiler rejects an
   * assignment, and at run time an assignment throws a `TypeError`.
   *
   * @category Constants
   */
  static readonly numericLevels = Object.freeze({
    silent: 0,
    error: 10,
    warn: 20,
    info: 30,
    verbose: 40,
    debug: 50,
    trace: 60,
    all: 70,
  } as const satisfies Record<LogLevel, number>)

  /**
   * The value used for the undefined log level (maximum value).
   *
   * It is read-only, like `recommendedLevel`.
   *
   * @category Constants
   */
  static readonly numericLevelUndefined: NumericLogLevel = Infinity

  /**
   * The value used for the `always` case (minimum value).
   *
   * It is read-only, like `recommendedLevel`.
   *
   * @category Constants
   */
  static readonly numericLevelAlways: NumericLogLevel = -1

  /**
   * The names of the valid log levels, in increasing order of verbosity,
   * from `silent` to `all`.
   *
   * The array is frozen. It is derived from the keys of `numericLevels`,
   * so that the two cannot drift apart.
   *
   * @example
   * ```javascript
   * console.log(`Valid levels: ${Logger.levelNames.join(', ')}`)
   * ```
   *
   * @remarks
   * - added in v7.0.0
   *
   * @category Constants
   */
  static readonly levelNames: readonly LogLevel[] = Object.freeze(
    Object.keys(Logger.numericLevels) as LogLevel[]
  )

  /**
   * Check if a value is the name of a valid log level.
   *
   * It is a type guard, to be used when the level comes from a source that
   * is not checked by the compiler, like a command line option or an
   * environment variable. It returns `false` for any value that is not
   * one of the strings in `levelNames`, including non-string values,
   * strings with different case, and the names of inherited properties
   * (like `'toString'`).
   *
   * @example
   * ```javascript
   * const name = process.env.LOG_LEVEL
   * if (Logger.isLogLevel(name)) {
   *   log.level = name
   * } else {
   *   log.error(`Level must be one of: ${Logger.levelNames.join(', ')}`)
   * }
   * ```
   *
   * @remarks
   * - added in v7.0.0
   *
   * @param value - The value to check.
   *
   * @returns True if the value is a valid log level name.
   *
   * @category Log Level Check Methods
   */
  static isLogLevel(value: unknown): value is LogLevel {
    return (
      typeof value === 'string' &&
      Object.prototype.hasOwnProperty.call(Logger.numericLevels, value)
    )
  }

  /**
   * Check that a value is the name of a valid log level, and throw an
   * error that tells the caller what to do if it is not.
   *
   * The value is shown in the message as `util.inspect()` writes it, so
   * that the newlines and the control characters of an untrusted value
   * are escaped.
   *
   * @param value - The value to check.
   *
   * @throws A `TypeError` if the value is not a string (including
   *   `undefined` and `null`).
   * @throws A `RangeError` if the value is a string that is not one of
   *   `Logger.levelNames` (including the empty string and a name with a
   *   different case).
   *
   * @category Internal Members
   */
  private static assertLogLevel(value: unknown): asserts value is LogLevel {
    if (typeof value !== 'string') {
      throw new TypeError(
        'Log level must be a string, not ' +
          `${value === null ? 'null' : typeof value}; ` +
          `valid levels are: ${Logger.levelNames.join(', ')}`
      )
    }
    if (!Logger.isLogLevel(value)) {
      throw new RangeError(
        `Unsupported log level ${util.inspect(value)}; ` +
          `valid levels are: ${Logger.levelNames.join(', ')}`
      )
    }
  }

  // --------------------------------------------------------------------------
  // Properties.

  /**
   * The console object used to output the log messages.
   *
   * @category Internal Members
   *
   * @internal
   */
  // The global console is used only when no console is passed, and then
  // `C` is the default type, `Console`, so the cast is sound, unless the
  // type argument is given explicitly without passing a console.
  protected readonly _console: C = console as unknown as C
  /**
   * The numerical value of the log level.
   *
   * @category Internal Members
   */
  protected levelNumericValue: NumericLogLevel = Logger.numericLevelUndefined
  /**
   * The name of the log level.
   *
   * @category Internal Members
   */
  protected levelName: LogLevel | undefined = undefined

  /**
   * Empty buffer where preliminary log lines are stored
   * until the log level is set.
   *
   * @category Internal Members
   */
  protected buffer: LoggerBufferRecord[] = []

  // --------------------------------------------------------------------------
  // Constructor.

  /**
   * Create a **Logger** instance.
   *
   * The typical use case is to create a logger with a given log level,
   * usually `info`.
   *
   * ```javascript
   * const log = new Logger({
   *   level: 'info'
   * })
   * ```
   *
   * By default, the system console is used.
   *
   * The complete use case is to create the logger instance with both a
   * `console` and a `level`. This might be particularly useful in tests,
   * where a mock console can be used to capture log messages.
   *
   * ```javascript
   * const log = new Logger({
   *   console: mockConsole,
   *   level: 'info'
   * })
   * ```
   *
   * If present, the `console` must be an object that has the `log()` and
   * `error()` functions (see `LoggerConsole`), like the node **Console**,
   * a mock console derived from it, or a minimal `{ log, error }` object.
   *
   * The `level` property is optional since it can be set later.
   * Without it, the constructor will
   * create the logger in a preliminary state, and all log lines will be stored
   * in an internal buffer until the log level is set.
   *
   * ```javascript
   * const log = new Logger()
   * ```
   * @param params - The generic object used to pass parameters to the
   * constructor.
   *
   * @throws A `RangeError` if the level is a string that is not one of the
   *   valid names, and a `TypeError` if it is not a string (a `level` that
   *   is `undefined` is the same as no level). The same errors are thrown
   *   by the `level` setter.
   * @throws An `AssertionError` if the console does not have the `log()`
   *   and `error()` functions.
   */
  constructor(
    params: {
      /**
       * The name of the log level; if not passed, or `undefined`, the logger
       * is created in a preliminary state, and all log lines will be stored
       * in an internal buffer, until the log level is set. Optional.
       */
      level?: LogLevel | undefined
      /**
       * The underlying console object used to log the message; any object
       * with the `log()` and `error()` functions (see `LoggerConsole`).
       * Optional. If not passed, or `undefined`, the JavaScript standard
       * `console` object is used.
       */
      console?: C | undefined
    } = {}
  ) {
    if (params.console != null) {
      this._console = params.console
    }
    if (params.level !== undefined) {
      this.level = params.level
    }

    assert(
      typeof this._console.log === 'function',
      'The console must have a log() function'
    )
    assert(
      typeof this._console.error === 'function',
      'The console must have an error() function'
    )
  }

  // --------------------------------------------------------------------------
  // Accessors (getters & setters).

  /**
   * Accessor to check if the log level was initialised.
   *
   * If the logger was created without an explicit log level, the
   * logger is in a preliminary state and all log lines will be stored
   * in an internal buffer until the log level is set.
   *
   * @example
   * ```javascript
   * if (!log.hasLevel) {
   *   log.level = Logger.recommendedLevel
   * }
   * ```
   *
   * @remarks
   * - changed to an accessor in v5.0.0
   * - added as a method in v2.1.0
   *
   * @returns True if the level was set.
   *
   * @category Log Level Accessors
   */
  get hasLevel(): boolean {
    return this.levelNumericValue !== Logger.numericLevelUndefined
  }

  /**
   * Accessor to set the log level.
   *
   * If the log level is not one of the known strings, an error is thrown
   * (a `TypeError` for a value that is not a string, including
   * `undefined`, and a `RangeError` for a string that is not a level
   * name), with a message that lists the valid names. To validate a level
   * that comes from an unchecked source, like a command line option, use
   * `Logger.isLogLevel()` first; the valid names are in
   * `Logger.levelNames`.
   *
   * If this is the first time when the log level is set,
   * flush the internal buffer.
   *
   * The buffer is emptied before the messages are written, so each
   * buffered message is written at most once. If the console throws
   * while the buffer is flushed, the exception is propagated to the
   * caller, the level remains set, and the buffered messages that were
   * not yet written are discarded.
   *
   * @example
   * ```javascript
   * log.level = 'info'
   * ```
   *
   * The type of the setter is `LogLevel`, while the getter is
   * `LogLevel | undefined`: the level is `undefined` only in the
   * preliminary state, and cannot be set back to `undefined`.
   *
   * @param level - A string with the new log level.
   *
   * @throws A `TypeError` if the level is not a string.
   * @throws A `RangeError` if the level is not one of the valid names.
   *
   * @category Log Level Accessors
   */
  set level(level: LogLevel) {
    Logger.assertLogLevel(level)

    this.levelNumericValue = Logger.numericLevels[level]
    this.levelName = level

    // Flush the internal buffer.
    if (this.buffer.length > 0) {
      // Detach the buffer before the replay, so that a record is never
      // written twice, even if the console throws.
      const records = this.buffer
      this.buffer = []

      records.forEach((record) => {
        if (this.levelNumericValue >= record.numericLevel) {
          record.func(record.message)
        }
      })
    }
  }

  /**
   * Accessor to get the log level.
   *
   * @example
   * ```javascript
   * console.log(log.level)
   * ```
   *
   * @returns A string with the log level name.
   *
   * @category Log Level Accessors
   */
  // The getter returns `undefined` in the preliminary state, but the setter
  // does not accept `undefined`, which is rejected at run time: this is
  // deliberate, so the rule that wants the getter type to be assignable to
  // the setter type is disabled for this pair.
  // eslint-disable-next-line @typescript-eslint/related-getter-setter-pairs
  get level(): LogLevel | undefined {
    return this.levelName
  }

  /**
   * Accessor to check the log level.
   *
   * Since `silent` is the lowest level, this accessor is always `true`,
   * for every level that was set, and also before a level is set (the
   * preliminary state). It cannot tell whether the logger is silent.
   *
   * To check for the `silent` level, compare the `level` accessor.
   *
   * @example
   * ```javascript
   * if (log.level === 'silent') {
   *   // Nothing but `always()` messages are output.
   * }
   * ```
   *
   * @returns Always `true`.
   *
   * @remarks
   * - changed to an accessor in v3.0.0;
   * - deprecated in v7.0.0, to be removed in the next major version.
   *
   * @deprecated Always `true`, use `log.level === 'silent'` instead.
   *
   * @category Log Level Check Accessors
   */
  get isSilent(): boolean {
    return this.levelNumericValue >= Logger.numericLevels.silent
  }

  /**
   * Accessor to check the log level.
   *
   * Before a level is set (the preliminary state), it returns `true`,
   * so that the messages produced under the check are buffered rather
   * than lost; they are filtered when the level is set. Use `hasLevel`
   * to tell whether a level was set.
   *
   * @returns True if the log level is `error` or higher.
   *
   * @remarks
   * - changed to an accessor in v3.0.0.
   *
   * @category Log Level Check Accessors
   */
  get isError(): boolean {
    return this.levelNumericValue >= Logger.numericLevels.error
  }

  /**
   * Accessor to check the log level.
   *
   * Before a level is set (the preliminary state), it returns `true`,
   * so that the messages produced under the check are buffered rather
   * than lost; they are filtered when the level is set. Use `hasLevel`
   * to tell whether a level was set.
   *
   * @returns True if the log level is `warn` or higher.
   *
   * @remarks
   * - changed to an accessor in v3.0.0.
   *
   * @category Log Level Check Accessors
   */
  get isWarn(): boolean {
    return this.levelNumericValue >= Logger.numericLevels.warn
  }

  /**
   * Accessor to check the log level.
   *
   * Before a level is set (the preliminary state), it returns `true`,
   * so that the messages produced under the check are buffered rather
   * than lost; they are filtered when the level is set. Use `hasLevel`
   * to tell whether a level was set.
   *
   * @returns True if the log level is `info` or higher.
   *
   * @remarks
   * - changed to an accessor in v3.0.0.
   *
   * @category Log Level Check Accessors
   */
  get isInfo(): boolean {
    return this.levelNumericValue >= Logger.numericLevels.info
  }

  /**
   * Accessor to check the log level.
   *
   * Before a level is set (the preliminary state), it returns `true`,
   * so that the messages produced under the check are buffered rather
   * than lost; they are filtered when the level is set. Use `hasLevel`
   * to tell whether a level was set.
   *
   * @returns True if the log level is `verbose` or higher.
   *
   * @remarks
   * - changed to an accessor in v3.0.0.
   *
   * @category Log Level Check Accessors
   */
  get isVerbose(): boolean {
    return this.levelNumericValue >= Logger.numericLevels.verbose
  }

  /**
   * Accessor to check the log level.
   *
   * Before a level is set (the preliminary state), it returns `true`,
   * so that the messages produced under the check are buffered rather
   * than lost; they are filtered when the level is set. Use `hasLevel`
   * to tell whether a level was set.
   *
   * @returns True if the log level is `debug` or higher.
   *
   * @remarks
   * - changed to an accessor in v3.0.0.
   *
   * @category Log Level Check Accessors
   */
  get isDebug(): boolean {
    return this.levelNumericValue >= Logger.numericLevels.debug
  }

  /**
   * Accessor to check the log level.
   *
   * Before a level is set (the preliminary state), it returns `true`,
   * so that the messages produced under the check are buffered rather
   * than lost; they are filtered when the level is set. Use `hasLevel`
   * to tell whether a level was set.
   *
   * @returns True if the log level is `trace` or higher.
   *
   * @remarks
   * - changed to an accessor in v3.0.0.
   *
   * @category Log Level Check Accessors
   */
  get isTrace(): boolean {
    return this.levelNumericValue >= Logger.numericLevels.trace
  }

  /**
   * Accessor to check the log level.
   *
   * Before a level is set (the preliminary state), it returns `true`,
   * so that the messages produced under the check are buffered rather
   * than lost; they are filtered when the level is set. Use `hasLevel`
   * to tell whether a level was set.
   *
   * @returns True if the log level is `all`.
   *
   * @remarks
   * - changed to an accessor in v3.0.0.
   *
   * @category Log Level Check Accessors
   */
  get isAll(): boolean {
    return this.levelNumericValue >= Logger.numericLevels.all
  }

  // --------------------------------------------------------------------------

  /**
   * Accessor to get the underlying `console` object.
   *
   * Direct access to the console object is useful in tests, when
   * the console is a mock object, which allows to check the logged
   * messages. The type of the result is the type of the console that was
   * passed to the constructor (`Console`, if none was passed), so the
   * members of a mock object can be used without a cast.
   *
   * @returns The console object used by the logger.
   */
  get console(): C {
    return this._console
  }

  // --------------------------------------------------------------------------
  // Methods.

  /**
   * Check if the log level is set to a given level name, or higher.
   *
   * This is a more generic version of the accessors (like `isDebug`, etc),
   * to be used when the log level is not known at compile time.
   *
   * Before a level is set (the preliminary state), it returns `true` for
   * every level, so that the messages produced under the check are
   * buffered rather than lost; they are filtered when the level is set.
   * Use `hasLevel` to tell whether a level was set.
   *
   * It can also be used to ensure that the log level is not decreased.
   * Since in the preliminary state there is no level to compare with,
   * check `hasLevel` first:
   *
   * @example
   * ```javascript
   * if (!log.hasLevel || !log.isLevel(newLevel)) {
   *   log.level = newLevel
   * }
   * ```
   * @remarks
   * - added in v6.0.0
   *
   * @param level - The name of the log level.
   *
   * @returns True if the current log level is equal to the given
   *   level or higher.
   *
   * @throws A `TypeError` if the level is not a string.
   * @throws A `RangeError` if the level is not one of the valid names.
   *
   * @category Log Level Check Methods
   */
  isLevel(level: LogLevel): boolean {
    Logger.assertLogLevel(level)

    return this.levelNumericValue >= Logger.numericLevels[level]
  }

  /**
   * The internal log writer.
   *
   * If the log level was defined, call the actual logger function, otherwise
   * store the log lines in the array buffer, for later
   * processing, when the log level is finally defined.
   *
   * If the message is `undefined`, nothing is written and nothing is
   * stored. The public output methods always pass a string; the case is
   * part of the contract of this method, for the subclasses that call it
   * directly.
   *
   * @param numericLevel - The log numeric level.
   * @param loggerFunction - The function to be used to write
   * the message.
   * @param message - The log message.
   *
   * @category Output Methods
   */
  protected write(
    numericLevel: NumericLogLevel,
    loggerFunction: LoggerFunction,
    message: string | undefined
  ): void {
    if (message === undefined) {
      // Ignore if nothing to write.
      return
    }

    if (this.levelNumericValue !== Logger.numericLevelUndefined) {
      // If the level was set, output the message.
      loggerFunction(message)
    } else {
      // Store the log entry details in the buffer.
      this.buffer.push({
        numericLevel,
        func: loggerFunction,
        message,
      })
    }
  }

  /**
   * The common implementation of the output methods.
   *
   * If the current log level is lower than the numeric level of the
   * method, nothing is done, and the message is not formatted. Otherwise
   * the message is formatted with `util.format()`, prefixed, and passed
   * to `write()`, with a function that writes it on the given stream of
   * the console.
   *
   * In the preliminary state the current log level is the maximum, so the
   * message is always formatted and passed to `write()`, which buffers it.
   *
   * @param numericLevel - The numeric level of the method.
   * @param stream - The console method used to write the message,
   * `log` for stdout and `error` for stderr.
   * @param prefix - The string added in front of the formatted message.
   * @param message - The message, as accepted by `util.format()`.
   * @param args - The optional variable arguments.
   *
   * @category Internal Members
   */
  private emit(
    numericLevel: NumericLogLevel,
    stream: 'log' | 'error',
    prefix: string,
    message: unknown,
    args: unknown[]
  ): void {
    if (this.levelNumericValue < numericLevel) {
      return
    }

    const str = util.format(message, ...args)
    this.write(
      numericLevel,
      (msg: string) => {
        if (stream === 'log') {
          this._console.log(msg)
        } else {
          this._console.error(msg)
        }
      },
      prefix + str
    )
  }

  // --------------------------------------------------------------------------

  /**
   * Always log a message, regardless of the log level, (even `'silent'`,
   * when no other messages are logged).
   *
   * It is the only method that is written at `silent`, and it has no
   * prefix. Use it for the messages that must be shown at every log
   * level, like the version or the result requested by the user; for the
   * normal output of an application, that `silent` suppresses, use
   * `output()` (see the table of output methods in the description of
   * the class).
   *
   * Before a log level is set (the preliminary state), the message is
   * stored in the internal buffer, like all the others, and is written
   * when the level is set; if the level is never set, it is never
   * written.
   *
   * The message is passed via `console.log()`. An `Error` object is
   * expanded with the full stack trace and the `cause` chain, on several
   * lines, without a prefix (see **Logging errors** in the description of
   * the class).
   *
   * @example
   * ```javascript
   * log.always(version)
   * ```
   *
   * @param message - Message to log, as accepted by `util.format()`. If
   *   omitted or `undefined`, it is replaced by an empty string (see
   *   **Empty messages** in the description of the class).
   * @param args - Optional variable arguments.
   *
   * @category Output Methods
   */
  always(message: unknown = '', ...args: unknown[]): void {
    this.emit(Logger.numericLevelAlways, 'log', '', message, args)
  }

  /**
   * Log an error message, if the log level is `error` or higher.
   *
   * The message is prefixed with `error: ` and
   * passed via `console.error()`.
   *
   * There is a special case when the first argument is an `Error`
   * object: the prefix is omitted, since the first line of the expanded
   * error already starts with its name (for example `Error: boom`). This
   * is deliberate, and only `error()` does it. The
   * error is expanded with the full stack trace and the `cause` chain,
   * on several lines, and passed via `console.error()`.
   *
   * An `Error` passed after other arguments is also expanded, but the
   * prefix is kept: `log.error('failed:', err)` outputs
   * `error: failed: Error: boom`, followed by the stack trace.
   *
   * To show only the message of an error, on a single line with the
   * prefix, pass its message instead of the object (see
   * **Logging errors** in the description of the class):
   *
   * ```javascript
   * try {
   *   // ...
   * } catch (err) {
   *   // `Error: boom`, followed by the stack trace.
   *   log.error(err)
   *   // `error: boom`, on a single line.
   *   log.error(err instanceof Error ? err.message : String(err))
   * }
   * ```
   *
   * @example
   * ```javascript
   * log.error('Not good...')
   * ```
   *
   * @param message - Message to log, as accepted by `util.format()`. If
   *   omitted or `undefined`, it is replaced by an empty string (see
   *   **Empty messages** in the description of the class).
   * @param args - Optional variable arguments.
   *
   * @category Output Methods
   */
  // error (message: Error): void
  error(message: unknown = '', ...args: unknown[]): void {
    this.emit(
      Logger.numericLevels.error,
      'error',
      message instanceof Error ? '' : 'error: ',
      message,
      args
    )
  }

  /**
   * Log a message on the standard output, if the log level is `error` or
   * higher.
   *
   * It is meant for the normal output of an application, that is
   * suppressed at `silent`, like all the other messages except
   * `always()`. It differs from `error()` by **not** prefixing the string
   * with `error: ` and using `console.log()` instead of
   * `console.error()`, and from `info()` by being written from the
   * `error` level, not from the `info` level (see the table of output
   * methods in the description of the class).
   *
   * An `Error` object is expanded as by `error()`, with the full stack
   * trace and the `cause` chain, on several lines, and passed via
   * `console.log()`. To show only the message, without the stack trace,
   * pass its message instead of the object (see **Logging errors** in
   * the description of the class):
   *
   * ```javascript
   * try {
   *   // ...
   * } catch (err) {
   *   // `boom`, on a single line, without the stack trace.
   *   log.output(err instanceof Error ? err.message : String(err))
   * }
   * ```
   *
   * @example
   * ```javascript
   * log.output('Not good either...')
   * ```
   *
   * @param message - Message to log, as accepted by `util.format()`. If
   *   omitted or `undefined`, it is replaced by an empty string (see
   *   **Empty messages** in the description of the class).
   * @param args - Optional variable arguments.
   *
   * @category Output Methods
   */
  output(message: unknown = '', ...args: unknown[]): void {
    this.emit(Logger.numericLevels.error, 'log', '', message, args)
  }

  /**
   * Log a warning message, if the log level is `warn` or higher.
   *
   * The message is prefixed with `warning: ` and
   * passed via `console.error()`.
   *
   * An `Error` object is expanded with the full stack trace and the
   * `cause` chain, on several lines; unlike in `error()`, the prefix is
   * kept even when the error is the first argument
   * (`warning: Error: boom`, followed by the stack trace). To show only
   * the message, pass `err.message` instead of the object (see
   * **Logging errors** in the description of the class).
   *
   * @example
   * ```javascript
   * log.warn('The configuration file is missing, using the defaults')
   * ```
   *
   * @param message - Message to log, as accepted by `util.format()`. If
   *   omitted or `undefined`, it is replaced by an empty string (see
   *   **Empty messages** in the description of the class).
   * @param args - Optional variable arguments.
   *
   * @category Output Methods
   */
  warn(message: unknown = '', ...args: unknown[]): void {
    this.emit(Logger.numericLevels.warn, 'error', 'warning: ', message, args)
  }

  /**
   * Log an informative message, if the log level is `info` or higher.
   *
   * The message is passed via `console.log()`. An `Error` object is
   * expanded with the full stack trace and the `cause` chain, on several
   * lines, without a prefix (see **Logging errors** in the description of
   * the class).
   *
   * @example
   * ```javascript
   * log.info(title)
   * ```
   *
   * @param message - Message to log, as accepted by `util.format()`. If
   *   omitted or `undefined`, it is replaced by an empty string (see
   *   **Empty messages** in the description of the class).
   * @param args - Optional variable arguments.
   *
   * @category Output Methods
   */
  info(message: unknown = '', ...args: unknown[]): void {
    this.emit(Logger.numericLevels.info, 'log', '', message, args)
  }

  /**
   * Log a verbose message, if the log level is `verbose` or higher.
   *
   * The message is passed via `console.log()`. An `Error` object is
   * expanded with the full stack trace and the `cause` chain, on several
   * lines, without a prefix (see **Logging errors** in the description of
   * the class).
   *
   * @example
   * ```javascript
   * log.verbose('Configurations:')
   * ```
   *
   * @param message - Message to log, as accepted by `util.format()`. If
   *   omitted or `undefined`, it is replaced by an empty string (see
   *   **Empty messages** in the description of the class).
   * @param args - Optional variable arguments.
   *
   * @category Output Methods
   */
  verbose(message: unknown = '', ...args: unknown[]): void {
    this.emit(Logger.numericLevels.verbose, 'log', '', message, args)
  }

  /**
   * Log a debug message, if the log level is `'debug'` or higher.
   *
   * The message is prefixed with `debug: ` and
   * passed via `console.log()`. An `Error` object is expanded with the
   * full stack trace and the `cause` chain, on several lines, and the
   * prefix is kept, even when the error is the first argument
   * (`debug: Error: boom`, followed by the stack trace; see **The prefix
   * of an `Error`** in the description of the class).
   *
   * @example
   * ```javascript
   * log.debug(`spawn: ${cmd}`)
   * ```
   *
   * @param message - Message to log, as accepted by `util.format()`. If
   *   omitted or `undefined`, it is replaced by an empty string (see
   *   **Empty messages** in the description of the class).
   * @param args - Optional variable arguments.
   *
   * @category Output Methods
   */
  debug(message: unknown = '', ...args: unknown[]): void {
    this.emit(Logger.numericLevels.debug, 'log', 'debug: ', message, args)
  }

  /**
   * Log a trace message, if the log level is `trace` or higher.
   *
   * The message is prefixed with `trace: ` and
   * passed via `console.log()`. An `Error` object is expanded with the
   * full stack trace and the `cause` chain, on several lines, and the
   * prefix is kept, even when the error is the first argument
   * (`trace: Error: boom`, followed by the stack trace; see **The prefix
   * of an `Error`** in the description of the class).
   *
   * @example
   * ```javascript
   * log.trace(`${this.constructor.name}.doRun()`)
   * ```
   *
   * @param message - Message to log, as accepted by `util.format()`. If
   *   omitted or `undefined`, it is replaced by an empty string (see
   *   **Empty messages** in the description of the class).
   * @param args - Optional variable arguments.
   *
   * @category Output Methods
   */
  trace(message: unknown = '', ...args: unknown[]): void {
    this.emit(Logger.numericLevels.trace, 'log', 'trace: ', message, args)
  }

  // --------------------------------------------------------------------------
}

// Freeze the class, so that the static members, which are the shared
// configuration of all the loggers, cannot be changed at run time. The
// `readonly` modifiers are checked only by the compiler.
Object.freeze(Logger)

// ----------------------------------------------------------------------------
