/*
 * This file is part of the xPack project (http://xpack.github.io).
 * Copyright (c) 2017 Liviu Ionescu. All rights reserved.
 *
 * Licensed under the terms of the MIT License.
 * See LICENSE in the project root for license information.
 */

/* eslint valid-jsdoc: "error" */
/* eslint max-len: [ "error", 80, { "ignoreUrls": true } ] */

// ----------------------------------------------------------------------------

/**
 * Test the is<level> functions.
 */

// ----------------------------------------------------------------------------

import { strict as assert } from 'node:assert'

// The `[node-tap](http://www.node-tap.org)` framework.
import { test } from 'tap'

import { Mock } from '../mock-console.js'
import { Logger } from '../../dist/index.js'

assert(Logger)

// ----------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-floating-promises
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

// eslint-disable-next-line @typescript-eslint/no-floating-promises
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

// eslint-disable-next-line @typescript-eslint/no-floating-promises
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

// eslint-disable-next-line @typescript-eslint/no-floating-promises
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

// eslint-disable-next-line @typescript-eslint/no-floating-promises
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

// eslint-disable-next-line @typescript-eslint/no-floating-promises
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

// eslint-disable-next-line @typescript-eslint/no-floating-promises
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

// eslint-disable-next-line @typescript-eslint/no-floating-promises
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
