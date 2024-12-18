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

await test('logger level all', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole
  })
  t.equal(logger.level, undefined, 'initial level')

  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  logger.trace('trace')
  logger.debug('debug')
  logger.verbose('verbose')
  logger.info('info')
  logger.warn('warn')
  logger.error('error')
  logger.output('output')
  logger.always('always')

  // Nothing changed.
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  logger.level = 'all'
  t.equal(logger.level, 'all', 'level')

  t.equal(mockConsole.outLines.length, 7, 'stdout has 7 entries')
  t.equal(mockConsole.errLines.length, 2, 'stderr has 2 entries')

  t.equal(mockConsole.outLines[0], 'trace: Logger.constructor()',
    'stdout is constructor')

  t.equal(mockConsole.outLines[1], 'trace: trace', 'stdout is trace')
  t.equal(mockConsole.outLines[2], 'debug: debug', 'stdout is debug')
  t.equal(mockConsole.outLines[3], 'verbose', 'stdout is verbose')
  t.equal(mockConsole.outLines[4], 'info', 'stdout is info')
  t.equal(mockConsole.outLines[5], 'output', 'stdout is output')
  t.equal(mockConsole.outLines[6], 'always', 'stdout is always')

  t.equal(mockConsole.errLines[0], 'warning: warn', 'stderr is warn')
  t.equal(mockConsole.errLines[1], 'error: error', 'stderr is error')

  t.end()
})

await test('logger level trace', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole
  })
  t.equal(logger.level, undefined, 'initial level')

  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  logger.trace('trace')
  logger.debug('debug')
  logger.verbose('verbose')
  logger.info('info')
  logger.warn('warn')
  logger.error('error')
  logger.output('output')
  logger.always('always')

  // Nothing changed.
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  logger.level = 'trace'
  t.equal(logger.level, 'trace', 'level')

  t.equal(mockConsole.outLines.length, 7, 'stdout has 7 entries')
  t.equal(mockConsole.errLines.length, 2, 'stderr has 2 entries')

  t.equal(mockConsole.outLines[0], 'trace: Logger.constructor()',
    'stdout is constructor')

  t.equal(mockConsole.outLines[1], 'trace: trace', 'stdout is trace')
  t.equal(mockConsole.outLines[2], 'debug: debug', 'stdout is debug')
  t.equal(mockConsole.outLines[3], 'verbose', 'stdout is verbose')
  t.equal(mockConsole.outLines[4], 'info', 'stdout is info')
  t.equal(mockConsole.outLines[5], 'output', 'stdout is output')
  t.equal(mockConsole.outLines[6], 'always', 'stdout is always')

  t.equal(mockConsole.errLines[0], 'warning: warn', 'stderr is warn')
  t.equal(mockConsole.errLines[1], 'error: error', 'stderr is error')

  t.end()
})

await test('logger level debug', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole
  })
  t.equal(logger.level, undefined, 'initial level')

  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  logger.trace('trace')
  logger.debug('debug')
  logger.verbose('verbose')
  logger.info('info')
  logger.warn('warn')
  logger.error('error')
  logger.output('output')
  logger.always('always')

  // Nothing changed.
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  logger.level = 'debug'
  t.equal(logger.level, 'debug', 'level')

  t.equal(mockConsole.outLines.length, 5, 'stdout has 5 entries')
  t.equal(mockConsole.errLines.length, 2, 'stderr has 2 entries')

  t.equal(mockConsole.outLines[0], 'debug: debug', 'stdout is debug')
  t.equal(mockConsole.outLines[1], 'verbose', 'stdout is verbose')
  t.equal(mockConsole.outLines[2], 'info', 'stdout is info')
  t.equal(mockConsole.outLines[3], 'output', 'stdout is output')
  t.equal(mockConsole.outLines[4], 'always', 'stdout is always')

  t.equal(mockConsole.errLines[0], 'warning: warn', 'stderr is warn')
  t.equal(mockConsole.errLines[1], 'error: error', 'stderr is error')

  t.end()
})

await test('logger level verbose', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole
  })
  t.equal(logger.level, undefined, 'initial level')

  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  logger.trace('trace')
  logger.debug('debug')
  logger.verbose('verbose')
  logger.info('info')
  logger.warn('warn')
  logger.error('error')
  logger.output('output')
  logger.always('always')

  // Nothing changed.
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  logger.level = 'verbose'
  t.equal(logger.level, 'verbose', 'level')

  t.equal(mockConsole.outLines.length, 4, 'stdout has 4 entries')
  t.equal(mockConsole.errLines.length, 2, 'stderr has 2 entries')

  t.equal(mockConsole.outLines[0], 'verbose', 'stdout is verbose')
  t.equal(mockConsole.outLines[1], 'info', 'stdout is info')
  t.equal(mockConsole.outLines[2], 'output', 'stdout is output')
  t.equal(mockConsole.outLines[3], 'always', 'stdout is always')

  t.equal(mockConsole.errLines[0], 'warning: warn', 'stderr is warn')
  t.equal(mockConsole.errLines[1], 'error: error', 'stderr is error')

  t.end()
})

await test('logger level info', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole
  })
  t.equal(logger.level, undefined, 'initial level')

  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  logger.trace('trace')
  logger.debug('debug')
  logger.verbose('verbose')
  logger.info('info')
  logger.warn('warn')
  logger.error('error')
  logger.output('output')
  logger.always('always')

  // Nothing changed.
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  logger.level = 'info'
  t.equal(logger.level, 'info', 'level')

  t.equal(mockConsole.outLines.length, 3, 'stdout has 3 entries')
  t.equal(mockConsole.errLines.length, 2, 'stderr has 2 entries')

  t.equal(mockConsole.outLines[0], 'info', 'stdout is info')
  t.equal(mockConsole.outLines[1], 'output', 'stdout is output')
  t.equal(mockConsole.outLines[2], 'always', 'stdout is always')

  t.equal(mockConsole.errLines[0], 'warning: warn', 'stderr is warn')
  t.equal(mockConsole.errLines[1], 'error: error', 'stderr is error')

  t.end()
})

await test('logger level warn', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole
  })
  t.equal(logger.level, undefined, 'initial level')

  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  logger.trace('trace')
  logger.debug('debug')
  logger.verbose('verbose')
  logger.info('info')
  logger.warn('warn')
  logger.error('error')
  logger.output('output')
  logger.always('always')

  // Nothing changed.
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  logger.level = 'warn'
  t.equal(logger.level, 'warn', 'level')

  t.equal(mockConsole.outLines.length, 2, 'stdout has 2 entries')
  t.equal(mockConsole.errLines.length, 2, 'stderr has 2 entries')

  t.equal(mockConsole.outLines[0], 'output', 'stdout is output')
  t.equal(mockConsole.outLines[1], 'always', 'stdout is always')

  t.equal(mockConsole.errLines[0], 'warning: warn', 'stderr is warn')
  t.equal(mockConsole.errLines[1], 'error: error', 'stderr is error')

  t.end()
})

await test('logger level error', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole
  })
  t.equal(logger.level, undefined, 'initial level')

  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  logger.trace('trace')
  logger.debug('debug')
  logger.verbose('verbose')
  logger.info('info')
  logger.warn('warn')
  logger.error('error')
  logger.output('output')
  logger.always('always')

  // Nothing changed.
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  logger.level = 'error'
  t.equal(logger.level, 'error', 'level')

  t.equal(mockConsole.outLines.length, 2, 'stdout has 2 entries')
  t.equal(mockConsole.errLines.length, 1, 'stderr has 1 entry')

  t.equal(mockConsole.outLines[0], 'output', 'stdout is output')
  t.equal(mockConsole.outLines[1], 'always', 'stdout is always')

  t.equal(mockConsole.errLines[0], 'error: error', 'stderr is error')

  t.end()
})

await test('logger level silent', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole
  })
  t.equal(logger.level, undefined, 'initial level')

  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  logger.trace('trace')
  logger.debug('debug')
  logger.verbose('verbose')
  logger.info('info')
  logger.warn('warn')
  logger.error('error')
  logger.output('output')
  logger.always('always')

  // Nothing changed.
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  logger.level = 'silent'
  t.equal(logger.level, 'silent', 'level')

  t.equal(mockConsole.outLines.length, 1, 'stdout has 1 entry')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  t.equal(mockConsole.outLines[0], 'always', 'stdout is always')

  t.end()
})

// ----------------------------------------------------------------------------
