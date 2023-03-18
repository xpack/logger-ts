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

/* eslint max-len: [ "error", 80, { "ignoreUrls": true } ] */

// ----------------------------------------------------------------------------

/**
 * Test the is<level> functions.
 */

// ----------------------------------------------------------------------------

import { strict as assert } from 'node:assert'

// The `[node-tap](http://www.node-tap.org)` framework.
import { test } from 'tap'

import { MockConsole } from '../mocks/mock-console.js'
import { Logger } from '../../src/index.js'

assert(Logger)

// ----------------------------------------------------------------------------

await test('logger level all', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
    level: 'all'
  })
  t.equal(logger.level, 'all', 'level')

  mockConsole.clear()

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

await test('logger level trace', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
    level: 'trace'
  })
  t.equal(logger.level, 'trace', 'level')

  mockConsole.clear()

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

await test('logger level debug', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
    level: 'debug'
  })
  t.equal(logger.level, 'debug', 'level')

  mockConsole.clear()

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

await test('logger level verbose', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
    level: 'verbose'
  })
  t.equal(logger.level, 'verbose', 'level')

  mockConsole.clear()

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

await test('logger level info', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
    level: 'info'
  })
  t.equal(logger.level, 'info', 'level')

  mockConsole.clear()

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

await test('logger level warn', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
    level: 'warn'
  })
  t.equal(logger.level, 'warn', 'level')

  mockConsole.clear()

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

await test('logger level error', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
    level: 'error'
  })
  t.equal(logger.level, 'error', 'level')

  mockConsole.clear()

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

await test('logger level silent', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
    level: 'silent'
  })
  t.equal(logger.level, 'silent', 'level')

  mockConsole.clear()

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

await test('logger isLevel', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
    level: 'info'
  })
  t.equal(logger.level, 'info', 'level')

  mockConsole.clear()

  t.notOk(logger.isLevel('all'), 'is not All')
  t.notOk(logger.isLevel('trace'), 'is not Trace')
  t.notOk(logger.isLevel('debug'), 'is not Debug')
  t.notOk(logger.isLevel('verbose'), 'is not Verbose')
  t.ok(logger.isLevel('info'), 'is Info')
  t.ok(logger.isLevel('warn'), 'is Warn')
  t.ok(logger.isLevel('error'), 'is Error')
  t.ok(logger.isLevel('silent'), 'is Silent')

  t.end()
})

// ----------------------------------------------------------------------------
