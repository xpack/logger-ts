/*
 * This file is part of the xPack project (http://xpack.github.io).
 * Copyright (c) 2017 Liviu Ionescu. All rights reserved.
 *
 * Licensed under the terms of the MIT License.
 * See LICENSE in the project root for license information.
 */

/* eslint max-len: [ "error", 80, { "ignoreUrls": true } ] */

// ----------------------------------------------------------------------------

/*
 * This file implements a generic console logger.
 *
 * Use `log.always()` instead of the `console.log()`, since it accounts for
 * different contexts, created for instance when using REPL.
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

import * as assert from 'assert'
import * as util from 'util'

// ----------------------------------------------------------------------------
// Public Types.

export type LogLevel =
  'silent' | 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'trace' | 'all'

export type NumericLogLevel = number

export interface LoggerParameters {
  level?: LogLevel
  console?: Console
}

// Private Types.

type LoggerFunction = (message: string) => void

interface LoggerBufferRecord {
  func: LoggerFunction
  numericLevel: NumericLogLevel
  message: string
}

// ============================================================================

export class Logger {
  // --------------------------------------------------------------------------
  // Static Members.

  static defaultLevel: LogLevel = 'info'

  /**
   * @summary Internal numerical values for the log level.
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
   * @summary The value used for the undefined log level (maximum value).
   */
  static numericLevelUndefined: NumericLogLevel = Infinity

  /**
   * @summary The value used for the always case (minimum value).
   */
  static numericLevelAlways: NumericLogLevel = -1

  // --------------------------------------------------------------------------
  // Members.

  private readonly _console: Console = console
  private _numericLevel: NumericLogLevel = Logger.numericLevelUndefined
  private _level: LogLevel | undefined = undefined

  // Empty buffer where preliminary lines will be stored.
  private _buffer: LoggerBufferRecord[] = []

  // --------------------------------------------------------------------------
  // Constructor.

  /**
   * @summary Create a logger instance for a given console.
   *
   * @param {LoggerParameters} params The generic params object.
   * @param {Console} params.console Reference to a console (an object with at
   *  least two functions, `log()` and `error()`)
   * @param {LogLevel} params.level A log level; may be undefined and set later.
   *
   * @description
   * If the log level is undefined, the logger is created in a preliminary
   * state, when all log lines will be stored in an internal buffer,
   * until the log level is known.
   *
   * If no `console` is given, the system `console` is used.
   */
  constructor (params: LoggerParameters = {}) {
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
  // Getters & setters.

  get hasLevel (): boolean {
    return this._numericLevel !== Logger.numericLevelUndefined
  }

  /**
   * @summary Setter for the log level.
   *
   * @param {LogLevel} level The new log level.
   *
   * @description
   * If the log level is not one of the known strings, an assert will fire.
   * The first time the level is set, the internal buffer is flushed.
   */
  set level (level: LogLevel | undefined) {
    assert(level)
    assert(Object.prototype.hasOwnProperty.call(Logger.numericLevels, level),
      `Log level '${level}' not supported.`)

    this._numericLevel = Logger.numericLevels[level]
    this._level = level

    // FLush the internal buffer.
    if (this._buffer.length > 0) {
      this._buffer.forEach(
        (record) => {
          if (this._numericLevel >= record.numericLevel) {
            record.func(record.message)
          }
        })

      // Clear the buffer.
      this._buffer = []
    }
  }

  /**
   * @summary Getter for the log level.
   *
   * @returns {LogLevel} The log level.
   */
  get level (): LogLevel | undefined {
    return this._level
  }

  // --------------------------------------------------------------------------
  // Changed to getters starting with v3.x.

  get isSilent (): boolean {
    return this._numericLevel >= Logger.numericLevels.silent
  }

  get isError (): boolean {
    return this._numericLevel >= Logger.numericLevels.error
  }

  get isWarn (): boolean {
    return this._numericLevel >= Logger.numericLevels.warn
  }

  get isInfo (): boolean {
    return this._numericLevel >= Logger.numericLevels.info
  }

  get isVerbose (): boolean {
    return this._numericLevel >= Logger.numericLevels.verbose
  }

  get isDebug (): boolean {
    return this._numericLevel >= Logger.numericLevels.debug
  }

  get isTrace (): boolean {
    return this._numericLevel >= Logger.numericLevels.trace
  }

  get isAll (): boolean {
    return this._numericLevel >= Logger.numericLevels.all
  }

  // --------------------------------------------------------------------------

  get console (): Console {
    return this._console
  }

  // --------------------------------------------------------------------------
  // Methods.

  /**
   * @summary Internal log writer.
   *
   * @param {NumericLogLevel} numericLevel The log numeric level.
   * @param {Function} loggerFunction The function to be used to write
   * the message.
   * @param {string} message The log message.
   * @returns {void} Nothing.
   *
   * @description
   * If the log level was defined, call the function, otherwise
   * store the log line details in the array buffer, for later
   * processing, when the log level is defined.
   *
   * @private
   */
  private write_ (
    numericLevel: NumericLogLevel,
    loggerFunction: LoggerFunction,
    message: string
  ): void {
    if (message === undefined || message === null) {
      // Ignore if nothing to write.
      return
    }
    if (this._numericLevel !== Logger.numericLevelUndefined) {
      // If the level was set, output the message.
      loggerFunction(message)
    } else {
      // Store the log entry details in the buffer.
      this._buffer.push({
        numericLevel,
        func: loggerFunction,
        message
      })
    }
  }

  // --------------------------------------------------------------------------

  /**
   * @summary Output always.
   *
   * @param {string} msg Message.
   * @param {*} args Possible arguments.
   * @returns {void} Nothing.
   *
   * @description
   * The message is always passed to the console, regardless the
   * log level.
   *
   * Use this instead of console.log(), which in Node.js always
   * refers to the process console, not the possible REPL streams.
   */
  always (msg: any = '', ...args: any[]): void {
    const str = util.format(msg, ...args)
    this.write_(Logger.numericLevelAlways, this._console.log, str)
  }

  error (msg: Error): void
  error (msg: any = '', ...args: any[]): void {
    if (this._numericLevel >= Logger.numericLevels.error) {
      if (msg instanceof Error) {
        const str = util.format(msg, ...args)
        this.write_(Logger.numericLevels.error, this._console.error, str)
      } else {
        const str = util.format(msg, ...args)
        this.write_(Logger.numericLevels.error, this._console.error,
          'error: ' + str)
      }
    }
  }

  output (msg: any = '', ...args: any[]): void {
    if (this._numericLevel >= Logger.numericLevels.error) {
      const str = util.format(msg, ...args)
      this.write_(Logger.numericLevels.error, this._console.log, str)
    }
  }

  warn (msg: any = '', ...args: any[]): void {
    if (this._numericLevel >= Logger.numericLevels.warn) {
      const str = util.format(msg, ...args)
      this.write_(Logger.numericLevels.warn, this._console.error,
        'warning: ' + str)
    }
  }

  info (msg: any = '', ...args: any[]): void {
    if (this._numericLevel >= Logger.numericLevels.info) {
      const str = util.format(msg, ...args)
      this.write_(Logger.numericLevels.info, this._console.log, str)
    }
  }

  verbose (msg: any = '', ...args: any[]): void {
    if (this._numericLevel >= Logger.numericLevels.verbose) {
      const str = util.format(msg, ...args)
      this.write_(Logger.numericLevels.verbose, this._console.log, str)
    }
  }

  debug (msg: any = '', ...args: any[]): void {
    if (this._numericLevel >= Logger.numericLevels.debug) {
      const str = util.format(msg, ...args)
      this.write_(Logger.numericLevels.debug, this._console.log,
        'debug: ' + str)
    }
  }

  trace (msg: any = '', ...args: any[]): void {
    if (this._numericLevel >= Logger.numericLevels.trace) {
      const str = util.format(msg, ...args)
      this.write_(Logger.numericLevels.trace, this._console.log,
        'trace: ' + str)
    }
  }

  // --------------------------------------------------------------------------
}

// ----------------------------------------------------------------------------
