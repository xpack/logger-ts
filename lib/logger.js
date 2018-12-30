/*
 * This file is part of the xPack distribution
 *   (http://xpack.github.io).
 * Copyright (c) 2017 Liviu Ionescu.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

'use strict'
/* eslint valid-jsdoc: "error" */
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

const assert = require('assert')
const util = require('util')

// ============================================================================

/**
 * @summary Allowed values for the log level.
 */
const numLevel = {
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
const undefinedNumLevel = Infinity

/**
 * @summary The value used for the always case (minimum value).
 */
const alwaysNumLevel = -1

// export
class Logger {
  // --------------------------------------------------------------------------

  /**
   * @summary Create a logger instance for a given console.
   *
   * @param {Object} console Reference to a console (an object with at least
   *  two functions, `log()` and `error()`)
   * @param {String} level A log level; may be undefined and set later.
   *
   * @description
   * If the log level is undefined, the logger is created in a preliminary
   * state, when all log lines will be stored in an internal buffer,
   * until the log level is known.
   */
  constructor (console, level = undefined) {
    assert(console)
    if (level !== undefined) {
      assert(level in numLevel)
    }

    this.private_ = {}
    this.private_.console = console

    // Empty buffer where preliminary lines will be stored.
    // Must be set before `this.level = ...`, since the setter
    this.private_.buffer = []

    if (level !== undefined) {
      // Use the setter.
      this.level = level
    } else {
      // Set to the highest possible value.
      this.private_.numLevel = undefinedNumLevel
      this.private_.level = 'undefined'
    }

    this.trace(`${this.constructor.name}.constructor()`)
  }

  // --------------------------------------------------------------------------
  /**
   * @summary Setter for the log level.
   *
   * @param {String} level The new log level.
   *
   * @description
   * If the log level is not one of the known strings, an assert will fire.
   * The first time the level is set, the internal buffer is flushed.
   */
  set level (level) {
    assert(numLevel.hasOwnProperty(level),
      `Log level '${level}' not supported.`)

    this.private_.numLevel = numLevel[level]
    this.private_.level = level

    // FLush internal buffer.
    if (this.private_.buffer.length > 0) {
      this.private_.buffer.forEach((val) => {
        if (this.private_.numLevel >= val.level) {
          val.func(val.message)
        }
      })

      // Clear the buffer.
      this.private_.buffer = []
    }
  }

  /**
   * @summary Getter for the log level
   *
   * @returns {String} The log level.
   */
  get level () {
    return this.private_.level
  }

  // --------------------------------------------------------------------------
  /**
   * @summary Internal log writer.
   *
   * @param {Number} numLevel The log numeric level.
   * @param {Function} func The function to be used to write the message.
   * @param {String} message The log message.
   * @returns {undefined} Nothing.
   *
   * @description
   * If the log level was defined, call the function, otherwise
   * store the log line details in the array buffer, for later
   * processing, when the log level is defined.
   *
   * @private
   */
  write_ (numLevel, func, message) {
    if (this.private_.numLevel !== undefinedNumLevel) {
      func(message)
    } else {
      // Store the log entry details in a buffer.
      this.private_.buffer.push({
        level: numLevel,
        func,
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
   * @returns {undefined} Nothing.
   *
   * @description
   * The message is always passed to the console, regardless the
   * log level.
   *
   * Use this instead of console.log(), which in Node.js always
   * refers to the process console, not the possible REPL streams.
   */
  always (msg = '', ...args) {
    const str = util.format(msg, ...args)
    this.write_(alwaysNumLevel, this.private_.console.log, str)
  }

  error (msg = '', ...args) {
    if (this.private_.numLevel >= numLevel.error) {
      if (msg instanceof Error) {
        const str = util.format(msg, ...args)
        this.write_(numLevel.error, this.private_.console.error, str)
      } else {
        const str = util.format(msg, ...args)
        this.write_(numLevel.error, this.private_.console.error,
          'error: ' + str)
      }
    }
  }

  output (msg = '', ...args) {
    if (this.private_.numLevel >= numLevel.error) {
      const str = util.format(msg, ...args)
      this.write_(numLevel.error, this.private_.console.log, str)
    }
  }

  warn (msg = '', ...args) {
    if (this.private_.numLevel >= numLevel.warn) {
      const str = util.format(msg, ...args)
      this.write_(numLevel.warn, this.private_.console.error, 'warning: ' + str)
    }
  }

  info (msg = '', ...args) {
    if (this.private_.numLevel >= numLevel.info) {
      const str = util.format(msg, ...args)
      this.write_(numLevel.info, this.private_.console.log, str)
    }
  }

  verbose (msg = '', ...args) {
    if (this.private_.numLevel >= numLevel.verbose) {
      const str = util.format(msg, ...args)
      this.write_(numLevel.verbose, this.private_.console.log, str)
    }
  }

  debug (msg = '', ...args) {
    if (this.private_.numLevel >= numLevel.debug) {
      const str = util.format(msg, ...args)
      this.write_(numLevel.debug, this.private_.console.log, 'debug: ' + str)
    }
  }

  trace (msg = '', ...args) {
    if (this.private_.numLevel >= numLevel.trace) {
      const str = util.format(msg, ...args)
      this.write_(numLevel.trace, this.private_.console.log, 'trace: ' + str)
    }
  }

  // --------------------------------------------------------------------------

  isSilent () {
    return this.private_.numLevel >= numLevel.silent
  }

  isError () {
    return this.private_.numLevel >= numLevel.error
  }

  isWarn () {
    return this.private_.numLevel >= numLevel.warn
  }

  isInfo () {
    return this.private_.numLevel >= numLevel.info
  }

  isVerbose () {
    return this.private_.numLevel >= numLevel.verbose
  }

  isDebug () {
    return this.private_.numLevel >= numLevel.debug
  }

  isTrace () {
    return this.private_.numLevel >= numLevel.trace
  }

  isAll () {
    return this.private_.numLevel >= numLevel.all
  }

  // --------------------------------------------------------------------------
}

// ----------------------------------------------------------------------------
// Node.js specific export definitions.

// By default, `module.exports = {}`.
// The class is added as a property of this object.
module.exports.Logger = Logger

// In ES6, it would be:
// export class Logger { ... }
// ...
// import { Logger } from 'logger.js'

// ----------------------------------------------------------------------------
