/*
 * This file is part of the xPack project (http://xpack.github.io).
 * Copyright (c) 2017 Liviu Ionescu. All rights reserved.
 *
 * Permission to use, copy, modify, and/or distribute this software
 * for any purpose is hereby granted, under the terms of the MIT license.
 *
 * If a copy of the license was not distributed with this file, it can
 * be obtained from https://opensource.org/licenses/MIT/.
 */

// ----------------------------------------------------------------------------

/**
 * Test the logger.
 */

// ----------------------------------------------------------------------------

import { strict as assert } from 'node:assert'

// The `[node-tap](http://www.node-tap.org)` framework.
import { test } from 'tap'

import { Logger } from '../../src/index.js'

assert(Logger)

// ----------------------------------------------------------------------------

await test('logger default', (t) => {
  const logger = new Logger()
  t.equal(logger.level, undefined, 'initial level')
  t.ok(logger.console === console, 'system console')

  t.end()
})

// ----------------------------------------------------------------------------
