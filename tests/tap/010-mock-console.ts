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

/* eslint valid-jsdoc: "error" */
/* eslint max-len: [ "error", 80, { "ignoreUrls": true } ] */

// ----------------------------------------------------------------------------

/**
 * Test the mock console.
 */

// ----------------------------------------------------------------------------

// The `[node-tap](http://www.node-tap.org)` framework.
import { test } from 'tap'

import { Mock } from '../mocks/mock-console.js'

// ----------------------------------------------------------------------------

// Test the mock console.
await test('mock console', (t) => {
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
