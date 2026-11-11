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
 * Test the `timestamp` option: the messages of the methods that have a
 * prefix start with a timestamp, in the local time, and the prefix is
 * replaced by the kind in square brackets. It is tied to the method, not
 * to the prefix that is written. The clock is controlled with the Node.js
 * mock timers.
 */

// ----------------------------------------------------------------------------

import { mock } from 'node:test'

// https://www.npmjs.com/package/tap
import { test } from 'tap'

// https://www.npmjs.com/package/@xpack/mock-console
import { MockConsole } from '@xpack/mock-console'

// ----------------------------------------------------------------------------

import { Logger } from '../../src/index.js'

// ----------------------------------------------------------------------------

// A UTC instant; the local time depends on the time zone of the machine.
const start = '2026-11-11T20:15:37.123Z'

// The expected local time of an instant, computed independently of the
// library, from the parts of the date (the time zone of the machine).
function local(iso: string): string {
  const date = new Date(iso)
  const two = (value: number): string => String(value).padStart(2, '0')
  return (
    `${String(date.getFullYear())}-${two(date.getMonth() + 1)}-` +
    `${two(date.getDate())} ${two(date.getHours())}:` +
    `${two(date.getMinutes())}:${two(date.getSeconds())}.` +
    String(date.getMilliseconds()).padStart(3, '0')
  )
}

// Run a function with the mock clock at a given time.
function withClock(
  now: string,
  fn: (tick: (ms: number) => void) => void
): void {
  mock.timers.enable({ apis: ['Date'], now: Date.parse(now) })
  try {
    fn((ms) => {
      mock.timers.tick(ms)
    })
  } finally {
    mock.timers.reset()
  }
}

// The kind of every method (empty for the methods without a prefix), and
// the stream of its output.
const methods = {
  always: { kind: '', stream: 'out' },
  error: { kind: 'error', stream: 'err' },
  output: { kind: '', stream: 'out' },
  warn: { kind: 'warning', stream: 'err' },
  info: { kind: '', stream: 'out' },
  verbose: { kind: '', stream: 'out' },
  debug: { kind: 'debug', stream: 'out' },
  trace: { kind: 'trace', stream: 'out' },
} as const

type MethodName = keyof typeof methods

const names = Object.keys(methods) as MethodName[]

function linesOf(mockConsole: MockConsole, name: MethodName): string[] {
  return methods[name].stream === 'out'
    ? mockConsole.outLines
    : mockConsole.errLines
}

await test('the timestamp is off by default', (t) => {
  t.equal(new Logger().timestamp, false, 'the accessor is false')
  t.equal(new Logger({ timestamp: undefined }).timestamp, false, 'undefined')
  t.equal(new Logger({ timestamp: false }).timestamp, false, 'false')

  // Without the option the messages keep the prefix.
  withClock(start, () => {
    for (const name of names) {
      const { kind } = methods[name]
      const mockConsole = new MockConsole()
      const logger = new Logger({ console: mockConsole, level: 'all' })
      logger[name]('message')
      t.same(
        linesOf(mockConsole, name),
        [`${kind === '' ? '' : `${kind}: `}message`],
        `${name}() has the prefix, and no timestamp`
      )
    }
  })

  t.end()
})

await test('the timestamp and the kind are tied to the method', (t) => {
  withClock(start, () => {
    for (const name of names) {
      const { kind } = methods[name]
      const mockConsole = new MockConsole()
      const logger = new Logger({
        console: mockConsole,
        level: 'all',
        timestamp: true,
      })
      t.equal(logger.timestamp, true, 'the accessor is true')

      logger[name]('message')
      t.same(
        linesOf(mockConsole, name),
        [kind === '' ? 'message' : `${local(start)} [${kind}] message`],
        `${name}() ${kind === '' ? 'is not stamped' : 'is stamped'}`
      )
    }
  })

  t.end()
})

await test('an Error that comes first is stamped, with the kind', (t) => {
  withClock(start, () => {
    const mockConsole = new MockConsole()
    const logger = new Logger({
      console: mockConsole,
      level: 'all',
      timestamp: true,
    })

    logger.error(new Error('boom'))
    logger.warn(new Error('boom'))

    const lines = mockConsole.errLines
    t.equal(
      lines[0],
      `${local(start)} [error] Error: boom`,
      'error(err): the kind is shown, unlike the prefix'
    )
    t.match(lines[1], /^ {4}at /, 'the stack lines are not stamped')
    const warning = lines.findIndex((line) => line.includes('[warning]'))
    t.equal(
      lines[warning],
      `${local(start)} [warning] Error: boom`,
      'warn(err)'
    )
  })

  t.end()
})

await test('only the first line is stamped', (t) => {
  withClock(start, () => {
    const mockConsole = new MockConsole()
    const logger = new Logger({
      console: mockConsole,
      level: 'all',
      timestamp: true,
    })

    // The layout of a typical editor log: the message, then the error.
    logger.error('Calculating failed.\nError: no configuration found')
    logger.warn('first\nsecond')

    t.same(
      mockConsole.errLines,
      [
        `${local(start)} [error] Calculating failed.`,
        'Error: no configuration found',
        `${local(start)} [warning] first`,
        'second',
      ],
      'the following lines are not stamped'
    )
  })

  t.end()
})

await test('the time is taken when the message is logged', (t) => {
  withClock(start, (tick) => {
    const mockConsole = new MockConsole()
    // The preliminary state: the messages are written later.
    const logger = new Logger({ console: mockConsole, timestamp: true })

    logger.warn('first')
    tick(5000)
    logger.debug('second')
    tick(3000)
    logger.level = 'all'

    t.same(
      mockConsole.errLines,
      [`${local(start)} [warning] first`],
      'the first keeps its time'
    )
    t.same(
      mockConsole.outLines,
      [`${local('2026-11-11T20:15:42.123Z')} [debug] second`],
      'the second keeps its time, not the time of the flush'
    )
  })

  t.end()
})

await test('the format is the local time with milliseconds', (t) => {
  // The real clock.
  const mockConsole = new MockConsole()
  const logger = new Logger({
    console: mockConsole,
    level: 'all',
    timestamp: true,
  })
  logger.warn('real')

  t.match(
    mockConsole.errLines[0],
    /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} \[warning\] real$/,
    'date, time, milliseconds, no zone, then the kind'
  )

  t.end()
})

await test('the time is padded', (t) => {
  // Single digits everywhere: the instant is built from local parts, so the
  // expected text does not depend on the time zone.
  const local1 = new Date(2026, 0, 2, 3, 4, 5, 6)
  withClock(local1.toISOString(), () => {
    const mockConsole = new MockConsole()
    const logger = new Logger({
      console: mockConsole,
      level: 'all',
      timestamp: true,
    })
    logger.warn('x')
    t.equal(
      mockConsole.errLines[0],
      '2026-01-02 03:04:05.006 [warning] x',
      'zero padded'
    )
  })

  t.end()
})

// Fixed time zones, for the machines where the `TZ` variable is honoured.
const zones: [string, string, number, string][] = [
  ['UTC', start, 0, '2026-11-11 20:15:37.123'],
  ['Europe/Bucharest', start, -120, '2026-11-11 22:15:37.123'],
  ['America/New_York', start, 300, '2026-11-11 15:15:37.123'],
  // The date changes with the zone.
  [
    'Europe/Bucharest',
    '2026-11-11T23:30:00.000Z',
    -120,
    '2026-11-12 01:30:00.000',
  ],
  [
    'America/New_York',
    '2026-11-11T02:30:00.000Z',
    300,
    '2026-11-10 21:30:00.000',
  ],
]

await test('the local time follows the time zone', (t) => {
  const saved = process.env['TZ']
  try {
    for (const [zone, instant, offset, expected] of zones) {
      process.env['TZ'] = zone
      if (new Date(instant).getTimezoneOffset() !== offset) {
        t.comment(`the TZ variable has no effect for ${zone}, skipped`)
        continue
      }

      withClock(instant, () => {
        const mockConsole = new MockConsole()
        const logger = new Logger({
          console: mockConsole,
          level: 'all',
          timestamp: true,
        })
        logger.warn('zone')
        t.equal(
          mockConsole.errLines[0],
          `${expected} [warning] zone`,
          `${zone}, ${instant}`
        )
      })
    }
  } finally {
    if (saved === undefined) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete process.env['TZ']
    } else {
      process.env['TZ'] = saved
    }
  }

  t.end()
})

await test('write() receives the message with the timestamp', (t) => {
  withClock(start, () => {
    const seen: string[] = []
    class Recording extends Logger {
      protected override write(
        numericLevel: number,
        loggerFunction: (message: string) => void,
        message: string | undefined
      ): void {
        seen.push(String(message))
        super.write(numericLevel, loggerFunction, message)
      }
    }

    const logger = new Recording({
      console: new MockConsole(),
      level: 'all',
      timestamp: true,
    })
    logger.warn('one')
    logger.info('two')

    t.same(seen, [`${local(start)} [warning] one`, 'two'], 'the stamped one')
  })

  t.end()
})

await test('the timestamp option must be a boolean', (t) => {
  const bad: [unknown, string][] = [
    ['yes', 'string'],
    [1, 'number'],
    [null, 'null'],
    [{}, 'object'],
  ]

  for (const [value, type] of bad) {
    t.throws(
      () => new Logger({ timestamp: value as boolean }),
      {
        name: 'TypeError',
        message: `The timestamp option must be a boolean, not ${type}`,
      },
      `${String(JSON.stringify(value))}`
    )
  }

  t.end()
})

await test('the timestamp cannot be changed', (t) => {
  const logger = new Logger({ timestamp: true })

  t.throws(
    () => {
      ;(logger as unknown as { timestamp: boolean }).timestamp = false
    },
    TypeError,
    'the accessor has no setter'
  )
  t.equal(logger.timestamp, true, 'unchanged')

  t.end()
})

// ----------------------------------------------------------------------------
