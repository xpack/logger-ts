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

import { runInNewContext } from 'node:vm'

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

// The prefix of every method, and the stream of its output.
const methods = {
  always: { prefix: '', stream: 'out' },
  error: { prefix: 'error: ', stream: 'err' },
  output: { prefix: '', stream: 'out' },
  warn: { prefix: 'warning: ', stream: 'err' },
  info: { prefix: '', stream: 'out' },
  verbose: { prefix: '', stream: 'out' },
  debug: { prefix: 'debug: ', stream: 'out' },
  trace: { prefix: 'trace: ', stream: 'out' },
} as const

type MethodName = keyof typeof methods

const names = Object.keys(methods) as MethodName[]

function linesOf(mockConsole: MockConsole, name: MethodName): string[] {
  return methods[name].stream === 'out'
    ? mockConsole.outLines
    : mockConsole.errLines
}

await test('only error() omits the prefix, and only for a first Error', (t) => {
  for (const name of names) {
    const { prefix } = methods[name]

    // An `Error` that comes first: only error() drops its prefix.
    const first = createLogger('all')
    first.logger[name](new Error('boom'))
    const firstLines = linesOf(first.mockConsole, name)
    t.equal(
      firstLines[0],
      name === 'error' ? 'Error: boom' : `${prefix}Error: boom`,
      `${name}(err)`
    )
    t.match(firstLines[1], stackLine, `${name}(err) has the stack`)

    // An `Error` that does not come first: all the methods keep the prefix.
    const later = createLogger('all')
    later.logger[name]('context:', new Error('boom'))
    t.equal(
      linesOf(later.mockConsole, name)[0],
      `${prefix}context: Error: boom`,
      `${name}('context:', err)`
    )
  }

  t.end()
})

await test('error() omits its prefix for an Error of another realm', (t) => {
  // `instanceof Error` is false for these, but `util.format()` expands
  // them as errors, so they are handled like an `Error` of this realm.
  const foreign: unknown[] = [
    runInNewContext('new Error("foreign")'),
    runInNewContext('new TypeError("foreign")'),
    runInNewContext('class Custom extends Error {}; new Custom("foreign")'),
  ]

  for (const err of foreign) {
    t.notOk(err instanceof Error, 'the error is of another realm')

    const { logger, mockConsole } = createLogger('error')
    logger.error(err)
    t.match(mockConsole.errLines[0], /foreign$/, 'the first line')
    t.notMatch(mockConsole.errLines[0], /^error: /, 'no prefix')
    t.match(mockConsole.errLines[1], stackLine, 'the stack follows')

    // Not first: the prefix is kept, as for an `Error` of this realm.
    const later = createLogger('error')
    later.logger.error('context:', err)
    t.match(later.mockConsole.errLines[0], /^error: context: /, 'prefix kept')
  }

  // Buffered, in the preliminary state.
  const buffered = createLogger()
  buffered.logger.error(foreign[0])
  buffered.logger.level = 'error'
  t.equal(buffered.mockConsole.errLines[0], 'Error: foreign', 'buffered')

  t.end()
})

await test('error() keeps its prefix for an object that is no Error', (t) => {
  // It has the properties of an error, but it is not one.
  const lookalike = { name: 'Error', message: 'fake', stack: 'Error: fake' }

  const { logger, mockConsole } = createLogger('error')
  logger.error(lookalike)
  t.match(mockConsole.errLines[0], /^error: /, 'prefix kept')

  // An object that inherits from `Error` is one, as for `instanceof`.
  const inheriting = Object.create(Error.prototype) as Error
  const second = createLogger('error')
  second.logger.error(inheriting)
  t.notMatch(second.mockConsole.errLines[0], /^error: /, 'inheriting Error')

  t.end()
})

await test('the prefix rule is the same for the buffered messages', (t) => {
  for (const name of names) {
    const { prefix } = methods[name]

    const buffered = createLogger()
    buffered.logger[name](new Error('boom'))
    buffered.logger[name]('context:', new Error('boom'))
    buffered.logger.level = 'all'

    const lines = linesOf(buffered.mockConsole, name)
    t.equal(
      lines[0],
      name === 'error' ? 'Error: boom' : `${prefix}Error: boom`,
      `${name}(err), buffered`
    )
    t.ok(
      lines.includes(`${prefix}context: Error: boom`),
      `${name}('context:', err), buffered`
    )
  }

  t.end()
})

// ----------------------------------------------------------------------------
