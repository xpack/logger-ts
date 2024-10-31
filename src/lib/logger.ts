/*
 * This file is part of the xPack project (http://xpack.github.io).
 * Copyright (c) 2017 Liviu Ionescu. All rights reserved.
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
 * arguments, as defined by the Node.js console (not really necessary
 * with ES6).
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
import * as util from 'node:util'

// ----------------------------------------------------------------------------
// Public Types.

/**
 * Type of the strings recognised as valid level names.
 *
 * Internally these strings are converted into integer values,
 * and these numbers are used in comparisons.
 *
 * Higher values mean more verbosity.
 */
export type LogLevel =
  'silent' | 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'trace' | 'all'

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
 * messages are logged.
 *
 * Use `log.always()` instead of the `console.log()`, since it accounts for
 * different contexts, created for example when using REPL.
 *
 * There is no `critical` level, corresponding to errors that prevent
 * the program to run, since these are actually related to bugs;
 * use `assert()` instead.
 *
 * The messages may include formatting directives, with additional
 * arguments, as defined by the Node.js console (not really necessary
 * with ES6).
 *
 * All output functions accept an optional string message and possibly
 * some arguments,
 * as processed by the standard Node.js
 * [`util.format(msg, ...args)`](https://nodejs.org/dist/latest-v10.x/docs/api/util.html#util_util_format_format_args)
function.
 *
 * If the logging code is more complex than a single line,
 * for example if it needs a long loop,
 * it is recommended to explicitly check the log level and,
 * if not high enough, skip the code entirely.
 *
 * ```javascript
 *   if (log.isVerbose) {
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
 */
export class Logger {
  // --------------------------------------------------------------------------
  // Static Properties.

  /**
   * The recommended default level.
   *
   * @category Constants
   */
  static defaultLevel: LogLevel = 'info'

  // Not an enum, to be able to define it inside the class,
  // not at global level.
  /**
   * Internal numerical values for the log level.
   *
   * @category Constants
   */
  static numericLevels = {
    silent: 0,
    error: 10,
    warn: 20,
    info: 30,
    verbose: 40,
    debug: 50,
    trace: 60,
    all: 70
  }

  /**
   * The value used for the undefined log level (maximum value).
   *
   * @category Constants
   */
  static numericLevelUndefined: NumericLogLevel = Infinity

  /**
   * The value used for the `always` case (minimum value).
   *
   * @category Constants
   */
  static numericLevelAlways: NumericLogLevel = -1

  // --------------------------------------------------------------------------
  // Properties.

  /**
   * The console object used to output the log messages.
   *
   * @category Internal Members
   *
   * @internal
   */
  protected readonly _console: Console = console
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
   * If present, the `console` must be an object derived from the
   * node **Console**, possibly with some methods overridden.
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
   */
  constructor (params: {
    /**
     * The name of the log level; if not passed, the logger is created in
     * a preliminary state, and all log lines will be stored in an internal
     * buffer, until the log level is set. Optional.
     */
    level?: LogLevel
    /**
     * The underlying console object used to log the message.
     * Optional. If not passed, the JavaScript standard `console` object
     * is used.
     */
    console?: Console
  } = {}) {
    if (params.console != null) {
      this._console = params.console
    }
    if (params.level !== undefined) {
      this.level = params.level
    }

    assert(typeof this._console.log === 'function',
      'The console must have a log() function')
    assert(typeof this._console.error === 'function',
      'The console must have an error() function')

    this.trace(`${this.constructor.name}.constructor()`)
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
   * ```console
   * if (!log.hasLevel) {
   *   log.level = defaultLevel
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
  get hasLevel (): boolean {
    return this.levelNumericValue !== Logger.numericLevelUndefined
  }

  /**
   * Accessor to set the log level.
   *
   * If the log level is not one of the known strings, an assert will fire.
   *
   * If this is the first time when the log level is set,
   * flush the internal buffer.
   *
   * @example
   * ```javascript
   * log.level = 'info'
   * ```
   *
   * @param level - A string with the new log level.
   *
   * @category Log Level Accessors
   */
  set level (level: LogLevel | undefined) {
    assert(level)
    assert(Object.prototype.hasOwnProperty.call(Logger.numericLevels, level),
      `Log level '${level}' not supported.`)

    this.levelNumericValue = Logger.numericLevels[level]
    this.levelName = level

    // FLush the internal buffer.
    if (this.buffer.length > 0) {
      this.buffer.forEach(
        (record) => {
          if (this.levelNumericValue >= record.numericLevel) {
            record.func(record.message)
          }
        })

      // Clear the buffer.
      this.buffer = []
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
  get level (): LogLevel | undefined {
    return this.levelName
  }

  /**
   * Accessor to check the log level.
   *
   * @returns True if the log level is `silent` or higher.
   *
   * @remarks
   * - changed to an accessor in v3.0.0.
   *
   * @category Log Level Check Accessors
   */
  get isSilent (): boolean {
    return this.levelNumericValue >= Logger.numericLevels.silent
  }

  /**
   * Accessor to check the log level.
   *
   * @returns True if the log level is `error` or higher.
   *
   * @remarks
   * - changed to an accessor in v3.0.0.
   *
   * @category Log Level Check Accessors
   */
  get isError (): boolean {
    return this.levelNumericValue >= Logger.numericLevels.error
  }

  /**
   * Accessor to check the log level.
   *
   * @returns True if the log level is `warn` or higher.
   *
   * @remarks
   * - changed to an accessor in v3.0.0.
   *
   * @category Log Level Check Accessors
   */
  get isWarn (): boolean {
    return this.levelNumericValue >= Logger.numericLevels.warn
  }

  /**
   * Accessor to check the log level.
   *
   * @returns True if the log level is `info` or higher.
   *
   * @remarks
   * - changed to an accessor in v3.0.0.
   *
   * @category Log Level Check Accessors
   */
  get isInfo (): boolean {
    return this.levelNumericValue >= Logger.numericLevels.info
  }

  /**
   * Accessor to check the log level.
   *
   * @returns True if the log level is `verbose` or higher.
   *
   * @remarks
   * - changed to an accessor in v3.0.0.
   *
   * @category Log Level Check Accessors
   */
  get isVerbose (): boolean {
    return this.levelNumericValue >= Logger.numericLevels.verbose
  }

  /**
   * Accessor to check the log level.
   *
   * @returns True if the log level is `debug` or higher.
   *
   * @remarks
   * - changed to an accessor in v3.0.0.
   *
   * @category Log Level Check Accessors
   */
  get isDebug (): boolean {
    return this.levelNumericValue >= Logger.numericLevels.debug
  }

  /**
   * Accessor to check the log level.
   *
   * @returns True if the log level is `trace` or higher.
   *
   * @remarks
   * - changed to an accessor in v3.0.0.
   *
   * @category Log Level Check Accessors
   */
  get isTrace (): boolean {
    return this.levelNumericValue >= Logger.numericLevels.trace
  }

  /**
   * Accessor to check the log level.
   *
   * @returns True if the log level is `all`.
   *
   * @remarks
   * - changed to an accessor in v3.0.0.
   *
   * @category Log Level Check Accessors
   */
  get isAll (): boolean {
    return this.levelNumericValue >= Logger.numericLevels.all
  }

  // --------------------------------------------------------------------------

  /**
   * Accessor to get the underlying `console` object.
   *
   * Direct access to the console object is useful in tests, when
   * the console is a mock object, which allows to check the logged
   * messages.
   *
   * @returns The console object used by the logger.
   */
  get console (): Console {
    return this._console
  }

  // --------------------------------------------------------------------------
  // Methods.

  /**
   * Check if the log level is set to a given level name.
   *
   * This is a more generic version of the accessors (like `isDebug`, etc),
   * to be used when the log level is not know at compile time.
   *
   * It can also be used to ensure that the log level is not decreased,
   * for example:
   *
   * @example
   * ```javascript
   * if (!log.islevel(newLevel)) {
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
   * @category Log Level Check Methods
   */
  isLevel (level: LogLevel): boolean {
    assert(level)
    assert(Object.prototype.hasOwnProperty.call(Logger.numericLevels, level),
      `Log level '${level}' not supported.`)

    return this.levelNumericValue >= Logger.numericLevels[level]
  }

  /**
   * The internal log writer.
   *
   * If the log level was defined, call the actual logger function, otherwise
   * store the log lines in the array buffer, for later
   * processing, when the log level is finally defined.
   *
   * @param numericLevel - The log numeric level.
   * @param loggerFunction - The function to be used to write
   * the message.
   * @param message - The log message.
   *
   * @category Output Methods
   */
  protected write (
    numericLevel: NumericLogLevel,
    loggerFunction: LoggerFunction,
    message: string | undefined
  ): void {
    if (message === undefined || message === null) {
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
        message
      })
    }
  }

  // --------------------------------------------------------------------------

  /**
   * Always log a message, regardless of the log level, (even `'silent'`,
   * when no other messages are logged).
   *
   * The message is passed via `console.log()`.
   *
   * @example
   * ```javascript
   * log.always(version)
   * ```
   *
   * @param message - Message to log, as accepted by `util.format()`.
   * @param args - Optional variable arguments.
   *
   * @category Output Methods
   */
  always (message: any = '', ...args: any[]): void {
    const str = util.format(message, ...args)
    this.write(Logger.numericLevelAlways, this._console.log, str)
  }

  /**
   * Log an error message, if the log level is `error` or higher.
   *
   * The message is prefixed with `error: ` and
   * passed via `console.error()`.
   *
   * There is a special case when the input is an `Error` object. It
   * is expanded, including a full stack trace, and passed via
   * `console.error()`.
   *
   * ```javascript
   * try {
   *   // ...
   * } catch (err) {
   *   log.error(err)
   * }
   * ```
   *
   * @example
   * ```javascript
   * log.error('Not good...')
   * ```
   *
   * @param message - Message to log, as accepted by `util.format()`.
   * @param args - Optional variable arguments.
   *
   * @category Output Methods
   */
  // error (message: Error): void
  error (message: any = '', ...args: any[]): void {
    if (this.levelNumericValue >= Logger.numericLevels.error) {
      if (message instanceof Error) {
        const str = util.format(message, ...args)
        this.write(Logger.numericLevels.error, this._console.error, str)
      } else {
        const str = util.format(message, ...args)
        this.write(Logger.numericLevels.error, this._console.error,
          'error: ' + str)
      }
    }
  }

  /**
   * Log an error message, if the log level is `error` or higher.
   *
   * It differs from `error()` by **not** prefixing the string with `error: `
   * and using `console.log()` instead of `console.error()`.
   *
   * There is a special case when the input is an `Error` object. It
   * is expanded, including a full stack trace, and passed via
   * `console.log()`.
   *
   * ```javascript
   * try {
   *   // ...
   * } catch (err) {
   *   // Do not show the stack trace.
   *   log.output(err)
   * }
   * ```
   *
   * @example
   * ```javascript
   * log.output('Not good either...')
   * ```
   *
   * @param message - Message to log, as accepted by `util.format()`.
   * @param args - Optional variable arguments.
   *
   * @category Output Methods
   */
  output (message: any = '', ...args: any[]): void {
    if (this.levelNumericValue >= Logger.numericLevels.error) {
      const str = util.format(message, ...args)
      this.write(Logger.numericLevels.error, this._console.log, str)
    }
  }

  /**
   * Log a warning message, if the log level is `warn` or higher.
   *
   * The message is prefixed with `warning: ` and
   * passed via `console.error()`.
   *
   * @example
   * ```javascript
   * log.info(title)
   * ```
   *
   * @param message - Message to log, as accepted by `util.format()`.
   * @param args - Optional variable arguments.
   *
   * @category Output Methods
   */
  warn (message: any = '', ...args: any[]): void {
    if (this.levelNumericValue >= Logger.numericLevels.warn) {
      const str = util.format(message, ...args)
      this.write(Logger.numericLevels.warn, this._console.error,
        'warning: ' + str)
    }
  }

  /**
   * Log an informative message, if the log level is `info` or higher.
   *
   * The message is passed via `console.log()`.
   *
   * @example
   * ```javascript
   * log.info(title)
   * ```
   *
   * @param message - Message to log, as accepted by `util.format()`.
   * @param args - Optional variable arguments.
   *
   * @category Output Methods
   */
  info (message: any = '', ...args: any[]): void {
    if (this.levelNumericValue >= Logger.numericLevels.info) {
      const str = util.format(message, ...args)
      this.write(Logger.numericLevels.info, this._console.log, str)
    }
  }

  /**
   * Log a verbose message, if the log level is `verbose` or higher.
   *
   * The message is passed via `console.log()`.
   *
   * @example
   * ```javascript
   * log.verbose('Configurations:')
   * ```
   *
   * @param message - Message to log, as accepted by `util.format()`.
   * @param args - Optional variable arguments.
   *
   * @category Output Methods
   */
  verbose (message: any = '', ...args: any[]): void {
    if (this.levelNumericValue >= Logger.numericLevels.verbose) {
      const str = util.format(message, ...args)
      this.write(Logger.numericLevels.verbose, this._console.log, str)
    }
  }

  /**
   * Log a debug message, if the log level is `'debug'` or higher.
   *
   * The message is prefixed with `debug: ` and
   * passed via `console.log()`.
   *
   * @example
   * ```javascript
   * log.debug(`spawn: ${cmd}`)
   * ```
   *
   * @param message - Message to log, as accepted by `util.format()`.
   * @param args - Optional variable arguments.
   *
   * @category Output Methods
   */
  debug (message: any = '', ...args: any[]): void {
    if (this.levelNumericValue >= Logger.numericLevels.debug) {
      const str = util.format(message, ...args)
      this.write(Logger.numericLevels.debug, this._console.log,
        'debug: ' + str)
    }
  }

  /**
   * Log a trace message, if the log level is `trace` or higher.
   *
   * The message is prefixed with `trace: ` and
   * passed via `console.log()`.
   *
   * @example
   * ```javascript
   * log.trace(`${this.constructor.name}.doRun()`)
   * ```
   *
   * @param message - Message to log, as accepted by `util.format()`.
   * @param args - Optional variable arguments.
   *
   * @category Output Methods
   */
  trace (message: any = '', ...args: any[]): void {
    if (this.levelNumericValue >= Logger.numericLevels.trace) {
      const str = util.format(message, ...args)
      this.write(Logger.numericLevels.trace, this._console.log,
        'trace: ' + str)
    }
  }

  // --------------------------------------------------------------------------
}

// ----------------------------------------------------------------------------
