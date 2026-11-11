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
   the test checks the deprecated defaultLevel */

// ----------------------------------------------------------------------------

/**
 * Test the logger.
 */

// ----------------------------------------------------------------------------

// import { strict as assert } from 'node:assert'

// ----------------------------------------------------------------------------

// https://www.npmjs.com/package/tap
import { test } from 'tap'

// ----------------------------------------------------------------------------

import { Logger } from '../../src/index.js'

// ----------------------------------------------------------------------------

await test('logger default', (t) => {
  const logger = new Logger()
  t.equal(logger.level, undefined, 'initial level')
  t.ok(logger.console === console, 'system console')

  t.end()
})

await test('the recommended level is never applied', (t) => {
  t.equal(Logger.recommendedLevel, 'info', 'recommended level')

  // A logger without a level stays in the preliminary state.
  const logger = new Logger()
  t.equal(logger.level, undefined, 'no level')
  t.notOk(logger.hasLevel, 'preliminary state')

  // The application uses it explicitly.
  logger.level = Logger.recommendedLevel
  t.equal(logger.level, 'info', 'level set explicitly')

  t.end()
})

await test('defaultLevel is a deprecated alias of recommendedLevel', (t) => {
  // The previous name keeps working, with the same value, until it is
  // removed in the next major version.
  t.equal(Logger.defaultLevel, Logger.recommendedLevel, 'same value')
  t.equal(Logger.defaultLevel, 'info', 'info')

  // It never was applied either.
  t.equal(new Logger().level, undefined, 'a new logger has no level')

  t.end()
})

// ----------------------------------------------------------------------------
