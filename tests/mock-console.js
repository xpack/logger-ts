/*
 * This file is part of the xPack project (http://xpack.github.io).
 * Copyright (c) 2017 Liviu Ionescu. All rights reserved.
 *
 * Licensed under the terms of the MIT License.
 * See LICENSE in the project root for license information.
 */

'use strict'
/* eslint valid-jsdoc: "error" */
/* eslint max-len: [ "error", 80, { "ignoreUrls": true } ] */

// ----------------------------------------------------------------------------

/**
 * Mock console.
 */

// ----------------------------------------------------------------------------

// const assert = require('assert')
const Writable = require('stream').Writable
const Console = require('console').Console

// ============================================================================

class Mock {
  constructor () {
    this.stdout = []
    this.ostream = new Writable({
      write: (chunk, encoding, callback) => {
        this.stdout.push(chunk.toString())
        callback()
      }
    })

    this.stderr = []
    this.errstream = new Writable({
      write: (chunk, encoding, callback) => {
        this.stderr.push(chunk.toString())
        callback()
      }
    })
    this.console = new Console(this.ostream, this.errstream)
  }

  clear () {
    this.stdout = []
    this.stderr = []
  }
}

// ----------------------------------------------------------------------------
// Node.js specific export definitions.

// By default, `module.exports = {}`.
// The class is added as a property of this object.
module.exports.Mock = Mock

// In ES6, it would be:
// export class Mock { ... }
// ...
// import { Mock } from 'mock-console.js'

// ----------------------------------------------------------------------------
