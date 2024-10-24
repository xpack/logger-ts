/*
 * This file is part of the xPack project (http://xpack.github.io).
 * Copyright (c) 2017 Liviu Ionescu. All rights reserved.
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
 * Test the logger.
 */

// ----------------------------------------------------------------------------

// import { strict as assert } from 'node:assert'

// ----------------------------------------------------------------------------

// https://www.npmjs.com/package/tap
import { test } from 'tap'

// https://www.npmjs.com/package/@xpack/mock-console
import { MockConsole } from '@xpack/mock-console'

// ----------------------------------------------------------------------------

import { Logger } from '../../src/index.js'

// ----------------------------------------------------------------------------

await test('logger level all empty', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
    level: 'all'
  })
  t.equal(logger.level, 'all', 'level')

  mockConsole.clear()
  logger.trace()
  t.equal(mockConsole.outLines.length, 1, 'stdout has one entry')
  t.equal(mockConsole.outLines[0], 'trace: ', 'stdout is trace')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.debug()
  t.equal(mockConsole.outLines.length, 1, 'stdout has one entry')
  t.equal(mockConsole.outLines[0], 'debug: ', 'stdout is debug')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.verbose()
  t.equal(mockConsole.outLines.length, 1, 'stdout has one entry')
  t.equal(mockConsole.outLines[0], '', 'stdout is verbose')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.info()
  t.equal(mockConsole.outLines.length, 1, 'stdout has one entry')
  t.equal(mockConsole.outLines[0], '', 'stdout is info')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.warn()
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 1, 'stderr has one entry')
  t.equal(mockConsole.errLines[0], 'warning: ', 'stderr is warn')

  mockConsole.clear()
  logger.error()
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 1, 'stderr has one entry')
  t.equal(mockConsole.errLines[0], 'error: ', 'stderr is error')

  mockConsole.clear()
  logger.output()
  t.equal(mockConsole.outLines.length, 1, 'stdout has one entry')
  t.equal(mockConsole.outLines[0], '', 'stdout is nl')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.always()
  t.equal(mockConsole.outLines.length, 1, 'stdout has one entry')
  t.equal(mockConsole.outLines[0], '', 'stdout is nl')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  t.end()
})

// ----------------------------------------------------------------------------
