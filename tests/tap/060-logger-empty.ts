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

import { strict as assert } from 'node:assert'

// The `[node-tap](http://www.node-tap.org)` framework.
import { test } from 'tap'

import { MockConsole } from '../mocks/mock-console.js'
import { Logger } from '../../src/index.js'

assert(Logger)

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
  t.equal(mockConsole.stdout.length, 1, 'stdout has one entry')
  t.equal(mockConsole.stdout[0], 'trace: \n', 'stdout is trace')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.debug()
  t.equal(mockConsole.stdout.length, 1, 'stdout has one entry')
  t.equal(mockConsole.stdout[0], 'debug: \n', 'stdout is debug')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.verbose()
  t.equal(mockConsole.stdout.length, 1, 'stdout has one entry')
  t.equal(mockConsole.stdout[0], '\n', 'stdout is verbose')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.info()
  t.equal(mockConsole.stdout.length, 1, 'stdout has one entry')
  t.equal(mockConsole.stdout[0], '\n', 'stdout is info')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.warn()
  t.equal(mockConsole.stdout.length, 0, 'stdout is empty')
  t.equal(mockConsole.stderr.length, 1, 'stderr has one entry')
  t.equal(mockConsole.stderr[0], 'warning: \n', 'stderr is warn')

  mockConsole.clear()
  logger.error()
  t.equal(mockConsole.stdout.length, 0, 'stdout is empty')
  t.equal(mockConsole.stderr.length, 1, 'stderr has one entry')
  t.equal(mockConsole.stderr[0], 'error: \n', 'stderr is error')

  mockConsole.clear()
  logger.output()
  t.equal(mockConsole.stdout.length, 1, 'stdout has one entry')
  t.equal(mockConsole.stdout[0], '\n', 'stdout is nl')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.always()
  t.equal(mockConsole.stdout.length, 1, 'stdout has one entry')
  t.equal(mockConsole.stdout[0], '\n', 'stdout is nl')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  t.end()
})

// ----------------------------------------------------------------------------
