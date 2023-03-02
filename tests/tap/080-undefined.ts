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

import { Mock } from '../mocks/mock-console.js'
import { Logger, NumericLogLevel, LoggerFunction } from '../../src/index.js'

assert(Logger)

// ----------------------------------------------------------------------------

class MyLogger extends Logger {
  // Allow access to protected function.
  public override write (
    numericLevel: NumericLogLevel,
    loggerFunction: LoggerFunction,
    message: string | undefined
  ): void {
    super.write(numericLevel, loggerFunction, message)
  }
}

await test('logger undefined', (t) => {
  const mock = new Mock()
  const logger = new MyLogger({
    console: mock.console
  })
  t.equal(logger.level, undefined, 'initial level')

  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  logger.level = 'info'
  t.equal(logger.level, 'info', 'level')

  logger.write(MyLogger.numericLevels.info, logger.console.log, undefined)

  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  t.end()
})

await test('logger level warn', (t) => {
  const mock = new Mock()
  const logger = new Logger({
    console: mock.console
  })
  t.equal(logger.level, undefined, 'initial level')

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

await test('logger level error', (t) => {
  const mock = new Mock()
  const logger = new Logger({
    console: mock.console
  })
  t.equal(logger.level, undefined, 'initial level')

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

await test('logger level silent', (t) => {
  const mock = new Mock()
  const logger = new Logger({
    console: mock.console
  })
  t.equal(logger.level, undefined, 'initial level')

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
