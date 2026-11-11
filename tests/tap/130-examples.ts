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

// ----------------------------------------------------------------------------

/**
 * Test the examples given in the TSDoc comments, so that they do not
 * become wrong.
 */

// ----------------------------------------------------------------------------

// https://www.npmjs.com/package/tap
import { test } from 'tap'

// https://www.npmjs.com/package/@xpack/mock-console
import { MockConsole } from '@xpack/mock-console'

// ----------------------------------------------------------------------------

import { Logger, type LogLevel } from '../../src/index.js'

// ----------------------------------------------------------------------------

// The example of the description of the class: check the level before
// a long loop.
function logFolders(log: Logger, folders: Record<string, string>): void {
  if (log.isTrace) {
    for (const [folderName, folder] of Object.entries(folders)) {
      log.trace(`'${folderName}' ${folder}`)
    }
  }
}

await test('class example: the guard matches the logged level', (t) => {
  const folders = { a: 'x', b: 'y' }

  const traceConsole = new MockConsole()
  const traceLogger = new Logger({ console: traceConsole, level: 'trace' })
  traceConsole.clear()
  logFolders(traceLogger, folders)
  t.same(
    traceConsole.outLines,
    ["trace: 'a' x", "trace: 'b' y"],
    'the messages are written at trace'
  )

  // At `debug` the guard is false, so the loop is skipped; with the
  // `isVerbose` guard the loop would run, only to have every message
  // discarded by `trace()`.
  const debugConsole = new MockConsole()
  const debugLogger = new Logger({ console: debugConsole, level: 'debug' })
  debugConsole.clear()
  logFolders(debugLogger, folders)
  t.equal(debugLogger.isTrace, false, 'the guard is false at debug')
  t.equal(debugConsole.outLines.length, 0, 'nothing is written at debug')

  t.end()
})

// The example of `hasLevel`.
function setDefaultLevel(log: Logger): void {
  if (!log.hasLevel) {
    log.level = Logger.defaultLevel
  }
}

await test('hasLevel example: set the default level', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({ console: mockConsole })

  setDefaultLevel(logger)
  t.equal(logger.level, Logger.defaultLevel, 'default level is set')

  const level: LogLevel = 'debug'
  const explicit = new Logger({ console: mockConsole, level })
  setDefaultLevel(explicit)
  t.equal(explicit.level, 'debug', 'an explicit level is kept')

  t.end()
})

await test('warn example', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({ console: mockConsole, level: 'warn' })
  mockConsole.clear()

  logger.warn('The configuration file is missing, using the defaults')

  t.same(
    mockConsole.errLines,
    ['warning: The configuration file is missing, using the defaults'],
    'the warning is written on stderr'
  )
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')

  t.end()
})

// ----------------------------------------------------------------------------
