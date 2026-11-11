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
 * Test the behaviour with untrusted input, as documented in
 * "Logging untrusted input".
 */

// ----------------------------------------------------------------------------

// https://www.npmjs.com/package/tap
import { test } from 'tap'

// https://www.npmjs.com/package/@xpack/mock-console
import { MockConsole } from '@xpack/mock-console'

// ----------------------------------------------------------------------------

import { Logger } from '../../src/index.js'

// ----------------------------------------------------------------------------

const forged = 'bob\nerror: forged line'
const escape = 'x\u001b[31mred\u001b[0m'

function createLogger(): { logger: Logger; mockConsole: MockConsole } {
  const mockConsole = new MockConsole()
  const logger = new Logger({ console: mockConsole, level: 'all' })
  // Ignore the constructor trace.
  mockConsole.clear()
  return { logger, mockConsole }
}

await test('a newline forges a line, the prefix is on the first', (t) => {
  const { logger, mockConsole } = createLogger()

  logger.warn(forged)

  t.same(
    mockConsole.errLines,
    ['warning: bob', 'error: forged line'],
    'the second line looks like a genuine error line'
  )

  t.end()
})

await test('%s does not escape newlines or control characters', (t) => {
  const { logger, mockConsole } = createLogger()

  logger.info('user: %s', forged)
  logger.info('%s', escape)

  t.same(
    mockConsole.outLines,
    ['user: bob', 'error: forged line', escape],
    'the string is written as it is'
  )

  t.end()
})

await test('%j and %O escape newlines and control characters', (t) => {
  const { logger, mockConsole } = createLogger()

  logger.info('%j', forged)
  logger.info('%O', forged)
  logger.info('%j', escape)
  logger.info('%O', escape)

  t.same(
    mockConsole.outLines,
    [
      '"bob\\nerror: forged line"',
      "'bob\\nerror: forged line'",
      '"x\\u001b[31mred\\u001b[0m"',
      "'x\\x1B[31mred\\x1B[0m'",
    ],
    'each message is on a single line, between quotes'
  )

  t.end()
})

await test('control characters are passed unchanged', (t) => {
  const { logger, mockConsole } = createLogger()

  logger.info(escape)
  logger.info('a\rb')

  t.same(mockConsole.outLines, [escape, 'a\rb'], 'no escaping')

  t.end()
})

await test('directives in the first argument consume the arguments', (t) => {
  const { logger, mockConsole } = createLogger()

  // A single argument is not processed.
  logger.info('100%d %s')
  // With further arguments the directives are interpreted.
  logger.info('100%d %s', 5)
  // The untrusted text, as the first argument, consumes the secret.
  const text = '%s'
  logger.info(text, 'SECRET')
  // As an argument of a constant format, it does not.
  logger.info('%s', text, 'SECRET')

  t.same(
    mockConsole.outLines,
    ['100%d %s', '1005 %s', 'SECRET', '%s SECRET'],
    'directives are interpreted only with further arguments'
  )

  t.end()
})

await test('%j calls toJSON(), %s and %O do not', (t) => {
  const { logger, mockConsole } = createLogger()

  let calls = 0
  const object = {
    toJSON(): unknown {
      calls += 1
      return { y: 2 }
    },
  }

  logger.info('%s', object)
  logger.info('%O', object)
  t.equal(calls, 0, 'toJSON() is not called by %s and %O')

  logger.info('%j', object)
  t.equal(calls, 1, 'toJSON() is called by %j')
  t.equal(mockConsole.outLines[2], '{"y":2}', 'the result of toJSON()')

  t.end()
})

// ----------------------------------------------------------------------------
