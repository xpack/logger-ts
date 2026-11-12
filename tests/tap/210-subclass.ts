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
/* eslint-disable @typescript-eslint/no-deprecated --
   the test checks the deprecated protected members */

// ----------------------------------------------------------------------------

/**
 * Test the members that subclasses may use: `write()`, which is the
 * supported extension point, and the deprecated protected members that
 * give direct access to the state, which must keep their behaviour until
 * they are removed in the next major version.
 */

// ----------------------------------------------------------------------------

// https://www.npmjs.com/package/tap
import { test } from 'tap'

// https://www.npmjs.com/package/@xpack/mock-console
import { MockConsole } from '@xpack/mock-console'

// ----------------------------------------------------------------------------

import { Logger } from '../../src/index.js'

// ----------------------------------------------------------------------------

// A subclass that exposes the deprecated protected members.
class Probe extends Logger {
  get probeConsole(): Console {
    return this._console
  }

  get probeNumericLevel(): number {
    return this.levelNumericValue
  }

  set probeNumericLevel(value: number) {
    this.levelNumericValue = value
  }

  // The getter is wider than the setter on purpose: the setter takes the one
  // value that the test writes.
  // eslint-disable-next-line @typescript-eslint/related-getter-setter-pairs
  get probeLevelName(): string | undefined {
    return this.levelName
  }

  set probeLevelName(value: 'trace' | undefined) {
    this.levelName = value
  }

  // The getter is narrower than the setter on purpose, like the deprecated
  // member that it exposes (see the cast in the test).
  // eslint-disable-next-line @typescript-eslint/related-getter-setter-pairs
  get probeBuffer(): { message: string; numericLevel: number }[] {
    return this.buffer
  }

  set probeBuffer(value: typeof this.buffer) {
    this.buffer = value
  }
}

await test('the state is not visible in the object', (t) => {
  const logger = new Logger({ console: new MockConsole(), level: 'info' })

  // The state is in private fields, so it is not a property of the object.
  t.same(Object.keys(logger), [], 'no own enumerable properties')
  t.same(Object.getOwnPropertyNames(logger), [], 'no own properties')
  t.equal(JSON.stringify(logger), '{}', 'nothing to serialise')

  t.end()
})

await test('deprecated _console', (t) => {
  const mockConsole = new MockConsole()
  t.equal(
    new Probe({ console: mockConsole }).probeConsole,
    mockConsole,
    'passed'
  )
  t.equal(new Probe().probeConsole, console, 'default')

  t.end()
})

await test('deprecated levelNumericValue', (t) => {
  const probe = new Probe({ console: new MockConsole() })
  t.equal(probe.probeNumericLevel, Logger.numericLevelUndefined, 'unset')

  probe.level = 'info'
  t.equal(probe.probeNumericLevel, Logger.numericLevels.info, 'after set')

  // The previous behaviour: writing it changes the level checks, without
  // changing the level name.
  probe.probeNumericLevel = Logger.numericLevels.debug
  t.ok(probe.isDebugEnabled, 'the checks use the new value')
  t.equal(probe.level, 'info', 'the name is unchanged')

  t.end()
})

await test('deprecated levelName', (t) => {
  const probe = new Probe({ console: new MockConsole() })
  t.equal(probe.probeLevelName, undefined, 'unset')

  probe.level = 'info'
  t.equal(probe.probeLevelName, 'info', 'after set')

  // The previous behaviour: writing it changes the name, not the checks.
  probe.probeLevelName = 'trace'
  t.equal(probe.level, 'trace', 'the name is changed')
  t.notOk(probe.isTraceEnabled, 'the checks are unchanged')

  t.end()
})

await test('deprecated buffer', (t) => {
  const mockConsole = new MockConsole()
  const probe = new Probe({ console: mockConsole })

  probe.info('one')
  probe.warn('two')
  t.equal(probe.probeBuffer.length, 2, 'the messages are in the buffer')
  t.same(
    probe.probeBuffer.map((record) => record.message),
    ['one', 'warning: two'],
    'the records have the formatted messages'
  )
  t.same(
    probe.probeBuffer.map((record) => record.numericLevel),
    [Logger.numericLevels.info, Logger.numericLevels.warn],
    'and their numeric levels'
  )

  // The previous behaviour: a record added to the buffer is written, when
  // the level is set, if it passes the level.
  probe.probeBuffer.push({
    message: 'injected',
    numericLevel: Logger.numericLevels.info,
    func: (message: string) => {
      mockConsole.log(message)
    },
  } as unknown as { message: string; numericLevel: number })
  probe.level = 'info'
  t.same(
    mockConsole.outLines,
    ['one', 'injected'],
    'the injected record is written'
  )
  t.equal(probe.probeBuffer.length, 0, 'the buffer is emptied')

  t.end()
})

await test('deprecated buffer, assignment', (t) => {
  const mockConsole = new MockConsole()
  const probe = new Probe({ console: mockConsole })

  probe.info('discarded')
  // The previous behaviour: replacing the buffer drops the messages.
  probe.probeBuffer = []
  probe.level = 'info'
  t.equal(mockConsole.outLines.length, 0, 'nothing is written')

  t.end()
})

await test('write() is the supported extension point', (t) => {
  const mockConsole = new MockConsole()
  const seen: string[] = []

  class Upper extends Logger {
    protected override write(
      numericLevel: number,
      loggerFunction: (message: string) => void,
      message: string | undefined
    ): void {
      seen.push(`${String(numericLevel)}:${String(message)}`)
      super.write(numericLevel, loggerFunction, message?.toUpperCase())
    }
  }

  const logger = new Upper({ console: mockConsole, level: 'info' })
  logger.info('hello')
  logger.debug('suppressed')

  t.same(seen, ['30:hello'], 'write() sees the messages that pass the level')
  t.same(mockConsole.outLines, ['HELLO'], 'and can change them')

  t.end()
})

// ----------------------------------------------------------------------------
