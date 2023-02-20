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
 * Test the mock console.
 */

// ----------------------------------------------------------------------------

// The `[node-tap](http://www.node-tap.org)` framework.
import { test } from 'tap'

import { Mock } from '../mock-console.js'

// ----------------------------------------------------------------------------

// Test the mock console.
// eslint-disable-next-line @typescript-eslint/no-floating-promises
test('mock console', (t) => {
  const mock = new Mock()
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.console.log('output')
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'output\n', 'stdout is output')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.console.error('error')
  t.equal(mock.stderr.length, 1, 'stderr has one entry')
  t.equal(mock.stderr[0], 'error\n', 'stderr is error')

  t.end()
})

// ----------------------------------------------------------------------------
