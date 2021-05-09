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
 * Test the logger.
 */

// ----------------------------------------------------------------------------

const assert = require('assert')

// The `[node-tap](http://www.node-tap.org)` framework.
const test = require('tap').test

const { Mock } = require('../mock-console.js')
const { Logger } = require('../../dist/index.js')

assert(Logger)

// ----------------------------------------------------------------------------

test('logger level all empty', (t) => {
  const mock = new Mock()
  const logger = new Logger({
    console: mock.console,
    level: 'all'
  })
  t.equal(logger.level, 'all', 'level')

  mock.clear()
  logger.trace()
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'trace: \n', 'stdout is trace')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.debug()
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], 'debug: \n', 'stdout is debug')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.verbose()
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], '\n', 'stdout is verbose')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.info()
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], '\n', 'stdout is info')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.warn()
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 1, 'stderr has one entry')
  t.equal(mock.stderr[0], 'warning: \n', 'stderr is warn')

  mock.clear()
  logger.error()
  t.equal(mock.stdout.length, 0, 'stdout is empty')
  t.equal(mock.stderr.length, 1, 'stderr has one entry')
  t.equal(mock.stderr[0], 'error: \n', 'stderr is error')

  mock.clear()
  logger.output()
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], '\n', 'stdout is nl')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  mock.clear()
  logger.always()
  t.equal(mock.stdout.length, 1, 'stdout has one entry')
  t.equal(mock.stdout[0], '\n', 'stdout is nl')
  t.equal(mock.stderr.length, 0, 'stderr is empty')

  t.end()
})

// ----------------------------------------------------------------------------
