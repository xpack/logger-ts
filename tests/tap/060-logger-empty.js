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
 * Test the logger.
 */

// ----------------------------------------------------------------------------

import { strict as assert } from 'node:assert'

// The `[node-tap](http://www.node-tap.org)` framework.
import { test } from 'tap'

import { Mock } from '../mock-console.js'
import { Logger } from '../../dist/index.js'

assert(Logger)

// ----------------------------------------------------------------------------

test('logger level all empty', (t) => {
  const mock = new Mock()
  const logger = new Logger({
    console: mock.console,
    level: 'all'
  })
  t.equal(logger.level, 'all', 'level')

  mock.clear()
  logger.trace()
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'trace: \n', 'stdout is trace')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.debug()
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'debug: \n', 'stdout is debug')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.verbose()
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], '\n', 'stdout is verbose')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.info()
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], '\n', 'stdout is info')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.warn()
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 1, 'stderr has one entry')
  t.equal(mock.stderr[0], 'warning: \n', 'stderr is warn')

  mock.clear()
  logger.error()
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 1, 'stderr has one entry')
  t.equal(mock.stderr[0], 'error: \n', 'stderr is error')

  mock.clear()
  logger.output()
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], '\n', 'stdout is nl')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.always()
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], '\n', 'stdout is nl')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  t.end()
})

// ----------------------------------------------------------------------------
