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
 * Test the console objects accepted by the logger: a minimal object, with
 * only `log()` and `error()`, and the default console.
 */

// ----------------------------------------------------------------------------

// https://www.npmjs.com/package/tap
import { test } from 'tap'

import { Logger } from '../../src/index.js'

// ----------------------------------------------------------------------------

await test('a minimal console object is used', (t) => {
  const lines: string[] = []
  const minimal = {
    log: (message: unknown): void => {
      lines.push(`log: ${String(message)}`)
    },
    error: (message: unknown): void => {
      lines.push(`error: ${String(message)}`)
    },
  }

  const logger = new Logger({ console: minimal, level: 'all' })
  logger.info('info')
  logger.error('error')
  logger.always('always')

  t.same(
    lines,
    ['log: info', 'error: error: error', 'log: always'],
    'the messages use log() and error()'
  )
  t.equal(logger.console, minimal, 'the accessor returns the same object')

  t.end()
})

await test('the console functions are called as methods', (t) => {
  // The functions use `this`, so they must be called on the object.
  const console = {
    lines: [] as string[],
    log(message: unknown): void {
      this.lines.push(`log: ${String(message)}`)
    },
    error(message: unknown): void {
      this.lines.push(`error: ${String(message)}`)
    },
  }

  const logger = new Logger({ console, level: 'info' })
  logger.info('one')
  logger.warn('two')

  t.same(console.lines, ['log: one', 'error: warning: two'], 'receiver')

  // The same, for the messages buffered in the preliminary state.
  const buffered = {
    lines: [] as string[],
    log(message: unknown): void {
      this.lines.push(`log: ${String(message)}`)
    },
    error(message: unknown): void {
      this.lines.push(`error: ${String(message)}`)
    },
  }
  const preliminary = new Logger({ console: buffered })
  preliminary.info('one')
  preliminary.warn('two')
  preliminary.level = 'info'
  t.same(buffered.lines, ['log: one', 'error: warning: two'], 'buffered')

  t.end()
})

await test('the global console is the default', (t) => {
  t.equal(new Logger().console, console, 'nothing passed')
  t.equal(new Logger({}).console, console, 'empty options')
  t.equal(new Logger({ console: undefined }).console, console, 'undefined')
  t.equal(
    new Logger({ console: null as unknown as Console }).console,
    console,
    'null, from untyped code'
  )

  t.end()
})

await test('a console without log() or error() is rejected', (t) => {
  t.throws(
    () => new Logger({ console: {} as unknown as Console }),
    {
      name: 'TypeError',
      message: 'The console must have a log() function',
    },
    'no log()'
  )
  t.throws(
    () =>
      new Logger({
        console: { log: () => undefined } as unknown as Console,
      }),
    {
      name: 'TypeError',
      message: 'The console must have an error() function',
    },
    'no error()'
  )
  t.throws(
    () =>
      new Logger({
        console: { log: 1, error: () => undefined } as unknown as Console,
      }),
    { name: 'TypeError' },
    'log is not a function'
  )

  t.end()
})

// ----------------------------------------------------------------------------
