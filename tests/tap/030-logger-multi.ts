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

await test('logger level all', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
    level: 'all'
  })
  t.equal(logger.level, 'all', 'level')

  t.equal(mockConsole.stdout.length, 1, 'stdout has 1 entry')
  t.equal(mockConsole.stdout[0], 'trace: Logger.constructor()\n',
    'stdout is constructor')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  logger.trace('trace')
  t.equal(mockConsole.stdout.length, 2, 'stdout has 2 entries')
  t.equal(mockConsole.stdout[1], 'trace: trace\n', 'stdout is trace')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  logger.debug('debug')
  t.equal(mockConsole.stdout.length, 3, 'stdout has 3 entries')
  t.equal(mockConsole.stdout[2], 'debug: debug\n', 'stdout is debug')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  logger.verbose('verbose')
  t.equal(mockConsole.stdout.length, 4, 'stdout has 4 entries')
  t.equal(mockConsole.stdout[3], 'verbose\n', 'stdout is verbose')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  logger.info('info')
  t.equal(mockConsole.stdout.length, 5, 'stdout has 5 entries')
  t.equal(mockConsole.stdout[4], 'info\n', 'stdout is info')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  logger.warn('warn')
  t.equal(mockConsole.stdout.length, 5, 'stdout has 5 entries')
  t.equal(mockConsole.stderr.length, 1, 'stderr has 1 entry')
  t.equal(mockConsole.stderr[0], 'warning: warn\n', 'stderr is warn')

  logger.error('error')
  t.equal(mockConsole.stdout.length, 5, 'stdout has 5 entries')
  t.equal(mockConsole.stderr.length, 2, 'stderr has 2 entries')
  t.equal(mockConsole.stderr[1], 'error: error\n', 'stderr is error')

  logger.output('output')
  t.equal(mockConsole.stdout.length, 6, 'stdout has 6 entries')
  t.equal(mockConsole.stdout[5], 'output\n', 'stdout is output')
  t.equal(mockConsole.stderr.length, 2, 'stderr has 2 entries')

  logger.always('always')
  t.equal(mockConsole.stdout.length, 7, 'stdout has 7 entries')
  t.equal(mockConsole.stdout[6], 'always\n', 'stdout is always')
  t.equal(mockConsole.stderr.length, 2, 'stderr has 2 entries')

  t.end()
})

await test('logger level trace', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
    level: 'trace'
  })
  t.equal(logger.level, 'trace', 'level')

  t.equal(mockConsole.stdout.length, 1, 'stdout has 1 entry')
  t.equal(mockConsole.stdout[0], 'trace: Logger.constructor()\n',
    'stdout is constructor')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  logger.trace('trace')
  t.equal(mockConsole.stdout.length, 2, 'stdout has 2 entries')
  t.equal(mockConsole.stdout[1], 'trace: trace\n', 'stdout is trace')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  logger.debug('debug')
  t.equal(mockConsole.stdout.length, 3, 'stdout has 3 entries')
  t.equal(mockConsole.stdout[2], 'debug: debug\n', 'stdout is debug')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  logger.verbose('verbose')
  t.equal(mockConsole.stdout.length, 4, 'stdout has 4 entries')
  t.equal(mockConsole.stdout[3], 'verbose\n', 'stdout is verbose')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  logger.info('info')
  t.equal(mockConsole.stdout.length, 5, 'stdout has 5 entries')
  t.equal(mockConsole.stdout[4], 'info\n', 'stdout is info')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  logger.warn('warn')
  t.equal(mockConsole.stdout.length, 5, 'stdout has 5 entries')
  t.equal(mockConsole.stderr.length, 1, 'stderr has 1 entry')
  t.equal(mockConsole.stderr[0], 'warning: warn\n', 'stderr is warn')

  logger.error('error')
  t.equal(mockConsole.stdout.length, 5, 'stdout has 5 entries')
  t.equal(mockConsole.stderr.length, 2, 'stderr has 2 entries')
  t.equal(mockConsole.stderr[1], 'error: error\n', 'stderr is error')

  logger.output('output')
  t.equal(mockConsole.stdout.length, 6, 'stdout has 6 entries')
  t.equal(mockConsole.stdout[5], 'output\n', 'stdout is output')
  t.equal(mockConsole.stderr.length, 2, 'stderr has 2 entries')

  logger.always('always')
  t.equal(mockConsole.stdout.length, 7, 'stdout has 7 entries')
  t.equal(mockConsole.stdout[6], 'always\n', 'stdout is always')
  t.equal(mockConsole.stderr.length, 2, 'stderr has 2 entries')

  t.end()
})

await test('logger level debug', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
    level: 'debug'
  })
  t.equal(logger.level, 'debug', 'level')

  logger.trace('trace')
  t.equal(mockConsole.stdout.length, 0, 'stdout is empty')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  logger.debug('debug')
  t.equal(mockConsole.stdout.length, 1, 'stdout has 1 entry')
  t.equal(mockConsole.stdout[0], 'debug: debug\n', 'stdout is debug')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  logger.verbose('verbose')
  t.equal(mockConsole.stdout.length, 2, 'stdout has 2 entries')
  t.equal(mockConsole.stdout[1], 'verbose\n', 'stdout is verbose')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  logger.info('info')
  t.equal(mockConsole.stdout.length, 3, 'stdout has 3 entries')
  t.equal(mockConsole.stdout[2], 'info\n', 'stdout is info')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  logger.warn('warn')
  t.equal(mockConsole.stdout.length, 3, 'stdout hs 3 entries')
  t.equal(mockConsole.stderr.length, 1, 'stderr has one entry')
  t.equal(mockConsole.stderr[0], 'warning: warn\n', 'stderr is warn')

  logger.error('error')
  t.equal(mockConsole.stdout.length, 3, 'stdout hs 3 entries')
  t.equal(mockConsole.stderr.length, 2, 'stderr has 2 entries')
  t.equal(mockConsole.stderr[1], 'error: error\n', 'stderr is error')

  logger.output('output')
  t.equal(mockConsole.stdout.length, 4, 'stdout has 4 entries')
  t.equal(mockConsole.stdout[3], 'output\n', 'stdout is output')
  t.equal(mockConsole.stderr.length, 2, 'stderr has 2 entries')

  logger.always('always')
  t.equal(mockConsole.stdout.length, 5, 'stdout has 5 entries')
  t.equal(mockConsole.stdout[4], 'always\n', 'stdout is always')
  t.equal(mockConsole.stderr.length, 2, 'stderr has 2 entries')

  t.end()
})

await test('logger level verbose', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
    level: 'verbose'
  })
  t.equal(logger.level, 'verbose', 'level')

  logger.trace('trace')
  t.equal(mockConsole.stdout.length, 0, 'stdout is empty')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  logger.debug('debug')
  t.equal(mockConsole.stdout.length, 0, 'stdout is empty')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  logger.verbose('verbose')
  t.equal(mockConsole.stdout.length, 1, 'stdout has 1 entry')
  t.equal(mockConsole.stdout[0], 'verbose\n', 'stdout is verbose')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  logger.info('info')
  t.equal(mockConsole.stdout.length, 2, 'stdout has 2 entries')
  t.equal(mockConsole.stdout[1], 'info\n', 'stdout is info')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  logger.warn('warn')
  t.equal(mockConsole.stdout.length, 2, 'stdout has 2 entries')
  t.equal(mockConsole.stderr.length, 1, 'stderr has one entry')
  t.equal(mockConsole.stderr[0], 'warning: warn\n', 'stderr is warn')

  logger.error('error')
  t.equal(mockConsole.stdout.length, 2, 'stdout has 2 entries')
  t.equal(mockConsole.stderr.length, 2, 'stderr has 2 entries')
  t.equal(mockConsole.stderr[1], 'error: error\n', 'stderr is error')

  logger.output('output')
  t.equal(mockConsole.stdout.length, 3, 'stdout has 3 entries')
  t.equal(mockConsole.stdout[2], 'output\n', 'stdout is output')
  t.equal(mockConsole.stderr.length, 2, 'stderr has 2 entries')

  logger.always('always')
  t.equal(mockConsole.stdout.length, 4, 'stdout has 4 entries')
  t.equal(mockConsole.stdout[3], 'always\n', 'stdout is always')
  t.equal(mockConsole.stderr.length, 2, 'stderr has 2 entries')

  t.end()
})

await test('logger level info', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
    level: 'info'
  })
  t.equal(logger.level, 'info', 'level')

  logger.trace('trace')
  t.equal(mockConsole.stdout.length, 0, 'stdout is empty')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  logger.debug('debug')
  t.equal(mockConsole.stdout.length, 0, 'stdout is empty')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  logger.verbose('verbose')
  t.equal(mockConsole.stdout.length, 0, 'stdout is empty')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  logger.info('info')
  t.equal(mockConsole.stdout.length, 1, 'stdout has 1 entry')
  t.equal(mockConsole.stdout[0], 'info\n', 'stdout is info')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  logger.warn('warn')
  t.equal(mockConsole.stdout.length, 1, 'stdout has 1 entry')
  t.equal(mockConsole.stderr.length, 1, 'stderr has one entry')
  t.equal(mockConsole.stderr[0], 'warning: warn\n', 'stderr is warn')

  logger.error('error')
  t.equal(mockConsole.stdout.length, 1, 'stdout has 1 entry')
  t.equal(mockConsole.stderr.length, 2, 'stderr has 2 entries')
  t.equal(mockConsole.stderr[1], 'error: error\n', 'stderr is error')

  logger.output('output')
  t.equal(mockConsole.stdout.length, 2, 'stdout has 2 entries')
  t.equal(mockConsole.stdout[1], 'output\n', 'stdout is output')
  t.equal(mockConsole.stderr.length, 2, 'stderr has 2 entries')

  logger.always('always')
  t.equal(mockConsole.stdout.length, 3, 'stdout has 3 entries')
  t.equal(mockConsole.stdout[2], 'always\n', 'stdout is always')
  t.equal(mockConsole.stderr.length, 2, 'stderr has 2 entries')

  t.end()
})

await test('logger level warn', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
    level: 'warn'
  })
  t.equal(logger.level, 'warn', 'level')

  logger.trace('trace')
  t.equal(mockConsole.stdout.length, 0, 'stdout is empty')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  logger.debug('debug')
  t.equal(mockConsole.stdout.length, 0, 'stdout is empty')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  logger.verbose('verbose')
  t.equal(mockConsole.stdout.length, 0, 'stdout is empty')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  logger.info('info')
  t.equal(mockConsole.stdout.length, 0, 'stdout is empty')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  logger.warn('warn')
  t.equal(mockConsole.stdout.length, 0, 'stdout is empty')
  t.equal(mockConsole.stderr.length, 1, 'stderr has 1 entry')
  t.equal(mockConsole.stderr[0], 'warning: warn\n', 'stderr is warn')

  logger.error('error')
  t.equal(mockConsole.stdout.length, 0, 'stdout is empty')
  t.equal(mockConsole.stderr.length, 2, 'stderr has 2 entries')
  t.equal(mockConsole.stderr[1], 'error: error\n', 'stderr is error')

  logger.output('output')
  t.equal(mockConsole.stdout.length, 1, 'stdout has one entry')
  t.equal(mockConsole.stdout[0], 'output\n', 'stdout is output')
  t.equal(mockConsole.stderr.length, 2, 'stderr has 2 entries')

  logger.always('always')
  t.equal(mockConsole.stdout.length, 2, 'stdout has 2 entries')
  t.equal(mockConsole.stdout[1], 'always\n', 'stdout is always')
  t.equal(mockConsole.stderr.length, 2, 'stderr has 2 entries')

  t.end()
})

await test('logger level error', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
    level: 'error'
  })
  t.equal(logger.level, 'error', 'level')

  logger.trace('trace')
  t.equal(mockConsole.stdout.length, 0, 'stdout is empty')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  logger.debug('debug')
  t.equal(mockConsole.stdout.length, 0, 'stdout is empty')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  logger.verbose('verbose')
  t.equal(mockConsole.stdout.length, 0, 'stdout is empty')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  logger.info('info')
  t.equal(mockConsole.stdout.length, 0, 'stdout is empty')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  logger.warn('warn')
  t.equal(mockConsole.stdout.length, 0, 'stdout is empty')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  logger.error('error')
  t.equal(mockConsole.stdout.length, 0, 'stdout is empty')
  t.equal(mockConsole.stderr.length, 1, 'stderr has 1 entry')
  t.equal(mockConsole.stderr[0], 'error: error\n', 'stderr is error')

  logger.output('output')
  t.equal(mockConsole.stdout.length, 1, 'stdout has 1 entry')
  t.equal(mockConsole.stdout[0], 'output\n', 'stdout is output')
  t.equal(mockConsole.stderr.length, 1, 'stderr has 1 entry')

  logger.always('always')
  t.equal(mockConsole.stdout.length, 2, 'stdout has 2 entries')
  t.equal(mockConsole.stdout[1], 'always\n', 'stdout is always')
  t.equal(mockConsole.stderr.length, 1, 'stderr has 1 entry')

  t.end()
})

await test('logger level silent', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
    level: 'silent'
  })
  t.equal(logger.level, 'silent', 'level')

  logger.trace('trace')
  t.equal(mockConsole.stdout.length, 0, 'stdout is empty')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  logger.debug('debug')
  t.equal(mockConsole.stdout.length, 0, 'stdout is empty')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  logger.verbose('verbose')
  t.equal(mockConsole.stdout.length, 0, 'stdout is empty')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  logger.info('info')
  t.equal(mockConsole.stdout.length, 0, 'stdout is empty')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  logger.warn('warn')
  t.equal(mockConsole.stdout.length, 0, 'stdout is empty')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  logger.error('error')
  t.equal(mockConsole.stdout.length, 0, 'stdout is empty')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  logger.output('output')
  t.equal(mockConsole.stdout.length, 0, 'stdout is empty')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  logger.always('always')
  t.equal(mockConsole.stdout.length, 1, 'stdout has 1 entry')
  t.equal(mockConsole.stdout[0], 'always\n', 'stdout is always')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  t.end()
})

// ----------------------------------------------------------------------------
