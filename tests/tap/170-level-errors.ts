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
 * Test the errors thrown for an invalid log level, by the constructor, the
 * `level` setter, and `isLevel()`.
 */

// ----------------------------------------------------------------------------

// https://www.npmjs.com/package/tap
import { test } from 'tap'

// https://www.npmjs.com/package/@xpack/mock-console
import { MockConsole } from '@xpack/mock-console'

// ----------------------------------------------------------------------------

import { Logger, type LogLevel } from '../../src/index.js'

// ----------------------------------------------------------------------------

const validList =
  'valid levels are: silent, error, warn, info, verbose, debug, trace, all'

// Each way of passing a level: the same value must give the same error.
const callers: [string, (value: unknown) => void][] = [
  [
    'constructor',
    (value) => {
      new Logger({ console: new MockConsole(), level: value as LogLevel })
    },
  ],
  [
    'setter',
    (value) => {
      const logger = new Logger({ console: new MockConsole(), level: 'info' })
      logger.level = value as LogLevel
    },
  ],
  [
    'isLevel',
    (value) => {
      const logger = new Logger({ console: new MockConsole(), level: 'info' })
      logger.isLevel(value as LogLevel)
    },
  ],
]

await test('a string that is not a level name is a RangeError', (t) => {
  const invalid = [
    'verbos',
    'INFO',
    'Info',
    ' info',
    '',
    'toString',
    '__proto__',
  ]

  for (const [name, call] of callers) {
    for (const value of invalid) {
      t.throws(
        () => {
          call(value)
        },
        {
          name: 'RangeError',
          message: `Unsupported log level '${value}'; ${validList}`,
        },
        `${name}(${JSON.stringify(value)})`
      )
    }
  }

  t.end()
})

await test('a value that is not a string is a TypeError', (t) => {
  const invalid: [unknown, string][] = [
    [null, 'null'],
    [0, 'number'],
    [10, 'number'],
    [true, 'boolean'],
    [{}, 'object'],
    [['info'], 'object'],
  ]

  for (const [name, call] of callers) {
    for (const [value, type] of invalid) {
      t.throws(
        () => {
          call(value)
        },
        {
          name: 'TypeError',
          message: `Log level must be a string, not ${type}; ${validList}`,
        },
        `${name}(${JSON.stringify(value)})`
      )
    }
  }

  t.end()
})

await test('undefined is a TypeError, except in the constructor', (t) => {
  const logger = new Logger({ console: new MockConsole(), level: 'info' })

  t.throws(
    () => {
      // The compiler rejects `undefined`; this tests the run-time check.
      logger.level = undefined as unknown as LogLevel
    },
    {
      name: 'TypeError',
      message: `Log level must be a string, not undefined; ${validList}`,
    },
    'setter'
  )
  t.throws(
    () => logger.isLevel(undefined as unknown as LogLevel),
    TypeError,
    'isLevel'
  )
  t.equal(logger.level, 'info', 'level is unchanged')

  // An undefined level in the constructor is the same as no level.
  const preliminary = new Logger({ console: new MockConsole() })
  t.equal(preliminary.level, undefined, 'no level')
  t.notOk(preliminary.hasLevel, 'preliminary state')

  t.end()
})

await test('the message escapes an untrusted value', (t) => {
  const logger = new Logger({ console: new MockConsole(), level: 'info' })

  try {
    logger.level = 'bad\nerror: forged\u001b[31m' as LogLevel
    t.fail('must throw')
  } catch (err) {
    const message = (err as Error).message
    t.notOk(message.includes('\n'), 'no newline in the message')
    t.notOk(message.includes('\u001b'), 'no escape character')
    t.ok(message.includes('\\n'), 'the newline is escaped')
  }

  t.end()
})

await test('an invalid level leaves the logger unchanged', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({ console: mockConsole })

  logger.info('buffered')
  t.throws(() => {
    logger.level = 'nope' as LogLevel
  }, RangeError)

  // Still in the preliminary state, with the message buffered.
  t.notOk(logger.hasLevel, 'no level')
  t.equal(mockConsole.outLines.length, 0, 'nothing written')
  logger.level = 'info'
  t.same(mockConsole.outLines, ['buffered'], 'the message is written later')

  t.end()
})

await test('the errors can be told apart by the caller', (t) => {
  const logger = new Logger({ console: new MockConsole(), level: 'info' })

  try {
    logger.level = 'nope' as LogLevel
  } catch (err) {
    t.ok(err instanceof RangeError, 'a RangeError')
    t.notOk(err instanceof TypeError, 'not a TypeError')
    t.not((err as Error).name, 'AssertionError', 'not an AssertionError')
  }

  t.end()
})

// ----------------------------------------------------------------------------
