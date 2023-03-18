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

/* eslint max-len: [ "error", 80, { "ignoreUrls": true } ] */

// ----------------------------------------------------------------------------

/**
 * Test the mock console.
 */

// ----------------------------------------------------------------------------

// The `[node-tap](http://www.node-tap.org)` framework.
import { test } from 'tap'

import { MockConsole } from '../mocks/mock-console.js'

// ----------------------------------------------------------------------------

// Test the mock console.
await test('mock console', (t) => {
  const mockConsole = new MockConsole()
  t.equal(mockConsole.stdout.length, 0, 'stdout is empty')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  mockConsole.log('output')
  t.equal(mockConsole.stdout.length, 1, 'stdout has one entry')
  t.equal(mockConsole.stdout[0], 'output\n', 'stdout is output')
  t.equal(mockConsole.stderr.length, 0, 'stderr is empty')

  mockConsole.error('error')
  t.equal(mockConsole.stderr.length, 1, 'stderr has one entry')
  t.equal(mockConsole.stderr[0], 'error\n', 'stderr is error')

  t.end()
})

// ----------------------------------------------------------------------------
