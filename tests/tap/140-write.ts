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
 * Test what the output methods pass to the protected `write()`, which
 * is the extension point used by subclasses.
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

interface WriteCall {
  numericLevel: number
  message: string | undefined
  func: (message: string) => void
}

// A logger that records the calls of `write()`, and passes them on.
class RecordingLogger extends Logger {
  // The constructor of the base class may call `write()` (the trace
  // message), before this field is initialised, hence the optional type.
  calls?: WriteCall[]

  protected override write(
    numericLevel: number,
    loggerFunction: (message: string) => void,
    message: string | undefined
  ): void {
    ;(this.calls ??= []).push({ numericLevel, message, func: loggerFunction })
    super.write(numericLevel, loggerFunction, message)
  }
}

// The documented table: the numeric level passed to `write()`, the
// stream of the function, and the prefix.
const table: {
  name: OutputMethod
  level: LogLevel | undefined
  stream: 'stdout' | 'stderr'
  prefix: string
}[] = [
  { name: 'always', level: undefined, stream: 'stdout', prefix: '' },
  { name: 'error', level: 'error', stream: 'stderr', prefix: 'error: ' },
  { name: 'output', level: 'error', stream: 'stdout', prefix: '' },
  { name: 'warn', level: 'warn', stream: 'stderr', prefix: 'warning: ' },
  { name: 'info', level: 'info', stream: 'stdout', prefix: '' },
  { name: 'verbose', level: 'verbose', stream: 'stdout', prefix: '' },
  { name: 'debug', level: 'debug', stream: 'stdout', prefix: 'debug: ' },
  { name: 'trace', level: 'trace', stream: 'stdout', prefix: 'trace: ' },
]

await test('write() receives the level, the function, and the message', (t) => {
  for (const spec of table) {
    const mockConsole = new MockConsole()
    const logger = new RecordingLogger({ console: mockConsole, level: 'all' })
    logger.calls = []
    mockConsole.clear()

    logger[spec.name]('text %d', 7)

    t.equal((logger.calls ?? []).length, 1, `${spec.name}() calls write() once`)
    const call = logger.calls?.[0]
    if (call === undefined) {
      continue
    }
    t.equal(
      call.numericLevel,
      spec.level === undefined
        ? Logger.numericLevelAlways
        : Logger.numericLevels[spec.level],
      `${spec.name}() numeric level`
    )
    t.equal(call.message, `${spec.prefix}text 7`, `${spec.name}() message`)

    // The function passed to write() uses the documented stream.
    mockConsole.clear()
    call.func('probe')
    if (spec.stream === 'stdout') {
      t.same(mockConsole.outLines, ['probe'], `${spec.name}() stdout`)
      t.equal(mockConsole.errLines.length, 0, `${spec.name}() no stderr`)
    } else {
      t.same(mockConsole.errLines, ['probe'], `${spec.name}() stderr`)
      t.equal(mockConsole.outLines.length, 0, `${spec.name}() no stdout`)
    }
  }

  t.end()
})

await test('write() is not called for a suppressed message', (t) => {
  const mockConsole = new MockConsole()
  const logger = new RecordingLogger({ console: mockConsole, level: 'error' })
  logger.calls = []

  logger.warn('suppressed')
  logger.info('suppressed')
  logger.verbose('suppressed')
  logger.debug('suppressed')
  logger.trace('suppressed')
  t.equal((logger.calls ?? []).length, 0, 'no calls for the suppressed methods')

  logger.always('always')
  logger.error('error')
  logger.output('output')
  t.equal((logger.calls ?? []).length, 3, 'calls for the others')

  t.end()
})

await test('write() receives all the messages in the preliminary state', (t) => {
  const mockConsole = new MockConsole()
  const logger = new RecordingLogger({ console: mockConsole })
  logger.calls = []

  for (const spec of table) {
    logger[spec.name]('x')
  }

  t.equal(
    (logger.calls ?? []).length,
    table.length,
    'every method calls write()'
  )
  t.same(
    (logger.calls ?? []).map((call) => call.message),
    table.map((spec) => `${spec.prefix}x`),
    'messages with their prefixes'
  )

  t.end()
})

await test('error() with an Error passes the message without prefix', (t) => {
  const mockConsole = new MockConsole()
  const logger = new RecordingLogger({ console: mockConsole, level: 'error' })
  logger.calls = []

  logger.error(new Error('boom'))
  logger.error('context:', new Error('boom'))

  const first = logger.calls?.[0]?.message ?? ''
  const second = logger.calls?.[1]?.message ?? ''
  t.ok(first.startsWith('Error: boom'), 'no prefix when the Error is first')
  t.ok(second.startsWith('error: context: Error: boom'), 'prefix otherwise')

  t.end()
})

await test('write() ignores an undefined message', (t) => {
  class DirectLogger extends Logger {
    public send(message: string | undefined): void {
      this.write(
        Logger.numericLevels.info,
        () => {
          throw new Error('must not be called')
        },
        message
      )
    }
  }

  const mockConsole = new MockConsole()
  const logger = new DirectLogger({ console: mockConsole, level: 'info' })
  t.doesNotThrow(() => {
    logger.send(undefined)
  }, 'nothing is written')

  const preliminary = new DirectLogger({ console: mockConsole })
  preliminary.send(undefined)
  preliminary.level = 'info'
  t.doesNotThrow(() => {
    preliminary.level = 'trace'
  }, 'nothing is buffered')

  t.end()
})

// ----------------------------------------------------------------------------
