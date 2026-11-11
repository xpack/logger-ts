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
 * Test `Logger.levelNames` and `Logger.isLogLevel()`.
 */

// ----------------------------------------------------------------------------

// https://www.npmjs.com/package/tap
import { test } from 'tap'

// https://www.npmjs.com/package/@xpack/mock-console
import { MockConsole } from '@xpack/mock-console'

// ----------------------------------------------------------------------------

import { Logger, type LogLevel } from '../../src/index.js'

// ----------------------------------------------------------------------------

await test('Logger.levelNames', (t) => {
  t.same(
    Logger.levelNames,
    ['silent', 'error', 'warn', 'info', 'verbose', 'debug', 'trace', 'all'],
    'names in increasing order of verbosity'
  )

  t.same(
    Logger.levelNames,
    Object.keys(Logger.numericLevels),
    'same as the keys of numericLevels'
  )

  // The numeric values increase with the position in the array.
  const values = Logger.levelNames.map((name) => Logger.numericLevels[name])
  t.same(
    values,
    [...values].sort((a, b) => a - b),
    'numeric values are sorted'
  )

  t.ok(Object.isFrozen(Logger.levelNames), 'array is frozen')
  t.throws(
    () => {
      ;(Logger.levelNames as LogLevel[]).push('info')
    },
    TypeError,
    'array cannot be modified'
  )

  t.end()
})

await test('numericLevels has exactly the level names', (t) => {
  // Compile-time check: fails to compile if a level name is missing.
  const levels: Record<LogLevel, number> = Logger.numericLevels
  // Run-time check of the other direction: no extra key.
  const names: string[] = Object.keys(levels)
  t.same(names, [...Logger.levelNames], 'the keys are the level names')

  t.end()
})

await test('Logger.isLogLevel valid', (t) => {
  for (const name of Logger.levelNames) {
    t.ok(Logger.isLogLevel(name), `'${name}' is valid`)
  }

  t.end()
})

await test('Logger.isLogLevel invalid', (t) => {
  const invalid: unknown[] = [
    'INFO',
    'Info',
    ' info',
    'info ',
    'warning',
    'fatal',
    '',
    'toString',
    'constructor',
    '__proto__',
    'hasOwnProperty',
    undefined,
    null,
    0,
    10,
    true,
    {},
    ['info'],
    () => 'info',
    Symbol('info'),
  ]

  for (const value of invalid) {
    t.notOk(Logger.isLogLevel(value), `${String(value)} is not valid`)
  }

  t.end()
})

await test('Logger.isLogLevel narrows the type', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
    level: 'info',
  })

  // A string that is not known to the compiler.
  const names: string[] = ['debug', 'nope']
  const levels: LogLevel[] = []
  for (const name of names) {
    if (Logger.isLogLevel(name)) {
      // Compiles only if the type is narrowed.
      logger.level = name
      levels.push(name)
    }
  }

  t.same(levels, ['debug'], 'only the valid name is accepted')
  t.equal(logger.level, 'debug', 'level is set')

  t.end()
})

await test('invalid levels still throw', (t) => {
  const mockConsole = new MockConsole()

  t.throws(
    () => new Logger({ console: mockConsole, level: 'nope' as LogLevel }),
    /Log level 'nope' not supported./,
    'constructor rejects an invalid name'
  )

  const logger = new Logger({ console: mockConsole, level: 'info' })
  t.throws(
    () => {
      logger.level = 'INFO' as LogLevel
    },
    /Log level 'INFO' not supported./,
    'setter rejects an invalid name'
  )
  t.throws(
    () => logger.isLevel('toString' as LogLevel),
    /Log level 'toString' not supported./,
    'isLevel rejects an inherited name'
  )
  t.equal(logger.level, 'info', 'level is unchanged')

  t.end()
})

// ----------------------------------------------------------------------------
