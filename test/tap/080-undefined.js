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

/**
 * Test the logger.
 */

// ----------------------------------------------------------------------------

const assert = require('assert')

// The `[node-tap](http://www.node-tap.org)` framework.
const test = require('tap').test

const Mock = require('../mock-console.js').Mock

const Logger = require('../../index.js').Logger

assert(Logger)

// ----------------------------------------------------------------------------

test('logger undefined', (t) => {
  const mock = new Mock()
  const logger = new Logger({
    console: mock.console
  })
  t.equal(logger.level, 'undefined', 'level')

  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  logger.level = 'info'
  t.equal(logger.level, 'info', 'level')

  logger.write_(logger.level, logger.private_.console.log, undefined)

  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  t.end()
})

test('logger level warn', (t) => {
  const mock = new Mock()
  const logger = new Logger({
    console: mock.console
  })
  t.equal(logger.level, 'undefined', 'level')

  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  logger.trace('trace')
  logger.debug('debug')
  logger.verbose('verbose')
  logger.info('info')
  logger.warn('warn')
  logger.error('error')
  logger.output('output')
  logger.always('always')

  // Nothing changed.
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  logger.level = 'warn'
  t.equal(logger.level, 'warn', 'level')

  t.equal(mock.stdout.length, 2, 'stdout has 2 entries')
  t.equal(mock.stderr.length, 2, 'stderr has 2 entries')

  t.equal(mock.stdout[0], 'output\n', 'stdout is output')
  t.equal(mock.stdout[1], 'always\n', 'stdout is always')

  t.equal(mock.stderr[0], 'warning: warn\n', 'stderr is warn')
  t.equal(mock.stderr[1], 'error: error\n', 'stderr is error')

  t.end()
})

test('logger level error', (t) => {
  const mock = new Mock()
  const logger = new Logger({
    console: mock.console
  })
  t.equal(logger.level, 'undefined', 'level')

  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  logger.trace('trace')
  logger.debug('debug')
  logger.verbose('verbose')
  logger.info('info')
  logger.warn('warn')
  logger.error('error')
  logger.output('output')
  logger.always('always')

  // Nothing changed.
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  logger.level = 'error'
  t.equal(logger.level, 'error', 'level')

  t.equal(mock.stdout.length, 2, 'stdout has 2 entries')
  t.equal(mock.stderr.length, 1, 'stderr has 1 entry')

  t.equal(mock.stdout[0], 'output\n', 'stdout is output')
  t.equal(mock.stdout[1], 'always\n', 'stdout is always')

  t.equal(mock.stderr[0], 'error: error\n', 'stderr is error')

  t.end()
})

test('logger level silent', (t) => {
  const mock = new Mock()
  const logger = new Logger({
    console: mock.console
  })
  t.equal(logger.level, 'undefined', 'level')

  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  logger.trace('trace')
  logger.debug('debug')
  logger.verbose('verbose')
  logger.info('info')
  logger.warn('warn')
  logger.error('error')
  logger.output('output')
  logger.always('always')

  // Nothing changed.
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  logger.level = 'silent'
  t.equal(logger.level, 'silent', 'level')

  t.equal(mock.stdout.length, 1, 'stdout has 1 entry')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  t.equal(mock.stdout[0], 'always\n', 'stdout is always')

  t.end()
})

// ----------------------------------------------------------------------------
