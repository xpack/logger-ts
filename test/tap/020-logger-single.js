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

test('logger level', (t) => {
  const mock = new Mock()
  const logger = new Logger({
    console: mock.console
  })
  t.true(!logger.hasLevel(), 'is uninitialised')
  t.equal(logger.level, 'undefined', 'default level')
  logger.level = 'trace'
  t.true(logger.hasLevel(), 'is initialised')
  t.equal(logger.level, 'trace', 'set level')
  t.equal(Logger.defaultLevel, 'info', 'has default')
  try {
    logger.level = 'xyz'
  } catch (err) {
    t.match(err.name, 'AssertionError', 'assert')
  }
  t.end()
})

test('logger level all', (t) => {
  const mock = new Mock()
  const logger = new Logger({
    console: mock.console, level: 'all'
  })
  t.equal(logger.level, 'all', 'level')

  mock.clear()
  logger.trace('trace')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'trace: trace\n', 'stdout is trace')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.debug('debug')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'debug: debug\n', 'stdout is debug')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.verbose('verbose')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'verbose\n', 'stdout is verbose')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.info('info')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'info\n', 'stdout is info')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.warn('warn')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 1, 'stderr has one entry')
  t.equal(mock.stderr[0], 'warning: warn\n', 'stderr is warn')

  mock.clear()
  logger.error('error')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 1, 'stderr has one entry')
  t.equal(mock.stderr[0], 'error: error\n', 'stderr is error')

  mock.clear()
  logger.output('output')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'output\n', 'stdout is output')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.always('always')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'always\n', 'stdout is always')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  t.end()
})

test('logger level trace', (t) => {
  const mock = new Mock()
  const logger = new Logger({
    console: mock.console,
    level: 'trace'
  })
  t.equal(logger.level, 'trace', 'level')

  mock.clear()
  logger.trace('trace')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'trace: trace\n', 'stdout is trace')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.debug('debug')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'debug: debug\n', 'stdout is debug')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.verbose('verbose')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'verbose\n', 'stdout is verbose')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.info('info')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'info\n', 'stdout is info')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.warn('warn')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 1, 'stderr has one entry')
  t.equal(mock.stderr[0], 'warning: warn\n', 'stderr is warn')

  mock.clear()
  logger.error('error')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 1, 'stderr has one entry')
  t.equal(mock.stderr[0], 'error: error\n', 'stderr is error')

  mock.clear()
  logger.output('output')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'output\n', 'stdout is output')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.always('always')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'always\n', 'stdout is always')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  t.end()
})

test('logger level debug', (t) => {
  const mock = new Mock()
  const logger = new Logger({
    console: mock.console,
    level: 'debug'
  })
  t.equal(logger.level, 'debug', 'level')

  mock.clear()
  logger.trace('trace')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.debug('debug')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'debug: debug\n', 'stdout is debug')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.verbose('verbose')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'verbose\n', 'stdout is verbose')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.info('info')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'info\n', 'stdout is info')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.warn('warn')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 1, 'stderr has one entry')
  t.equal(mock.stderr[0], 'warning: warn\n', 'stderr is warn')

  mock.clear()
  logger.error('error')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 1, 'stderr has one entry')
  t.equal(mock.stderr[0], 'error: error\n', 'stderr is error')

  mock.clear()
  logger.output('output')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'output\n', 'stdout is output')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.always('always')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'always\n', 'stdout is always')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  t.end()
})

test('logger level verbose', (t) => {
  const mock = new Mock()
  const logger = new Logger({
    console: mock.console,
    level: 'verbose'
  })
  t.equal(logger.level, 'verbose', 'level')

  mock.clear()
  logger.trace('trace')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.debug('debug')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.verbose('verbose')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'verbose\n', 'stdout is verbose')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.info('info')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'info\n', 'stdout is info')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.warn('warn')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 1, 'stderr has one entry')
  t.equal(mock.stderr[0], 'warning: warn\n', 'stderr is warn')

  mock.clear()
  logger.error('error')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 1, 'stderr has one entry')
  t.equal(mock.stderr[0], 'error: error\n', 'stderr is error')

  mock.clear()
  logger.output('output')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'output\n', 'stdout is output')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.always('always')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'always\n', 'stdout is always')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  t.end()
})

test('logger level info', (t) => {
  const mock = new Mock()
  const logger = new Logger({
    console: mock.console,
    level: 'info'
  })
  t.equal(logger.level, 'info', 'level')

  mock.clear()
  logger.trace('trace')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.debug('debug')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.verbose('verbose')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.info('info')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'info\n', 'stdout is info')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.warn('warn')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 1, 'stderr has one entry')
  t.equal(mock.stderr[0], 'warning: warn\n', 'stderr is warn')

  mock.clear()
  logger.error('error')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 1, 'stderr has one entry')
  t.equal(mock.stderr[0], 'error: error\n', 'stderr is error')

  mock.clear()
  logger.output('output')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'output\n', 'stdout is output')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.always('always')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'always\n', 'stdout is always')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  t.end()
})

test('logger level warn', (t) => {
  const mock = new Mock()
  const logger = new Logger({
    console: mock.console,
    level: 'warn'
  })
  t.equal(logger.level, 'warn', 'level')

  mock.clear()
  logger.trace('trace')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.debug('debug')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.verbose('verbose')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.info('info')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.warn('warn')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 1, 'stderr has one entry')
  t.equal(mock.stderr[0], 'warning: warn\n', 'stderr is warn')

  mock.clear()
  logger.error('error')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 1, 'stderr has one entry')
  t.equal(mock.stderr[0], 'error: error\n', 'stderr is error')

  mock.clear()
  logger.output('output')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'output\n', 'stdout is output')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.always('always')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'always\n', 'stdout is always')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  t.end()
})

test('logger level error', (t) => {
  const mock = new Mock()
  const logger = new Logger({
    console: mock.console,
    level: 'error'
  })
  t.equal(logger.level, 'error', 'level')

  mock.clear()
  logger.trace('trace')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.debug('debug')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.verbose('verbose')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.info('info')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.warn('warn')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.error('error')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 1, 'stderr has one entry')
  t.equal(mock.stderr[0], 'error: error\n', 'stderr is error')

  mock.clear()
  logger.output('output')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'output\n', 'stdout is output')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.always('always')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'always\n', 'stdout is always')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  t.end()
})

test('logger level silent', (t) => {
  const mock = new Mock()
  const logger = new Logger({
    console: mock.console,
    level: 'silent'
  })
  t.equal(logger.level, 'silent', 'level')

  mock.clear()
  logger.trace('trace')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.debug('debug')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.verbose('verbose')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.info('info')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.warn('warn')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.error('error')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.output('output')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.always('always')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'always\n', 'stdout is always')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  t.end()
})

test('logger error exception', (t) => {
  const mock = new Mock()
  const logger = new Logger({
    console: mock.console,
    level: 'info'
  })
  logger.error(new Error('msg'))
  // console.log(mc.stderr)
  const errLines = mock.stderr[0].split(/\r?\n/)
  t.equal(errLines[0], 'Error: msg', 'stderr[0] is msg')
  t.match(errLines[1], 'at Test.test', 'stderr[1] is at Test')

  t.end()
})

// ----------------------------------------------------------------------------
