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
 * Test the output methods with an omitted or `undefined` message, as
 * documented in "Empty messages".
 */

// ----------------------------------------------------------------------------

// https://www.npmjs.com/package/tap
import { test } from 'tap'

// https://www.npmjs.com/package/@xpack/mock-console
import { MockConsole } from '@xpack/mock-console'

// ----------------------------------------------------------------------------

import { Logger } from '../../src/index.js'

// ----------------------------------------------------------------------------

const prefixes = {
  always: '',
  error: 'error: ',
  output: '',
  warn: 'warning: ',
  info: '',
  verbose: '',
  debug: 'debug: ',
  trace: 'trace: ',
}

const methods = Object.keys(prefixes) as (keyof typeof prefixes)[]

function createLogger(): { logger: Logger; mockConsole: MockConsole } {
  const mockConsole = new MockConsole()
  const logger = new Logger({ console: mockConsole, level: 'all' })
  // Ignore the constructor trace.
  mockConsole.clear()
  return { logger, mockConsole }
}

function lines(mockConsole: MockConsole): string[] {
  return [...mockConsole.outLines, ...mockConsole.errLines]
}

await test('omitted message is an empty string', (t) => {
  for (const method of methods) {
    const { logger, mockConsole } = createLogger()
    logger[method]()
    t.same(lines(mockConsole), [prefixes[method]], `${method}()`)
  }

  t.end()
})

await test('undefined message is an empty string', (t) => {
  for (const method of methods) {
    const { logger, mockConsole } = createLogger()
    logger[method](undefined)
    t.same(lines(mockConsole), [prefixes[method]], `${method}(undefined)`)
  }

  t.end()
})

await test('other falsy messages are written', (t) => {
  const { logger, mockConsole } = createLogger()

  logger.info(null)
  logger.info(0)
  logger.info(false)
  logger.info('')

  t.same(
    mockConsole.outLines,
    ['null', '0', 'false', ''],
    'null, 0, false, and the empty string'
  )

  t.end()
})

await test('undefined after the first argument is written', (t) => {
  const { logger, mockConsole } = createLogger()

  logger.info('value:', undefined)

  t.same(mockConsole.outLines, ['value: undefined'], 'undefined is written')

  t.end()
})

await test('arguments are appended to an empty message', (t) => {
  const { logger, mockConsole } = createLogger()

  logger.info(undefined, 1)
  logger.always(undefined, 'a', 'b')

  t.same(
    mockConsole.outLines,
    [' 1', ' a b'],
    'arguments follow the empty string, after a space'
  )

  t.end()
})

await test('String() writes the text undefined', (t) => {
  const { logger, mockConsole } = createLogger()

  const value: unknown = undefined
  logger.info(String(value))

  t.same(mockConsole.outLines, ['undefined'], 'text is written')

  t.end()
})

// ----------------------------------------------------------------------------
