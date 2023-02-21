/*
 * This file is part of the xPack project (http://xpack.github.io).
 * Copyright (c) 2017 Liviu Ionescu. All rights reserved.
 *
 * Licensed under the terms of the MIT License.
 * See LICENSE in the project root for license information.
 */

/* eslint valid-jsdoc: "error" */
/* eslint max-len: [ "error", 80, { "ignoreUrls": true } ] */

// ----------------------------------------------------------------------------

/**
 * Test the logger.
 */

// ----------------------------------------------------------------------------

import { strict as assert } from 'node:assert'

// The `[node-tap](http://www.node-tap.org)` framework.
import { test } from 'tap'

import { Logger } from '../../index.js'

assert(Logger)

// ----------------------------------------------------------------------------

await test('logger default', (t) => {
  const logger = new Logger()
  t.equal(logger.level, undefined, 'initial level')
  // eslint-disable-next-line eqeqeq
  t.ok(logger.console === console, 'system console')

  t.end()
})

// ----------------------------------------------------------------------------
