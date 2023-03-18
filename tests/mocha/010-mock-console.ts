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

// The `[chai](https://www.chaijs.com)` framework.
import { expect } from 'chai'

import { MockConsole } from '../mocks/mock-console.js'

// ----------------------------------------------------------------------------

// Test the mock console.
describe('mock console', async () => {
  let mockConsole: MockConsole

  before(() => {
    mockConsole = new MockConsole()

    expect(mockConsole.stdout.length).to.equal(0)
    expect(mockConsole.stderr.length).to.equal(0)
  })

  it('check output', () => {
    mockConsole.log('output')

    expect(mockConsole.stdout.length).to.equal(1)
    expect(mockConsole.stdout[0]).to.equal('output\n')
    expect(mockConsole.stderr.length).to.equal(0)
  })

  it('check error', () => {
    mockConsole.error('error')

    expect(mockConsole.stderr.length).to.equal(1)
    expect(mockConsole.stderr[0]).to.equal('error\n')
  })
})

// ----------------------------------------------------------------------------
