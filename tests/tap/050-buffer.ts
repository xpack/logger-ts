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
 * Test the logger.
 */

// ----------------------------------------------------------------------------

// import { strict as assert } from 'node:assert'

// ----------------------------------------------------------------------------

// https://www.npmjs.com/package/tap
import { test } from 'tap'

// https://www.npmjs.com/package/@xpack/mock-console
import { MockConsole } from '@xpack/mock-console'

// ----------------------------------------------------------------------------

import { Logger } from '../../src/index.js'

// ----------------------------------------------------------------------------

await test('logger level all', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
  })
  t.equal(logger.level, undefined, 'initial level')

  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  logger.trace('trace')
  logger.debug('debug')
  logger.verbose('verbose')
  logger.info('info')
  logger.warn('warn')
  logger.error('error')
  logger.output('output')
  logger.always('always')

  // Nothing changed.
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  logger.level = 'all'
  t.equal(logger.level, 'all', 'level')

  t.equal(mockConsole.outLines.length, 6, 'stdout has 6 entries')
  t.equal(mockConsole.errLines.length, 2, 'stderr has 2 entries')

  t.equal(mockConsole.outLines[0], 'trace: trace', 'stdout is trace')
  t.equal(mockConsole.outLines[1], 'debug: debug', 'stdout is debug')
  t.equal(mockConsole.outLines[2], 'verbose', 'stdout is verbose')
  t.equal(mockConsole.outLines[3], 'info', 'stdout is info')
  t.equal(mockConsole.outLines[4], 'output', 'stdout is output')
  t.equal(mockConsole.outLines[5], 'always', 'stdout is always')

  t.equal(mockConsole.errLines[0], 'warning: warn', 'stderr is warn')
  t.equal(mockConsole.errLines[1], 'error: error', 'stderr is error')

  t.end()
})

await test('logger level trace', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
  })
  t.equal(logger.level, undefined, 'initial level')

  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  logger.trace('trace')
  logger.debug('debug')
  logger.verbose('verbose')
  logger.info('info')
  logger.warn('warn')
  logger.error('error')
  logger.output('output')
  logger.always('always')

  // Nothing changed.
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  logger.level = 'trace'
  t.equal(logger.level, 'trace', 'level')

  t.equal(mockConsole.outLines.length, 6, 'stdout has 6 entries')
  t.equal(mockConsole.errLines.length, 2, 'stderr has 2 entries')

  t.equal(mockConsole.outLines[0], 'trace: trace', 'stdout is trace')
  t.equal(mockConsole.outLines[1], 'debug: debug', 'stdout is debug')
  t.equal(mockConsole.outLines[2], 'verbose', 'stdout is verbose')
  t.equal(mockConsole.outLines[3], 'info', 'stdout is info')
  t.equal(mockConsole.outLines[4], 'output', 'stdout is output')
  t.equal(mockConsole.outLines[5], 'always', 'stdout is always')

  t.equal(mockConsole.errLines[0], 'warning: warn', 'stderr is warn')
  t.equal(mockConsole.errLines[1], 'error: error', 'stderr is error')

  t.end()
})

await test('logger level debug', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
  })
  t.equal(logger.level, undefined, 'initial level')

  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  logger.trace('trace')
  logger.debug('debug')
  logger.verbose('verbose')
  logger.info('info')
  logger.warn('warn')
  logger.error('error')
  logger.output('output')
  logger.always('always')

  // Nothing changed.
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  logger.level = 'debug'
  t.equal(logger.level, 'debug', 'level')

  t.equal(mockConsole.outLines.length, 5, 'stdout has 5 entries')
  t.equal(mockConsole.errLines.length, 2, 'stderr has 2 entries')

  t.equal(mockConsole.outLines[0], 'debug: debug', 'stdout is debug')
  t.equal(mockConsole.outLines[1], 'verbose', 'stdout is verbose')
  t.equal(mockConsole.outLines[2], 'info', 'stdout is info')
  t.equal(mockConsole.outLines[3], 'output', 'stdout is output')
  t.equal(mockConsole.outLines[4], 'always', 'stdout is always')

  t.equal(mockConsole.errLines[0], 'warning: warn', 'stderr is warn')
  t.equal(mockConsole.errLines[1], 'error: error', 'stderr is error')

  t.end()
})

await test('logger level verbose', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
  })
  t.equal(logger.level, undefined, 'initial level')

  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  logger.trace('trace')
  logger.debug('debug')
  logger.verbose('verbose')
  logger.info('info')
  logger.warn('warn')
  logger.error('error')
  logger.output('output')
  logger.always('always')

  // Nothing changed.
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  logger.level = 'verbose'
  t.equal(logger.level, 'verbose', 'level')

  t.equal(mockConsole.outLines.length, 4, 'stdout has 4 entries')
  t.equal(mockConsole.errLines.length, 2, 'stderr has 2 entries')

  t.equal(mockConsole.outLines[0], 'verbose', 'stdout is verbose')
  t.equal(mockConsole.outLines[1], 'info', 'stdout is info')
  t.equal(mockConsole.outLines[2], 'output', 'stdout is output')
  t.equal(mockConsole.outLines[3], 'always', 'stdout is always')

  t.equal(mockConsole.errLines[0], 'warning: warn', 'stderr is warn')
  t.equal(mockConsole.errLines[1], 'error: error', 'stderr is error')

  t.end()
})

await test('logger level info', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
  })
  t.equal(logger.level, undefined, 'initial level')

  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  logger.trace('trace')
  logger.debug('debug')
  logger.verbose('verbose')
  logger.info('info')
  logger.warn('warn')
  logger.error('error')
  logger.output('output')
  logger.always('always')

  // Nothing changed.
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  logger.level = 'info'
  t.equal(logger.level, 'info', 'level')

  t.equal(mockConsole.outLines.length, 3, 'stdout has 3 entries')
  t.equal(mockConsole.errLines.length, 2, 'stderr has 2 entries')

  t.equal(mockConsole.outLines[0], 'info', 'stdout is info')
  t.equal(mockConsole.outLines[1], 'output', 'stdout is output')
  t.equal(mockConsole.outLines[2], 'always', 'stdout is always')

  t.equal(mockConsole.errLines[0], 'warning: warn', 'stderr is warn')
  t.equal(mockConsole.errLines[1], 'error: error', 'stderr is error')

  t.end()
})

await test('logger level warn', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
  })
  t.equal(logger.level, undefined, 'initial level')

  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  logger.trace('trace')
  logger.debug('debug')
  logger.verbose('verbose')
  logger.info('info')
  logger.warn('warn')
  logger.error('error')
  logger.output('output')
  logger.always('always')

  // Nothing changed.
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  logger.level = 'warn'
  t.equal(logger.level, 'warn', 'level')

  t.equal(mockConsole.outLines.length, 2, 'stdout has 2 entries')
  t.equal(mockConsole.errLines.length, 2, 'stderr has 2 entries')

  t.equal(mockConsole.outLines[0], 'output', 'stdout is output')
  t.equal(mockConsole.outLines[1], 'always', 'stdout is always')

  t.equal(mockConsole.errLines[0], 'warning: warn', 'stderr is warn')
  t.equal(mockConsole.errLines[1], 'error: error', 'stderr is error')

  t.end()
})

await test('logger level error', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
  })
  t.equal(logger.level, undefined, 'initial level')

  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  logger.trace('trace')
  logger.debug('debug')
  logger.verbose('verbose')
  logger.info('info')
  logger.warn('warn')
  logger.error('error')
  logger.output('output')
  logger.always('always')

  // Nothing changed.
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  logger.level = 'error'
  t.equal(logger.level, 'error', 'level')

  t.equal(mockConsole.outLines.length, 2, 'stdout has 2 entries')
  t.equal(mockConsole.errLines.length, 1, 'stderr has 1 entry')

  t.equal(mockConsole.outLines[0], 'output', 'stdout is output')
  t.equal(mockConsole.outLines[1], 'always', 'stdout is always')

  t.equal(mockConsole.errLines[0], 'error: error', 'stderr is error')

  t.end()
})

await test('logger level silent', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
  })
  t.equal(logger.level, undefined, 'initial level')

  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  logger.trace('trace')
  logger.debug('debug')
  logger.verbose('verbose')
  logger.info('info')
  logger.warn('warn')
  logger.error('error')
  logger.output('output')
  logger.always('always')

  // Nothing changed.
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  logger.level = 'silent'
  t.equal(logger.level, 'silent', 'level')

  t.equal(mockConsole.outLines.length, 1, 'stdout has 1 entry')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  t.equal(mockConsole.outLines[0], 'always', 'stdout is always')

  t.end()
})

await test('logger level never set', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
  })

  logger.always('always')
  logger.error('error')
  logger.output('output')

  // Nothing is written, not even the `always()` and `error()` messages.
  t.notOk(logger.hasLevel, 'has no level')
  t.equal(mockConsole.outLines.length, 0, 'stdout is empty')
  t.equal(mockConsole.errLines.length, 0, 'stderr is empty')

  t.end()
})

await test('logger level set after a failure', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
  })

  logger.info('buffered')

  // The documented pattern to avoid losing the buffered messages.
  try {
    throw new Error('no level')
  } catch (err) {
    if (!logger.hasLevel) {
      logger.level = Logger.recommendedLevel
    }
    logger.error(err)
  }

  t.equal(logger.level, 'info', 'default level set')
  t.equal(mockConsole.outLines.length, 1, 'stdout has 1 entry')
  t.equal(mockConsole.outLines[0], 'buffered', 'stdout is buffered')
  // The error is expanded, with the stack trace, on several lines.
  t.ok(mockConsole.errLines.length > 0, 'stderr is not empty')
  t.equal(mockConsole.errLines[0], 'Error: no level', 'stderr is the error')

  t.end()
})

// A console that throws on the second call of `log()`.
class ThrowingConsole extends MockConsole {
  calls = 0

  public override log(message?: unknown, ...optionalParams: unknown[]): void {
    this.calls += 1
    if (this.calls === 2) {
      throw new Error('log failed')
    }
    super.log(message, ...optionalParams)
  }
}

await test('logger console throws during flush', (t) => {
  const mockConsole = new ThrowingConsole()
  const logger = new Logger({
    console: mockConsole,
  })

  logger.info('first')
  logger.info('second')
  logger.info('third')

  t.throws(
    () => {
      logger.level = 'info'
    },
    /log failed/,
    'level setter propagates the exception'
  )
  t.equal(logger.level, 'info', 'level is set')
  t.same(mockConsole.outLines, ['first'], 'stdout has only the first')

  // The buffer was emptied, so assigning the level again does not
  // write the same messages a second time.
  logger.level = 'info'
  t.same(mockConsole.outLines, ['first'], 'stdout is not duplicated')

  logger.info('fourth')
  t.same(mockConsole.outLines, ['first', 'fourth'], 'stdout continues')

  t.end()
})

await test('logger second level assignment does not replay', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
  })

  logger.info('first')
  logger.debug('second')

  logger.level = 'debug'
  logger.level = 'info'
  t.same(
    mockConsole.outLines,
    ['first', 'debug: second'],
    'stdout has each message once'
  )

  t.end()
})

await test('preliminary state formats the messages when logged', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
  })

  let calls = 0
  const argument = {
    toString(): string {
      calls += 1
      return 'text'
    },
  }

  // The messages are formatted when logged, even if the final level
  // discards them.
  logger.debug('%s', argument)
  logger.trace('%s', argument)
  t.equal(calls, 2, 'formatted in the preliminary state')

  logger.level = 'error'
  t.equal(calls, 2, 'not formatted again when the buffer is flushed')
  t.equal(mockConsole.outLines.length, 0, 'the messages were discarded')

  // With the level set, a suppressed message is not formatted.
  logger.debug('%s', argument)
  t.equal(calls, 2, 'not formatted when suppressed')

  t.end()
})

await test('preliminary state keeps the messages as formatted', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
  })

  const value = { v: 1 }
  logger.info('%j', value)
  value.v = 2

  logger.level = 'info'
  t.same(mockConsole.outLines, ['{"v":1}'], 'the later change is not seen')

  t.end()
})

await test('preliminary buffer is not limited', (t) => {
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
  })

  const count = 20000
  for (let i = 0; i < count; i++) {
    logger.info(`message ${i}`)
  }

  logger.level = 'info'
  t.equal(mockConsole.outLines.length, count, 'all the messages are kept')
  t.equal(mockConsole.outLines[0], 'message 0', 'in order, from the first')
  t.equal(
    mockConsole.outLines[count - 1],
    `message ${count - 1}`,
    'to the last'
  )

  t.end()
})

// ----------------------------------------------------------------------------
