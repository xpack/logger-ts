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
 * Test the table of logging methods (threshold, stream, and prefix), as
 * documented in the description of the class and in the user guide.
 */

// ----------------------------------------------------------------------------

// https://www.npmjs.com/package/tap
import { test } from 'tap'

// https://www.npmjs.com/package/@xpack/mock-console
import { MockConsole } from '@xpack/mock-console'

// ----------------------------------------------------------------------------

import { Logger, type LogLevel } from '../../src/index.js'

// ----------------------------------------------------------------------------

type OutputMethod =
  | 'always'
  | 'error'
  | 'output'
  | 'warn'
  | 'info'
  | 'verbose'
  | 'debug'
  | 'trace'

interface MethodSpec {
  name: OutputMethod
  // The lowest level at which the method is written, or undefined
  // for every level.
  threshold: LogLevel | undefined
  stream: 'stdout' | 'stderr'
  prefix: string
}

// The documented table.
const table: MethodSpec[] = [
  { name: 'always', threshold: undefined, stream: 'stdout', prefix: '' },
  { name: 'error', threshold: 'error', stream: 'stderr', prefix: 'error: ' },
  { name: 'output', threshold: 'error', stream: 'stdout', prefix: '' },
  { name: 'warn', threshold: 'warn', stream: 'stderr', prefix: 'warning: ' },
  { name: 'info', threshold: 'info', stream: 'stdout', prefix: '' },
  { name: 'verbose', threshold: 'verbose', stream: 'stdout', prefix: '' },
  { name: 'debug', threshold: 'debug', stream: 'stdout', prefix: 'debug: ' },
  { name: 'trace', threshold: 'trace', stream: 'stdout', prefix: 'trace: ' },
]

await test('logging methods table', (t) => {
  for (const level of Logger.levelNames) {
    const mockConsole = new MockConsole()
    const logger = new Logger({
      console: mockConsole,
      level,
    })

    const expectedOut: string[] = []
    const expectedErr: string[] = []

    for (const spec of table) {
      logger[spec.name](`${spec.name} message`)

      const written =
        spec.threshold === undefined ||
        Logger.numericLevels[level] >= Logger.numericLevels[spec.threshold]
      if (written) {
        const line = `${spec.prefix}${spec.name} message`
        if (spec.stream === 'stdout') {
          expectedOut.push(line)
        } else {
          expectedErr.push(line)
        }
      }
    }

    t.same(mockConsole.outLines, expectedOut, `stdout at '${level}'`)
    t.same(mockConsole.errLines, expectedErr, `stderr at '${level}'`)
  }

  t.end()
})

await test('only always() is written at silent', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
    level: 'silent',
  })
  mockConsole.clear()

  for (const spec of table) {
    logger[spec.name](spec.name)
  }

  t.same(mockConsole.outLines, ['always'], 'stdout has only always')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  t.end()
})

await test('output differs from info by the threshold', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
    level: 'error',
  })
  mockConsole.clear()

  logger.output('output')
  logger.info('info')

  t.same(mockConsole.outLines, ['output'], 'only output is written')

  t.end()
})

// ----------------------------------------------------------------------------
