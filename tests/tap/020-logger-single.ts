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

// ----------------------------------------------------------------------------

// https://www.npmjs.com/package/tap
import { test } from 'tap'

// ----------------------------------------------------------------------------

// https://www.npmjs.com/package/@xpack/mock-console
import { MockConsole } from '@xpack/mock-console'

// ----------------------------------------------------------------------------

import { Logger } from '../../src/index.js'

assert(Logger)

// ----------------------------------------------------------------------------

await test('logger level', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole
  })
  t.ok(!logger.hasLevel, 'is uninitialised')
  t.equal(logger.level, undefined, 'initial level')
  logger.level = 'trace'
  t.ok(logger.hasLevel, 'is initialised')
  t.equal(logger.level, 'trace', 'set level')
  t.equal(Logger.defaultLevel, 'info', 'has default')
  try {
    (logger.level as any) = 'xyz'
    // logger.level = 'xyz'
  } catch (err: any) {
  // } catch (err) {
    t.match(err.name, 'AssertionError', 'assert')
  }
  t.end()
})

await test('logger level all', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
    level: 'all'
  })
  t.equal(logger.level, 'all', 'level')

  mockConsole.clear()
  logger.trace('trace')
  console.log(mockConsole.outLines)
  t.equal(mockConsole.outLines.length, 1, 'stdout has one entry')
  t.equal(mockConsole.outLines[0], 'trace: trace', 'stdout is trace')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.debug('debug')
  t.equal(mockConsole.outLines.length, 1, 'stdout has one entry')
  t.equal(mockConsole.outLines[0], 'debug: debug', 'stdout is debug')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.verbose('verbose')
  t.equal(mockConsole.outLines.length, 1, 'stdout has one entry')
  t.equal(mockConsole.outLines[0], 'verbose', 'stdout is verbose')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.info('info')
  t.equal(mockConsole.outLines.length, 1, 'stdout has one entry')
  t.equal(mockConsole.outLines[0], 'info', 'stdout is info')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.warn('warn')
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 1, 'stderr has one entry')
  t.equal(mockConsole.errLines[0], 'warning: warn', 'stderr is warn')

  mockConsole.clear()
  logger.error('error')
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 1, 'stderr has one entry')
  t.equal(mockConsole.errLines[0], 'error: error', 'stderr is error')

  mockConsole.clear()
  logger.output('output')
  t.equal(mockConsole.outLines.length, 1, 'stdout has one entry')
  t.equal(mockConsole.outLines[0], 'output', 'stdout is output')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.always('always')
  t.equal(mockConsole.outLines.length, 1, 'stdout has one entry')
  t.equal(mockConsole.outLines[0], 'always', 'stdout is always')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

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
  logger.trace('trace')
  t.equal(mockConsole.outLines.length, 1, 'stdout has one entry')
  t.equal(mockConsole.outLines[0], 'trace: trace', 'stdout is trace')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.debug('debug')
  t.equal(mockConsole.outLines.length, 1, 'stdout has one entry')
  t.equal(mockConsole.outLines[0], 'debug: debug', 'stdout is debug')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.verbose('verbose')
  t.equal(mockConsole.outLines.length, 1, 'stdout has one entry')
  t.equal(mockConsole.outLines[0], 'verbose', 'stdout is verbose')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.info('info')
  t.equal(mockConsole.outLines.length, 1, 'stdout has one entry')
  t.equal(mockConsole.outLines[0], 'info', 'stdout is info')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.warn('warn')
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 1, 'stderr has one entry')
  t.equal(mockConsole.errLines[0], 'warning: warn', 'stderr is warn')

  mockConsole.clear()
  logger.error('error')
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 1, 'stderr has one entry')
  t.equal(mockConsole.errLines[0], 'error: error', 'stderr is error')

  mockConsole.clear()
  logger.output('output')
  t.equal(mockConsole.outLines.length, 1, 'stdout has one entry')
  t.equal(mockConsole.outLines[0], 'output', 'stdout is output')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.always('always')
  t.equal(mockConsole.outLines.length, 1, 'stdout has one entry')
  t.equal(mockConsole.outLines[0], 'always', 'stdout is always')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

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
  logger.trace('trace')
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.debug('debug')
  t.equal(mockConsole.outLines.length, 1, 'stdout has one entry')
  t.equal(mockConsole.outLines[0], 'debug: debug', 'stdout is debug')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.verbose('verbose')
  t.equal(mockConsole.outLines.length, 1, 'stdout has one entry')
  t.equal(mockConsole.outLines[0], 'verbose', 'stdout is verbose')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.info('info')
  t.equal(mockConsole.outLines.length, 1, 'stdout has one entry')
  t.equal(mockConsole.outLines[0], 'info', 'stdout is info')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.warn('warn')
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 1, 'stderr has one entry')
  t.equal(mockConsole.errLines[0], 'warning: warn', 'stderr is warn')

  mockConsole.clear()
  logger.error('error')
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 1, 'stderr has one entry')
  t.equal(mockConsole.errLines[0], 'error: error', 'stderr is error')

  mockConsole.clear()
  logger.output('output')
  t.equal(mockConsole.outLines.length, 1, 'stdout has one entry')
  t.equal(mockConsole.outLines[0], 'output', 'stdout is output')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.always('always')
  t.equal(mockConsole.outLines.length, 1, 'stdout has one entry')
  t.equal(mockConsole.outLines[0], 'always', 'stdout is always')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

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
  logger.trace('trace')
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.debug('debug')
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.verbose('verbose')
  t.equal(mockConsole.outLines.length, 1, 'stdout has one entry')
  t.equal(mockConsole.outLines[0], 'verbose', 'stdout is verbose')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.info('info')
  t.equal(mockConsole.outLines.length, 1, 'stdout has one entry')
  t.equal(mockConsole.outLines[0], 'info', 'stdout is info')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.warn('warn')
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 1, 'stderr has one entry')
  t.equal(mockConsole.errLines[0], 'warning: warn', 'stderr is warn')

  mockConsole.clear()
  logger.error('error')
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 1, 'stderr has one entry')
  t.equal(mockConsole.errLines[0], 'error: error', 'stderr is error')

  mockConsole.clear()
  logger.output('output')
  t.equal(mockConsole.outLines.length, 1, 'stdout has one entry')
  t.equal(mockConsole.outLines[0], 'output', 'stdout is output')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.always('always')
  t.equal(mockConsole.outLines.length, 1, 'stdout has one entry')
  t.equal(mockConsole.outLines[0], 'always', 'stdout is always')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

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
  logger.trace('trace')
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.debug('debug')
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.verbose('verbose')
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.info('info')
  t.equal(mockConsole.outLines.length, 1, 'stdout has one entry')
  t.equal(mockConsole.outLines[0], 'info', 'stdout is info')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.warn('warn')
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 1, 'stderr has one entry')
  t.equal(mockConsole.errLines[0], 'warning: warn', 'stderr is warn')

  mockConsole.clear()
  logger.error('error')
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 1, 'stderr has one entry')
  t.equal(mockConsole.errLines[0], 'error: error', 'stderr is error')

  mockConsole.clear()
  logger.output('output')
  t.equal(mockConsole.outLines.length, 1, 'stdout has one entry')
  t.equal(mockConsole.outLines[0], 'output', 'stdout is output')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.always('always')
  t.equal(mockConsole.outLines.length, 1, 'stdout has one entry')
  t.equal(mockConsole.outLines[0], 'always', 'stdout is always')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

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
  logger.trace('trace')
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.debug('debug')
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.verbose('verbose')
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.info('info')
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.warn('warn')
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 1, 'stderr has one entry')
  t.equal(mockConsole.errLines[0], 'warning: warn', 'stderr is warn')

  mockConsole.clear()
  logger.error('error')
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 1, 'stderr has one entry')
  t.equal(mockConsole.errLines[0], 'error: error', 'stderr is error')

  mockConsole.clear()
  logger.output('output')
  t.equal(mockConsole.outLines.length, 1, 'stdout has one entry')
  t.equal(mockConsole.outLines[0], 'output', 'stdout is output')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.always('always')
  t.equal(mockConsole.outLines.length, 1, 'stdout has one entry')
  t.equal(mockConsole.outLines[0], 'always', 'stdout is always')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

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
  logger.trace('trace')
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.debug('debug')
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.verbose('verbose')
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.info('info')
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.warn('warn')
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.error('error')
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 1, 'stderr has one entry')
  t.equal(mockConsole.errLines[0], 'error: error', 'stderr is error')

  mockConsole.clear()
  logger.output('output')
  t.equal(mockConsole.outLines.length, 1, 'stdout has one entry')
  t.equal(mockConsole.outLines[0], 'output', 'stdout is output')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.always('always')
  t.equal(mockConsole.outLines.length, 1, 'stdout has one entry')
  t.equal(mockConsole.outLines[0], 'always', 'stdout is always')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

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
  logger.trace('trace')
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.debug('debug')
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.verbose('verbose')
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.info('info')
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.warn('warn')
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.error('error')
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.output('output')
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  mockConsole.clear()
  logger.always('always')
  t.equal(mockConsole.outLines.length, 1, 'stdout has one entry')
  t.equal(mockConsole.outLines[0], 'always', 'stdout is always')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  t.end()
})

await test('logger error exception', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
    level: 'info'
  })
  logger.error(new Error('msg'))
  // console.log(mockConsole.errLines)
  t.ok(mockConsole.errLines.length > 1, 'stderr has lines')
  if (mockConsole.errLines.length > 1) {
    t.equal(mockConsole.errLines[0], 'Error: msg', 'stderr[0] is msg')
    t.match(mockConsole.errLines[1], 'at Test.', 'stderr[1] is at Test')
  }

  t.end()
})

// ----------------------------------------------------------------------------
