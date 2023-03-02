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
import { Logger } from '../../src/index.js'

assert(Logger)

// ----------------------------------------------------------------------------

await test('logger level', (t) => {
  const mock = new Mock()
  const logger = new Logger({
    console: mock.console
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
  const mock = new Mock()
  const logger = new Logger({
    console: mock.console, level: 'all'
  })
  t.equal(logger.level, 'all', 'level')

  mock.clear()
  logger.trace('trace')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'trace: trace\n', 'stdout is trace')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.debug('debug')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'debug: debug\n', 'stdout is debug')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.verbose('verbose')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'verbose\n', 'stdout is verbose')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.info('info')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'info\n', 'stdout is info')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.warn('warn')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 1, 'stderr has one entry')
  t.equal(mock.stderr[0], 'warning: warn\n', 'stderr is warn')

  mock.clear()
  logger.error('error')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 1, 'stderr has one entry')
  t.equal(mock.stderr[0], 'error: error\n', 'stderr is error')

  mock.clear()
  logger.output('output')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'output\n', 'stdout is output')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.always('always')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'always\n', 'stdout is always')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  t.end()
})

await test('logger level trace', (t) => {
  const mock = new Mock()
  const logger = new Logger({
    console: mock.console,
    level: 'trace'
  })
  t.equal(logger.level, 'trace', 'level')

  mock.clear()
  logger.trace('trace')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'trace: trace\n', 'stdout is trace')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.debug('debug')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'debug: debug\n', 'stdout is debug')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.verbose('verbose')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'verbose\n', 'stdout is verbose')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.info('info')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'info\n', 'stdout is info')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.warn('warn')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 1, 'stderr has one entry')
  t.equal(mock.stderr[0], 'warning: warn\n', 'stderr is warn')

  mock.clear()
  logger.error('error')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 1, 'stderr has one entry')
  t.equal(mock.stderr[0], 'error: error\n', 'stderr is error')

  mock.clear()
  logger.output('output')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'output\n', 'stdout is output')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.always('always')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'always\n', 'stdout is always')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  t.end()
})

await test('logger level debug', (t) => {
  const mock = new Mock()
  const logger = new Logger({
    console: mock.console,
    level: 'debug'
  })
  t.equal(logger.level, 'debug', 'level')

  mock.clear()
  logger.trace('trace')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.debug('debug')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'debug: debug\n', 'stdout is debug')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.verbose('verbose')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'verbose\n', 'stdout is verbose')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.info('info')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'info\n', 'stdout is info')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.warn('warn')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 1, 'stderr has one entry')
  t.equal(mock.stderr[0], 'warning: warn\n', 'stderr is warn')

  mock.clear()
  logger.error('error')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 1, 'stderr has one entry')
  t.equal(mock.stderr[0], 'error: error\n', 'stderr is error')

  mock.clear()
  logger.output('output')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'output\n', 'stdout is output')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.always('always')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'always\n', 'stdout is always')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  t.end()
})

await test('logger level verbose', (t) => {
  const mock = new Mock()
  const logger = new Logger({
    console: mock.console,
    level: 'verbose'
  })
  t.equal(logger.level, 'verbose', 'level')

  mock.clear()
  logger.trace('trace')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.debug('debug')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.verbose('verbose')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'verbose\n', 'stdout is verbose')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.info('info')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'info\n', 'stdout is info')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.warn('warn')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 1, 'stderr has one entry')
  t.equal(mock.stderr[0], 'warning: warn\n', 'stderr is warn')

  mock.clear()
  logger.error('error')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 1, 'stderr has one entry')
  t.equal(mock.stderr[0], 'error: error\n', 'stderr is error')

  mock.clear()
  logger.output('output')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'output\n', 'stdout is output')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.always('always')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'always\n', 'stdout is always')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  t.end()
})

await test('logger level info', (t) => {
  const mock = new Mock()
  const logger = new Logger({
    console: mock.console,
    level: 'info'
  })
  t.equal(logger.level, 'info', 'level')

  mock.clear()
  logger.trace('trace')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.debug('debug')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.verbose('verbose')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.info('info')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'info\n', 'stdout is info')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.warn('warn')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 1, 'stderr has one entry')
  t.equal(mock.stderr[0], 'warning: warn\n', 'stderr is warn')

  mock.clear()
  logger.error('error')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 1, 'stderr has one entry')
  t.equal(mock.stderr[0], 'error: error\n', 'stderr is error')

  mock.clear()
  logger.output('output')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'output\n', 'stdout is output')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.always('always')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'always\n', 'stdout is always')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  t.end()
})

await test('logger level warn', (t) => {
  const mock = new Mock()
  const logger = new Logger({
    console: mock.console,
    level: 'warn'
  })
  t.equal(logger.level, 'warn', 'level')

  mock.clear()
  logger.trace('trace')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.debug('debug')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.verbose('verbose')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.info('info')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.warn('warn')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 1, 'stderr has one entry')
  t.equal(mock.stderr[0], 'warning: warn\n', 'stderr is warn')

  mock.clear()
  logger.error('error')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 1, 'stderr has one entry')
  t.equal(mock.stderr[0], 'error: error\n', 'stderr is error')

  mock.clear()
  logger.output('output')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'output\n', 'stdout is output')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.always('always')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'always\n', 'stdout is always')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  t.end()
})

await test('logger level error', (t) => {
  const mock = new Mock()
  const logger = new Logger({
    console: mock.console,
    level: 'error'
  })
  t.equal(logger.level, 'error', 'level')

  mock.clear()
  logger.trace('trace')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.debug('debug')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.verbose('verbose')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.info('info')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.warn('warn')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.error('error')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 1, 'stderr has one entry')
  t.equal(mock.stderr[0], 'error: error\n', 'stderr is error')

  mock.clear()
  logger.output('output')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'output\n', 'stdout is output')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.always('always')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'always\n', 'stdout is always')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  t.end()
})

await test('logger level silent', (t) => {
  const mock = new Mock()
  const logger = new Logger({
    console: mock.console,
    level: 'silent'
  })
  t.equal(logger.level, 'silent', 'level')

  mock.clear()
  logger.trace('trace')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.debug('debug')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.verbose('verbose')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.info('info')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.warn('warn')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.error('error')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.output('output')
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.always('always')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'always\n', 'stdout is always')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  t.end()
})

await test('logger error exception', (t) => {
  const mock = new Mock()
  const logger = new Logger({
    console: mock.console,
    level: 'info'
  })
  logger.error(new Error('msg'))
  // console.log(mock.stderr)
  const errLines = mock.stderr[0].split(/\r?\n/)
  t.equal(errLines[0], 'Error: msg', 'stderr[0] is msg')
  t.match(errLines[1], 'at Test.', 'stderr[1] is at Test')

  t.end()
})

// ----------------------------------------------------------------------------
