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

await test('logger level all', (t) => {
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

  logger.level = 'all'
  t.equal(logger.level, 'all', 'level')

  t.equal(mock.stdout.length, 7, 'stdout has 7 entries')
  t.equal(mock.stderr.length, 2, 'stderr has 2 entries')

  t.equal(mock.stdout[0], 'trace: Logger.constructor()\n',
    'stdout is constructor')

  t.equal(mock.stdout[1], 'trace: trace\n', 'stdout is trace')
  t.equal(mock.stdout[2], 'debug: debug\n', 'stdout is debug')
  t.equal(mock.stdout[3], 'verbose\n', 'stdout is verbose')
  t.equal(mock.stdout[4], 'info\n', 'stdout is info')
  t.equal(mock.stdout[5], 'output\n', 'stdout is output')
  t.equal(mock.stdout[6], 'always\n', 'stdout is always')

  t.equal(mock.stderr[0], 'warning: warn\n', 'stderr is warn')
  t.equal(mock.stderr[1], 'error: error\n', 'stderr is error')

  t.end()
})

await test('logger level trace', (t) => {
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

  logger.level = 'trace'
  t.equal(logger.level, 'trace', 'level')

  t.equal(mock.stdout.length, 7, 'stdout has 7 entries')
  t.equal(mock.stderr.length, 2, 'stderr has 2 entries')

  t.equal(mock.stdout[0], 'trace: Logger.constructor()\n',
    'stdout is constructor')

  t.equal(mock.stdout[1], 'trace: trace\n', 'stdout is trace')
  t.equal(mock.stdout[2], 'debug: debug\n', 'stdout is debug')
  t.equal(mock.stdout[3], 'verbose\n', 'stdout is verbose')
  t.equal(mock.stdout[4], 'info\n', 'stdout is info')
  t.equal(mock.stdout[5], 'output\n', 'stdout is output')
  t.equal(mock.stdout[6], 'always\n', 'stdout is always')

  t.equal(mock.stderr[0], 'warning: warn\n', 'stderr is warn')
  t.equal(mock.stderr[1], 'error: error\n', 'stderr is error')

  t.end()
})

await test('logger level debug', (t) => {
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

  logger.level = 'debug'
  t.equal(logger.level, 'debug', 'level')

  t.equal(mock.stdout.length, 5, 'stdout has 5 entries')
  t.equal(mock.stderr.length, 2, 'stderr has 2 entries')

  t.equal(mock.stdout[0], 'debug: debug\n', 'stdout is debug')
  t.equal(mock.stdout[1], 'verbose\n', 'stdout is verbose')
  t.equal(mock.stdout[2], 'info\n', 'stdout is info')
  t.equal(mock.stdout[3], 'output\n', 'stdout is output')
  t.equal(mock.stdout[4], 'always\n', 'stdout is always')

  t.equal(mock.stderr[0], 'warning: warn\n', 'stderr is warn')
  t.equal(mock.stderr[1], 'error: error\n', 'stderr is error')

  t.end()
})

await test('logger level verbose', (t) => {
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

  logger.level = 'verbose'
  t.equal(logger.level, 'verbose', 'level')

  t.equal(mock.stdout.length, 4, 'stdout has 4 entries')
  t.equal(mock.stderr.length, 2, 'stderr has 2 entries')

  t.equal(mock.stdout[0], 'verbose\n', 'stdout is verbose')
  t.equal(mock.stdout[1], 'info\n', 'stdout is info')
  t.equal(mock.stdout[2], 'output\n', 'stdout is output')
  t.equal(mock.stdout[3], 'always\n', 'stdout is always')

  t.equal(mock.stderr[0], 'warning: warn\n', 'stderr is warn')
  t.equal(mock.stderr[1], 'error: error\n', 'stderr is error')

  t.end()
})

await test('logger level info', (t) => {
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

  logger.level = 'info'
  t.equal(logger.level, 'info', 'level')

  t.equal(mock.stdout.length, 3, 'stdout has 3 entries')
  t.equal(mock.stderr.length, 2, 'stderr has 2 entries')

  t.equal(mock.stdout[0], 'info\n', 'stdout is info')
  t.equal(mock.stdout[1], 'output\n', 'stdout is output')
  t.equal(mock.stdout[2], 'always\n', 'stdout is always')

  t.equal(mock.stderr[0], 'warning: warn\n', 'stderr is warn')
  t.equal(mock.stderr[1], 'error: error\n', 'stderr is error')

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
