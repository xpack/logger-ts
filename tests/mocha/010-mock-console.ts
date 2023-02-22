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

// The `[chai](https://www.chaijs.com)` framework.
import { expect } from 'chai'

import { Mock } from '../mocks/mock-console.js'

// ----------------------------------------------------------------------------

// Test the mock console.
describe('mock console', async () => {
  let mock: Mock

  before(() => {
    mock = new Mock()

    expect(mock.stdout.length).to.equal(0)
    expect(mock.stderr.length).to.equal(0)
  })

  it('check output', () => {
    mock.console.log('output')

    expect(mock.stdout.length).to.equal(1)
    expect(mock.stdout[0]).to.equal('output\n')
    expect(mock.stderr.length).to.equal(0)
  })

  it('check error', () => {
    mock.console.error('error')

    expect(mock.stderr.length).to.equal(1)
    expect(mock.stderr[0]).to.equal('error\n')
  })
})

// ----------------------------------------------------------------------------