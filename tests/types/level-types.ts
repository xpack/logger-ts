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
 * Type-level checks of the `level` types of the `Logger`. The file is not
 * run; it must only compile, with and without the TypeScript option
 * `exactOptionalPropertyTypes`. It is compiled by `tests/tap/180-types.ts`,
 * with that option.
 */

// ----------------------------------------------------------------------------

import { Logger, type LogLevel } from '../../src/index.js'

// ----------------------------------------------------------------------------

export function levelTypes(
  maybeLevel: LogLevel | undefined,
  maybeConsole: Console | undefined
): void {
  // An explicit `undefined` is accepted by the constructor, and it is the
  // same as no level; this fails with `exactOptionalPropertyTypes` if the
  // parameters are not declared with `| undefined`.
  const logger = new Logger({ level: maybeLevel, console: maybeConsole })
  new Logger({ level: undefined })
  new Logger({ console: undefined })
  new Logger({})
  new Logger()

  // The getter may return `undefined`, in the preliminary state.
  const current: LogLevel | undefined = logger.level
  void current

  // The setter accepts only a level name.
  logger.level = 'info'

  // @ts-expect-error: `undefined` throws a `TypeError`.
  logger.level = undefined

  // @ts-expect-error: a string that is not known to the compiler.
  logger.level = 'verbos'
}

export function staticsAreReadOnly(): void {
  // Reading is fine, and the numeric levels have literal types.
  const info: 30 = Logger.numericLevels.info
  const levels: readonly LogLevel[] = Logger.levelNames
  const fallback: LogLevel = Logger.recommendedLevel
  // The deprecated name still compiles.
  const deprecated: LogLevel = Logger.defaultLevel
  void deprecated
  void info
  void levels
  void fallback

  // @ts-expect-error: `recommendedLevel` is read-only.
  Logger.recommendedLevel = 'debug'

  // @ts-expect-error: `defaultLevel` is read-only.
  Logger.defaultLevel = 'debug'

  // @ts-expect-error: the properties of `numericLevels` are read-only.
  Logger.numericLevels.info = 99

  // @ts-expect-error: `numericLevels` is read-only.
  Logger.numericLevels = { ...Logger.numericLevels }

  // @ts-expect-error: `numericLevelUndefined` is read-only.
  Logger.numericLevelUndefined = 5

  // @ts-expect-error: `numericLevelAlways` is read-only.
  Logger.numericLevelAlways = 0

  // @ts-expect-error: `levelNames` is a read-only array.
  Logger.levelNames.push('info')
}

// A subclass may override `write()`, and use the deprecated protected
// members; outside code cannot use them.
export function protectedMembers(): void {
  class Extended extends Logger {
    protected override write(
      numericLevel: number,
      loggerFunction: (message: string) => void,
      message: string | undefined
    ): void {
      super.write(numericLevel, loggerFunction, message)
    }

    probe(): number {
      void this._console
      void this.levelName
      void this.buffer
      return this.levelNumericValue
    }
  }
  void new Extended().probe()

  const logger = new Logger()

  // @ts-expect-error: `write()` is protected.
  logger.write(0, () => undefined, 'x')

  // @ts-expect-error: `buffer` is protected.
  void logger.buffer

  // @ts-expect-error: `levelNumericValue` is protected.
  void logger.levelNumericValue

  // @ts-expect-error: `levelName` is protected.
  void logger.levelName

  // @ts-expect-error: `_console` is protected.
  void logger._console
}

// The `timestamp` option is optional, accepts an explicit `undefined`, and
// the accessor is read-only.
export function timestampOption(maybe: boolean | undefined): void {
  const on = new Logger({ timestamp: true })
  new Logger({ timestamp: maybe })
  new Logger({ timestamp: undefined, level: 'info' })

  const enabled: boolean = on.timestamp
  void enabled

  // @ts-expect-error: the accessor is read-only.
  on.timestamp = false

  // @ts-expect-error: the option is a boolean.
  new Logger({ timestamp: 'yes' })
}

// ----------------------------------------------------------------------------
