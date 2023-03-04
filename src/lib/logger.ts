/*
 * This file is part of the xPack project (http://xpack.github.io).
 * Copyright (c) 2017 Liviu Ionescu. All rights reserved.
 *
 * Permission to use, copy, modify, and/or distribute this software
 * for any purpose is hereby granted, under the terms of the MIT license.
 *
 * If a copy of the license was not distributed with this file, it can
 * be obtained from https://opensource.org/licenses/MIT/.
 */

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
 * @summary Type of the strings recognised as valid level names.
 *
 * @description
 * Internally these strings are converted to integer values,
 * and these integers are used in comparisons. Higher values
 * mean more verbosity.
 */
export type LogLevel =
  'silent' | 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'trace' | 'all'

/** Type of the numeric log level. */
export type NumericLogLevel = number

/** Type of the object passed to instantiate a new logger. */
export interface LoggerConstructorParameters {
  /** The name of the log level; the default is `undefined`,
   * which means it will be set later. */
  level?: LogLevel
  /** The console object used to log the message;
   * by default, use the JavaScript standard `console` object. */
  console?: Console
}

/** Type of generic logger functions processing string messages. */
export type LoggerFunction = (message: string) => void

/** Record stored in the buffer when the logger is not yet enabled. */
export interface LoggerBufferRecord {
  /** Function to be called to log the message. */
  func: LoggerFunction
  /** Log level at the time of the call. */
  numericLevel: NumericLogLevel
  /** The string message to be logged. */
  message: string
}

// ============================================================================

/**
 * @summary The **Logger** class implements the logger functionality.
 *
 * @description
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
 * @example
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
  // Static Members.

  /** The recommended default level. */
  static defaultLevel: LogLevel = 'info'

  /** Internal numerical values for the log level. */
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

  /** The value used for the undefined log level (maximum value). */
  static numericLevelUndefined: NumericLogLevel = Infinity

  /** The value used for the `always` case (minimum value). */
  static numericLevelAlways: NumericLogLevel = -1

  // --------------------------------------------------------------------------
  // Members.

  /** The console object used to output the log messages. */
  protected readonly _console: Console = console
  /** The numerical value of the log level. */
  protected levelNumericValue: NumericLogLevel = Logger.numericLevelUndefined
  /** The name of the log level. */
  protected levelName: LogLevel | undefined = undefined

  /** Empty buffer where preliminary log lines are stored
   * until the log level is set. */
  protected buffer: LoggerBufferRecord[] = []

  // --------------------------------------------------------------------------
  // Constructor.

  /**
   * @summary Create a logger instance.
   *
   * @param params The generic object used to pass parameters to the
   * constructor.
   *
   * @description
   * The typical use case is to create a logger with a given log level,
   * usually `info`.
   *
   * @example
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
   * @example
   * ```javascript
   * const log = new Logger({
   *   console: myConsole,
   *   level: 'info'
   * })
   * ```
   *
   * If present, the `console` must be an object with at least two methods,
   * `log()` and `error()`, as defined in the Node.js documentation for
   * [console](https://nodejs.org/docs/latest-v14.x/api/console.html);
   * the recommended way is to derive the object from **Console** and
   * override some methods.
   *
   * The `level` property is optional since it can be set later.
   * Without it, the constructor will
   * create the logger in a preliminary state, and all log lines will be stored
   * in an internal buffer until the log level is set.
   *
   * @example
   * ```javascript
   * const log = new Logger()
   * ```
   */
  constructor (params: LoggerConstructorParameters = {}) {
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
   * @category Log Level Management
   * @summary Accessor to check if the log level was initialised.
   *
   * @returns True if the level was set.
   *
   * @description
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
   */
  get hasLevel (): boolean {
    return this.levelNumericValue !== Logger.numericLevelUndefined
  }

  /**
   * @category Log Level Management
   * @summary Setter for the log level.
   *
   * @param level The new log level.
   *
   * @description
   * Set the log level. If this is the first time when the log level is set,
   * flush the internal buffer.
   *
   * @example
   * ```javascript
   * log.level = 'info'
   * ```
   * If the log level is not one of the known strings, an assert will fire.
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
   * @category Log Level Management
   * @summary Accessor to get the log level.
   *
   * @returns The log level name.
   *
   * @description
   * Get the current log level, as a string.
   *
   * @example
   * ```javascript
   * console.log(log.level)
   * ```
   */
  get level (): LogLevel | undefined {
    return this.levelName
  }

  /**
   * @category Log Level Checks
   * @summary Accessor to check the log level.
   *
   * @returns True if the log level is `silent` or higher.
   *
   * @remarks
   * - changed to an accessor starting with v3.x.
   */
  get isSilent (): boolean {
    return this.levelNumericValue >= Logger.numericLevels.silent
  }

  /**
   * @category Log Level Checks
   * @summary Accessor to check the log level.
   *
   * @returns True if the log level is `error` or higher.
   *
   * @remarks
   * - changed to an accessor starting with v3.x.
   */
  get isError (): boolean {
    return this.levelNumericValue >= Logger.numericLevels.error
  }

  /**
   * @category Log Level Checks
   * @summary Accessor to check the log level.
   *
   * @returns True if the log level is `warn` or higher.
   *
   * @remarks
   * - changed to an accessor starting with v3.x.
   */
  get isWarn (): boolean {
    return this.levelNumericValue >= Logger.numericLevels.warn
  }

  /**
   * @category Log Level Checks
   * @summary Accessor to check the log level.
   *
   * @returns True if the log level is `info` or higher.
   *
   * @remarks
   * - changed to an accessor starting with v3.x.
   */
  get isInfo (): boolean {
    return this.levelNumericValue >= Logger.numericLevels.info
  }

  /**
   * @category Log Level Checks
   * @summary Accessor to check the log level.
   *
   * @returns True if the log level is `verbose` or higher.
   *
   * @remarks
   * - changed to an accessor starting with v3.x.
   */
  get isVerbose (): boolean {
    return this.levelNumericValue >= Logger.numericLevels.verbose
  }

  /**
   * @category Log Level Checks
   * @summary Accessor to check the log level.
   *
   * @returns True if the log level is `debug` or higher.
   *
   * @remarks
   * - changed to an accessor starting with v3.x.
   */
  get isDebug (): boolean {
    return this.levelNumericValue >= Logger.numericLevels.debug
  }

  /**
   * @category Log Level Checks
   * @summary Accessor to check the log level.
   *
   * @returns True if the log level is `trace` or higher.
   *
   * @remarks
   * - changed to an accessor starting with v3.x.
   */
  get isTrace (): boolean {
    return this.levelNumericValue >= Logger.numericLevels.trace
  }

  /**
   * @category Log Level Checks
   * @summary Accessor to check the log level.
   *
   * @returns True if the log level is `all`.
   *
   * @remarks
   * - changed to an accessor starting with v3.x.
   */
  get isAll (): boolean {
    return this.levelNumericValue >= Logger.numericLevels.all
  }

  // --------------------------------------------------------------------------

  /**
   * @summary Accessor to get the underlying `console` object.
   *
   * @returns The console object used by the logger.
   */
  get console (): Console {
    return this._console
  }

  // --------------------------------------------------------------------------
  // Methods.

  /**
   * @summary The internal log writer.
   *
   * @param numericLevel The log numeric level.
   * @param loggerFunction The function to be used to write
   * the message.
   * @param message The log message.
   *
   * @description
   * If the log level was defined, call the function, otherwise
   * store the log line details in the array buffer, for later
   * processing, when the log level is defined.
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
   * @category Output
   * @summary Output always.
   *
   * @param message Message to log, as accepted by `util.format()`.
   * @param args Optional variable arguments.
   *
   * @description
   * Log always, regardless of the log level, (even `'silent'`, when no other
   * messages are logged). The message is passed via `console.log()`.
   *
   * @example
   * ```javascript
   * log.always(version)
   * ```
   */
  always (message: any = '', ...args: any[]): void {
    const str = util.format(message, ...args)
    this.write(Logger.numericLevelAlways, this._console.log, str)
  }

  /**
   * @category Output
   * @summary Log error messages.
   *
   * @param message Message to log, as accepted by `util.format()`.
   * @param args Optional variable arguments.
   *
   * @description
   * Log error messages, if the log level is `error` or higher.
   * The message is prefixed with `error: ` and
   * passed via `console.error()`.
   *
   * @example
   * ```javascript
   * log.error('Not good...')
   * ```
   *
   * There is a special case when the input is an `Error` object. It
   * is expanded, including a full stack trace, and passed via
   * `console.error()`.
   *
   * @example
   * ```javascript
   * try {
   *   // ...
   * } catch (err) {
   *   log.error(err)
   * }
   * ```
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
   * @category Output
   * @summary Log error messages.
   *
   * @param message Message to log, as accepted by `util.format()`.
   * @param args Optional variable arguments.
   *
   * @description
   * Log error messages, if the log level is `error` or higher.
   * It differs from `error()` by **not** prefixing the string with `error: `
   * and using `console.log()` instead of `console.error()`.
   *
   * @example
   * ```javascript
   * log.output('Not good either...')
   * ```
   *
   * @example
   * ```javascript
   * try {
   *   // ...
   * } catch (err) {
   *   // Do not show the stack trace.
   *   log.output(err)
   * }
   * ```
   */
  output (message: any = '', ...args: any[]): void {
    if (this.levelNumericValue >= Logger.numericLevels.error) {
      const str = util.format(message, ...args)
      this.write(Logger.numericLevels.error, this._console.log, str)
    }
  }

  /**
   * @category Output
   * @summary Log warning messages.
   *
   * @param message Message to log, as accepted by `util.format()`.
   * @param args Optional variable arguments.
   *
   * @description
   * Log warning messages, if the log level is `warn` or higher.
   * The message is prefixed with `warning: ` and
   * passed via `console.error()`.
   *
   * @example
   * ```javascript
   * log.info(title)
   * ```
   */
  warn (message: any = '', ...args: any[]): void {
    if (this.levelNumericValue >= Logger.numericLevels.warn) {
      const str = util.format(message, ...args)
      this.write(Logger.numericLevels.warn, this._console.error,
        'warning: ' + str)
    }
  }

  /**
   * @category Output
   * @summary Log informative messages.
   *
   * @param message Message to log, as accepted by `util.format()`.
   * @param args Optional variable arguments.
   *
   * @description
   * Log informative messages, if the log level is `info` or higher.
   * The message is passed via `console.log()`.
   *
   * @example
   * ```javascript
   * log.info(title)
   * ```
   */
  info (message: any = '', ...args: any[]): void {
    if (this.levelNumericValue >= Logger.numericLevels.info) {
      const str = util.format(message, ...args)
      this.write(Logger.numericLevels.info, this._console.log, str)
    }
  }

  /**
   * @category Output
   * @summary Log informative messages.
   *
   * @param message Message to log, as accepted by `util.format()`.
   * @param args Optional variable arguments.
   *
   * @description
   * Log more informative messages, if the log level is `verbose` or higher.
   * The message is passed via `console.log()`.
   *
   * @example
   * ```javascript
   * log.verbose('Configurations:')
   * ```
   */
  verbose (message: any = '', ...args: any[]): void {
    if (this.levelNumericValue >= Logger.numericLevels.verbose) {
      const str = util.format(message, ...args)
      this.write(Logger.numericLevels.verbose, this._console.log, str)
    }
  }

  /**
   * @category Output
   * @summary Log debug messages.
   *
   * @param message Message to log, as accepted by `util.format()`.
   * @param args Optional variable arguments.
   *
   * @description
   * Log debug messages, if the log level is `'debug'` or higher.
   * The message is prefixed with `debug: ` and
   * passed via `console.log()`.
   *
   * @example
   * ```javascript
   * log.debug(`spawn: ${cmd}`)
   * ```
   */
  debug (message: any = '', ...args: any[]): void {
    if (this.levelNumericValue >= Logger.numericLevels.debug) {
      const str = util.format(message, ...args)
      this.write(Logger.numericLevels.debug, this._console.log,
        'debug: ' + str)
    }
  }

  /**
   * @category Output
   * @summary Log trace messages.
   *
   * @param message Message to log, as accepted by `util.format()`.
   * @param args Optional variable arguments.
   *
   * @description
   * Log trace messages, if the log level is `trace` or higher.
   * The message is prefixed with `trace: ` and
   * passed via `console.log()`.
   *
   * @example
   * ```javascript
   * log.trace(`${this.constructor.name}.doRun()`)
   * ```
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
