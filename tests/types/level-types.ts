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

// ----------------------------------------------------------------------------
