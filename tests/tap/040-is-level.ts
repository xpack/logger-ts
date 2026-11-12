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
/* eslint-disable @typescript-eslint/no-deprecated --
   the test checks the deprecated isSilent */

// ----------------------------------------------------------------------------

/**
 * Test the is<level> functions.
 */

// ----------------------------------------------------------------------------

// https://www.npmjs.com/package/tap
import { test } from 'tap'

// https://www.npmjs.com/package/@xpack/mock-console
import { MockConsole } from '@xpack/mock-console'

// ----------------------------------------------------------------------------

import { Logger, type LogLevel } from '../../src/index.js'

// ----------------------------------------------------------------------------

await test('logger level all', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
    level: 'all',
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
    level: 'trace',
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
    level: 'debug',
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
    level: 'verbose',
  })
  t.equal(logger.level, 'verbose', 'level')

  mockConsole.clear()

  t.notOk(logger.isAll, 'is not All')
  t.notOk(logger.isTrace, 'is not Trace')
  t.notOk(logger.isDebug, 'is not Debug')
  t.ok(logger.isVerbose, 'is Verbose')
  t.ok(logger.isInfo, 'is Info')
  t.ok(logger.isWarn, 'is Warn')
  t.ok(logger.isWarning, 'is Warning')
  t.ok(logger.isError, 'is Error')
  t.ok(logger.isSilent, 'is Silent')

  t.end()
})

await test('logger level info', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
    level: 'info',
  })
  t.equal(logger.level, 'info', 'level')

  mockConsole.clear()

  t.notOk(logger.isAll, 'is not All')
  t.notOk(logger.isTrace, 'is not Trace')
  t.notOk(logger.isDebug, 'is not Debug')
  t.notOk(logger.isVerbose, 'is not Verbose')
  t.ok(logger.isInfo, 'is Info')
  t.ok(logger.isWarn, 'is Warn')
  t.ok(logger.isWarning, 'is Warning')
  t.ok(logger.isError, 'is Error')
  t.ok(logger.isSilent, 'is Silent')

  t.end()
})

await test('logger level warn', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
    level: 'warn',
  })
  t.equal(logger.level, 'warn', 'level')

  mockConsole.clear()

  t.notOk(logger.isAll, 'is not All')
  t.notOk(logger.isTrace, 'is not Trace')
  t.notOk(logger.isDebug, 'is not Debug')
  t.notOk(logger.isVerbose, 'is not Verbose')
  t.notOk(logger.isInfo, 'is not Info')
  t.ok(logger.isWarn, 'is Warn')
  t.ok(logger.isWarning, 'is Warning')
  t.ok(logger.isError, 'is Error')
  t.ok(logger.isSilent, 'is Silent')

  t.end()
})

await test('logger level error', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
    level: 'error',
  })
  t.equal(logger.level, 'error', 'level')

  mockConsole.clear()

  t.notOk(logger.isAll, 'is not All')
  t.notOk(logger.isTrace, 'is not Trace')
  t.notOk(logger.isDebug, 'is not Debug')
  t.notOk(logger.isVerbose, 'is not Verbose')
  t.notOk(logger.isInfo, 'is not Info')
  t.notOk(logger.isWarn, 'is not Warn')
  t.notOk(logger.isWarning, 'is not Warning')
  t.ok(logger.isError, 'is Error')
  t.ok(logger.isSilent, 'is Silent')

  t.end()
})

await test('logger level silent', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
    level: 'silent',
  })
  t.equal(logger.level, 'silent', 'level')

  mockConsole.clear()

  t.notOk(logger.isAll, 'is not All')
  t.notOk(logger.isTrace, 'is not Trace')
  t.notOk(logger.isDebug, 'is not Debug')
  t.notOk(logger.isVerbose, 'is not Verbose')
  t.notOk(logger.isInfo, 'is not Info')
  t.notOk(logger.isWarn, 'is not Warn')
  t.notOk(logger.isWarning, 'is not Warning')
  t.notOk(logger.isError, 'is not Error')
  t.ok(logger.isSilent, 'is Silent')

  t.end()
})

await test('logger isLevel', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
    level: 'info',
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

await test('logger preliminary state checks', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
  })
  t.notOk(logger.hasLevel, 'has no level')

  // All checks are true until the level is set.
  t.ok(logger.isAll, 'is All')
  t.ok(logger.isTrace, 'is Trace')
  t.ok(logger.isDebug, 'is Debug')
  t.ok(logger.isVerbose, 'is Verbose')
  t.ok(logger.isInfo, 'is Info')
  t.ok(logger.isWarn, 'is Warn')
  t.ok(logger.isWarning, 'is Warning')
  t.ok(logger.isError, 'is Error')
  t.ok(logger.isSilent, 'is Silent')

  for (const level of Object.keys(Logger.numericLevels) as LogLevel[]) {
    t.ok(logger.isLevel(level), `isLevel('${level}')`)
  }

  t.end()
})

await test('logger preliminary state guarded message kept', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
  })

  if (logger.isDebug) {
    logger.debug('guarded')
  }
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')

  logger.level = 'debug'
  t.equal(mockConsole.outLines.length, 1, 'stdout has 1 entry')
  t.equal(mockConsole.outLines[0], 'debug: guarded', 'stdout is guarded')

  t.end()
})

await test('logger preliminary state guarded message filtered', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
  })

  if (logger.isDebug) {
    logger.debug('guarded')
  }

  logger.level = 'info'
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')

  t.end()
})

await test('logger silent level check', (t) => {
  const mockConsole = new MockConsole()

  for (const level of Object.keys(Logger.numericLevels) as LogLevel[]) {
    const logger = new Logger({
      console: mockConsole,
      level,
    })

    // The deprecated accessor is true for every level.
    t.ok(logger.isSilent, `isSilent at '${level}'`)
    // The documented replacement tells the silent level apart.
    t.equal(logger.level === 'silent', level === 'silent', `silent '${level}'`)
  }

  const preliminary = new Logger({
    console: mockConsole,
  })
  t.ok(preliminary.isSilent, 'isSilent in preliminary state')
  t.notOk(preliminary.level === 'silent', 'not silent in preliminary state')

  t.end()
})

// The documented pattern to set a level without decreasing it.
function raiseLevel(logger: Logger, newLevel: LogLevel): void {
  if (!logger.hasLevel || !logger.isLevel(newLevel)) {
    logger.level = newLevel
  }
}

await test('logger isLevel not decreased', (t) => {
  const mockConsole = new MockConsole()

  const preliminary = new Logger({
    console: mockConsole,
  })
  preliminary.info('buffered')
  raiseLevel(preliminary, 'info')
  t.equal(preliminary.level, 'info', 'preliminary level set')
  t.ok(preliminary.hasLevel, 'preliminary has level')
  t.equal(mockConsole.outLines.length, 1, 'stdout has 1 entry')
  t.equal(mockConsole.outLines[0], 'buffered', 'stdout is buffered')

  const higher = new Logger({
    console: mockConsole,
    level: 'debug',
  })
  raiseLevel(higher, 'info')
  t.equal(higher.level, 'debug', 'higher level kept')

  const lower = new Logger({
    console: mockConsole,
    level: 'info',
  })
  raiseLevel(lower, 'trace')
  t.equal(lower.level, 'trace', 'lower level raised')

  t.end()
})

// ----------------------------------------------------------------------------
