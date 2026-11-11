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
 * Test that the static members, which are the shared configuration of all
 * the loggers, cannot be changed at run time.
 */

// ----------------------------------------------------------------------------

// https://www.npmjs.com/package/tap
import { test } from 'tap'

// https://www.npmjs.com/package/@xpack/mock-console
import { MockConsole } from '@xpack/mock-console'

// ----------------------------------------------------------------------------

import { Logger } from '../../src/index.js'

// ----------------------------------------------------------------------------

// The tests are ES modules, which are strict, so a failed assignment throws.
// The compiler rejects these assignments, hence the casts.
const statics = Logger as unknown as Record<string, unknown>
const levels = Logger.numericLevels as unknown as Record<string, number>

await test('numericLevels is frozen', (t) => {
  t.ok(Object.isFrozen(Logger.numericLevels), 'is frozen')

  t.throws(
    () => {
      levels['debug'] = 0
    },
    TypeError,
    'a value cannot be changed'
  )
  t.throws(
    () => {
      levels['extra'] = 80
    },
    TypeError,
    'a level cannot be added'
  )
  t.throws(
    () => {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete levels['silent']
    },
    TypeError,
    'a level cannot be removed'
  )
  t.throws(
    () => {
      statics['numericLevels'] = {}
    },
    TypeError,
    'the object cannot be replaced'
  )

  t.same(
    { ...Logger.numericLevels },
    {
      silent: 0,
      error: 10,
      warn: 20,
      info: 30,
      verbose: 40,
      debug: 50,
      trace: 60,
      all: 70,
    },
    'the values are unchanged'
  )

  t.end()
})

await test('the class is frozen', (t) => {
  t.ok(Object.isFrozen(Logger), 'is frozen')

  t.throws(
    () => {
      statics['recommendedLevel'] = 'debug'
    },
    TypeError,
    'recommendedLevel'
  )
  t.throws(
    () => {
      statics['defaultLevel'] = 'debug'
    },
    TypeError,
    'defaultLevel'
  )
  t.throws(
    () => {
      statics['numericLevelUndefined'] = 5
    },
    TypeError,
    'numericLevelUndefined'
  )
  t.throws(
    () => {
      statics['numericLevelAlways'] = 0
    },
    TypeError,
    'numericLevelAlways'
  )
  t.throws(
    () => {
      statics['levelNames'] = []
    },
    TypeError,
    'levelNames'
  )
  t.throws(
    () => {
      statics['somethingNew'] = true
    },
    TypeError,
    'a new member cannot be added'
  )

  t.equal(Logger.recommendedLevel, 'info', 'recommendedLevel is unchanged')
  t.equal(Logger.defaultLevel, 'info', 'defaultLevel is unchanged')
  t.equal(Logger.numericLevelUndefined, Infinity, 'undefined is unchanged')
  t.equal(Logger.numericLevelAlways, -1, 'always is unchanged')
  t.equal(Logger.levelNames.length, 8, 'levelNames is unchanged')

  t.end()
})

await test('the behaviour is not affected by the attempts', (t) => {
  // Attempts to change the configuration, all of them rejected.
  for (const attempt of [
    () => {
      levels['debug'] = 0
    },
    () => {
      statics['numericLevelUndefined'] = 5
    },
    () => {
      statics['defaultLevel'] = 'trace'
    },
  ]) {
    t.throws(attempt, TypeError, 'attempt rejected')
  }

  const mockConsole = new MockConsole()
  const logger = new Logger({ console: mockConsole, level: 'info' })
  logger.debug('suppressed')
  logger.info('info')
  t.same(mockConsole.outLines, ['info'], 'debug is still suppressed at info')
  t.notOk(logger.isDebug, 'isDebug is false')

  const preliminary = new Logger({ console: mockConsole })
  t.notOk(preliminary.hasLevel, 'a logger without a level is still unset')

  t.end()
})

await test('a subclass reads the statics and works', (t) => {
  class MyLogger extends Logger {}

  t.equal(MyLogger.defaultLevel, 'info', 'inherited defaultLevel')
  t.equal(MyLogger.numericLevels, Logger.numericLevels, 'same numericLevels')
  t.ok(MyLogger.isLogLevel('info'), 'inherited static method')

  const mockConsole = new MockConsole()
  const logger = new MyLogger({ console: mockConsole, level: 'info' })
  logger.info('info')
  t.same(mockConsole.outLines, ['info'], 'the subclass logs')

  t.end()
})

// ----------------------------------------------------------------------------
