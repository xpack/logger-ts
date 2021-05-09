/*
 * This file is part of the xPack distribution
 *   (http://xpack.github.io).
 * Copyright (c) 2018 Liviu Ionescu.
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
 * Test the is<level> functions.
 */

// ----------------------------------------------------------------------------

const assert = require('assert')

// The `[node-tap](http://www.node-tap.org)` framework.
const test = require('tap').test

const { Mock } = require('../mock-console.js')
const { Logger } = require('../../dist/index.js')

assert(Logger)

// ----------------------------------------------------------------------------

test('logger level all', (t) => {
  const mock = new Mock()
  const logger = new Logger({
    console: mock.console,
    level: 'all'
  })
  t.equal(logger.level, 'all', 'level')

  mock.clear()

  t.ok(logger.isAll, 'is All')
  t.ok(logger.isTrace, 'is Trace')
  t.ok(logger.isDebug, 'is Debug')
  t.ok(logger.isVerbose, 'is Verbose')
  t.ok(logger.isInfo, 'is Info')
  t.ok(logger.isError, 'is Error')
  t.ok(logger.isWarn, 'is Warn')
  t.ok(logger.isSilent, 'is Silent')

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

  t.notOk(logger.isAll, 'is not All')
  t.ok(logger.isTrace, 'is Trace')
  t.ok(logger.isDebug, 'is Debug')
  t.ok(logger.isVerbose, 'is Verbose')
  t.ok(logger.isInfo, 'is Info')
  t.ok(logger.isError, 'is Error')
  t.ok(logger.isWarn, 'is Warn')
  t.ok(logger.isSilent, 'is Silent')

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

  t.notOk(logger.isAll, 'is not All')
  t.notOk(logger.isTrace, 'is not Trace')
  t.ok(logger.isDebug, 'is Debug')
  t.ok(logger.isVerbose, 'is Verbose')
  t.ok(logger.isInfo, 'is Info')
  t.ok(logger.isError, 'is Error')
  t.ok(logger.isWarn, 'is Warn')
  t.ok(logger.isSilent, 'is Silent')

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

  t.notOk(logger.isAll, 'is not All')
  t.notOk(logger.isTrace, 'is not Trace')
  t.notOk(logger.isDebug, 'is not Debug')
  t.ok(logger.isVerbose, 'is Verbose')
  t.ok(logger.isInfo, 'is Info')
  t.ok(logger.isWarn, 'is Warn')
  t.ok(logger.isError, 'is Error')
  t.ok(logger.isSilent, 'is Silent')

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

  t.notOk(logger.isAll, 'is not All')
  t.notOk(logger.isTrace, 'is not Trace')
  t.notOk(logger.isDebug, 'is not Debug')
  t.notOk(logger.isVerbose, 'is not Verbose')
  t.ok(logger.isInfo, 'is Info')
  t.ok(logger.isWarn, 'is Warn')
  t.ok(logger.isError, 'is Error')
  t.ok(logger.isSilent, 'is Silent')

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

  t.notOk(logger.isAll, 'is not All')
  t.notOk(logger.isTrace, 'is not Trace')
  t.notOk(logger.isDebug, 'is not Debug')
  t.notOk(logger.isVerbose, 'is not Verbose')
  t.notOk(logger.isInfo, 'is not Info')
  t.ok(logger.isWarn, 'is Warn')
  t.ok(logger.isError, 'is Error')
  t.ok(logger.isSilent, 'is Silent')

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

  t.notOk(logger.isAll, 'is not All')
  t.notOk(logger.isTrace, 'is not Trace')
  t.notOk(logger.isDebug, 'is not Debug')
  t.notOk(logger.isVerbose, 'is not Verbose')
  t.notOk(logger.isInfo, 'is not Info')
  t.notOk(logger.isWarn, 'is not Warn')
  t.ok(logger.isError, 'is Error')
  t.ok(logger.isSilent, 'is Silent')

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

  t.notOk(logger.isAll, 'is not All')
  t.notOk(logger.isTrace, 'is not Trace')
  t.notOk(logger.isDebug, 'is not Debug')
  t.notOk(logger.isVerbose, 'is not Verbose')
  t.notOk(logger.isInfo, 'is not Info')
  t.notOk(logger.isWarn, 'is not Warn')
  t.notOk(logger.isError, 'is not Error')
  t.ok(logger.isSilent, 'is Silent')

  t.end()
})

// ----------------------------------------------------------------------------
