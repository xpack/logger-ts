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
/* eslint-disable @typescript-eslint/no-meaningless-void-operator,
   @typescript-eslint/no-unsafe-call --
   the fixture marks the variables as used with void (noUnusedLocals), and
   calls members that must not exist (see the ts-expect-error comments) */

// ----------------------------------------------------------------------------

/**
 * Type-level checks of the console types of the `Logger`. The file is not
 * run; it must only compile, with and without the TypeScript option
 * `exactOptionalPropertyTypes`. It is compiled by `tests/tap/180-types.ts`.
 */

// ----------------------------------------------------------------------------

// https://www.npmjs.com/package/@xpack/mock-console
import { MockConsole } from '@xpack/mock-console'

import { Logger, type LoggerConsole } from '../../src/index.js'

// ----------------------------------------------------------------------------

export function consoleTypes(): void {
  // Nothing passed: a `Logger<Console>`, with a full `Console`.
  const full = new Logger()
  const fullConsole: Console = full.console
  full.console.table([])
  const asLogger: Logger = full
  void fullConsole
  void asLogger

  // An explicit `undefined` is the same as nothing.
  new Logger({ console: undefined })

  // A minimal object is accepted, and its type is kept.
  const minimal = {
    log(): void {
      // Nothing.
    },
    error(): void {
      // Nothing.
    },
  }
  const small = new Logger({ console: minimal })
  const same: typeof minimal = small.console
  void same

  // @ts-expect-error: a minimal console has no `table()`.
  small.console.table([])

  // A mock keeps its own type, so its members are used without a cast.
  const mock = new MockConsole()
  const mocked = new Logger({ console: mock })
  const lines: string[] = mocked.console.outLines
  void lines

  // The logger of a mock is a `Logger`, since the mock is a `Console`.
  const mockedAsLogger: Logger = mocked
  void mockedAsLogger

  // The type is exported, and usable as the type argument.
  const own: LoggerConsole = minimal
  const withOwn = new Logger<LoggerConsole>({ console: own })
  withOwn.console.log('x')

  // Subclasses, with and without the type argument.
  class MyLogger extends Logger {}
  const mine: Logger = new MyLogger()
  void mine

  class MyMockLogger extends Logger<MockConsole> {}
  const mockLines: string[] = new MyMockLogger({ console: mock }).console
    .outLines
  void mockLines

  // A function that takes a `Logger` accepts the default logger.
  const use = (log: Logger): void => {
    log.console.table([])
  }
  use(full)
  use(mocked)

  // @ts-expect-error: a logger of a minimal console is not a `Logger`.
  use(small)

  // @ts-expect-error: the console must have `log()` and `error()`.
  new Logger({ console: { log: () => undefined } })
}

export function consoleIsRequired(): void {
  const mock = new MockConsole()

  // The global console is of the default type, and of the minimal type, so
  // the console is optional.
  new Logger()
  new Logger({ level: 'info' })
  new Logger<Console>({ level: 'info' })
  new Logger<LoggerConsole>()
  new Logger<LoggerConsole>({ level: 'info' })

  // A richer type is not satisfied by the global console, so the console is
  // required, and the type of the accessor is true.
  const mocked = new Logger<MockConsole>({ console: mock })
  const lines: string[] = mocked.console.outLines
  void lines

  // @ts-expect-error: the global console is not a `MockConsole`.
  new Logger<MockConsole>()

  // @ts-expect-error: the global console is not a `MockConsole`.
  new Logger<MockConsole>({ level: 'info' })

  // @ts-expect-error: an explicit `undefined` is the same as nothing.
  new Logger<MockConsole>({ console: undefined })

  // The same for a subclass that fixes the type argument.
  class MyMockLogger extends Logger<MockConsole> {}
  new MyMockLogger({ console: mock })

  // @ts-expect-error: the console is required by the subclass too.
  new MyMockLogger()
}

// ----------------------------------------------------------------------------
