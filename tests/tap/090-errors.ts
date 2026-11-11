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
 * Test the output of `Error` objects, as documented in
 * "Logging errors".
 */

// ----------------------------------------------------------------------------

// https://www.npmjs.com/package/tap
import { test } from 'tap'

// https://www.npmjs.com/package/@xpack/mock-console
import { MockConsole } from '@xpack/mock-console'

// ----------------------------------------------------------------------------

import { Logger, type LogLevel } from '../../src/index.js'

// ----------------------------------------------------------------------------

// The second line of an expanded error is the first line of the stack.
const stackLine = /^ {4}at /

function createLogger(level?: LogLevel): {
  logger: Logger
  mockConsole: MockConsole
} {
  const mockConsole = new MockConsole()
  const logger =
    level === undefined
      ? new Logger({ console: mockConsole })
      : new Logger({ console: mockConsole, level })
  mockConsole.clear()
  return { logger, mockConsole }
}

await test('error(err) has the stack and no prefix', (t) => {
  const { logger, mockConsole } = createLogger('info')

  logger.error(new Error('boom'))

  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines[0], 'Error: boom', 'stderr is the error')
  t.match(mockConsole.errLines[1], stackLine, 'stderr has the stack')

  t.end()
})

await test('error(ctx, err) keeps the prefix', (t) => {
  const { logger, mockConsole } = createLogger('info')

  logger.error('failed:', new Error('boom'))

  t.equal(
    mockConsole.errLines[0],
    'error: failed: Error: boom',
    'stderr is prefixed'
  )
  t.match(mockConsole.errLines[1], stackLine, 'stderr has the stack')

  t.end()
})

await test('error(err.message) is a single line', (t) => {
  const { logger, mockConsole } = createLogger('info')

  const err = new Error('boom')
  logger.error(err.message)
  logger.error(String(new TypeError('bad')))

  t.same(
    mockConsole.errLines,
    ['error: boom', 'error: TypeError: bad'],
    'stderr has single lines'
  )

  t.end()
})

await test('error(err) has the cause', (t) => {
  const { logger, mockConsole } = createLogger('info')

  logger.error(new Error('outer', { cause: new Error('inner') }))

  t.equal(mockConsole.errLines[0], 'Error: outer', 'stderr is the error')
  t.ok(
    mockConsole.errLines.some((line) => line.includes('[cause]: Error: inner')),
    'stderr has the cause'
  )

  t.end()
})

await test('warn(err) keeps the prefix', (t) => {
  const { logger, mockConsole } = createLogger('info')

  logger.warn(new Error('boom'))

  t.equal(mockConsole.errLines[0], 'warning: Error: boom', 'stderr is prefixed')
  t.match(mockConsole.errLines[1], stackLine, 'stderr has the stack')

  t.end()
})

await test('output(err) has the stack on stdout', (t) => {
  const { logger, mockConsole } = createLogger('info')

  logger.output(new Error('boom'))

  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')
  t.equal(mockConsole.outLines[0], 'Error: boom', 'stdout is the error')
  t.match(mockConsole.outLines[1], stackLine, 'stdout has the stack')

  t.end()
})

await test('output(err.message) is a single line', (t) => {
  const { logger, mockConsole } = createLogger('info')

  logger.output(new Error('boom').message)

  t.same(mockConsole.outLines, ['boom'], 'stdout is the message')

  t.end()
})

// The documented pattern: the message at `error`, the details at `debug`.
function logError(logger: Logger, err: unknown): void {
  logger.error(err instanceof Error ? err.message : String(err))
  logger.debug(err)
}

await test('pattern at info shows only the message', (t) => {
  const { logger, mockConsole } = createLogger('info')

  logError(logger, new Error('boom'))

  t.same(mockConsole.errLines, ['error: boom'], 'stderr is the message')
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')

  t.end()
})

await test('pattern at debug also shows the details', (t) => {
  const { logger, mockConsole } = createLogger('debug')

  logError(logger, new Error('boom'))

  t.same(mockConsole.errLines, ['error: boom'], 'stderr is the message')
  t.equal(mockConsole.outLines[0], 'debug: Error: boom', 'stdout is the error')
  t.match(mockConsole.outLines[1], stackLine, 'stdout has the stack')

  t.end()
})

await test('pattern with a non-Error value', (t) => {
  const { logger, mockConsole } = createLogger('debug')

  logError(logger, 'not an error')

  t.same(mockConsole.errLines, ['error: not an error'], 'stderr is the value')
  t.same(mockConsole.outLines, ['debug: not an error'], 'stdout is the value')

  t.end()
})

await test('pattern in the preliminary state', (t) => {
  const { logger, mockConsole } = createLogger()

  logError(logger, new Error('boom'))
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')

  logger.level = 'info'
  t.same(mockConsole.errLines, ['error: boom'], 'stderr is the message')
  // The details are filtered.
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')

  t.end()
})

// ----------------------------------------------------------------------------
