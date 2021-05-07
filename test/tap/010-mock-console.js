/*
 * This file is part of the xPack distribution
 *   (http://xpack.github.io).
 * Copyright (c) 2017 Liviu Ionescu.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

'use strict'
/* eslint valid-jsdoc: "error" */
/* eslint max-len: [ "error", 80, { "ignoreUrls": true } ] */

// ----------------------------------------------------------------------------

/**
 * Test the mock console.
 */

// ----------------------------------------------------------------------------

// The `[node-tap](http://www.node-tap.org)` framework.
const { test } = require('tap')

const Mock = require('../mock-console.js').Mock

// ----------------------------------------------------------------------------

// Test the mock console.
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
