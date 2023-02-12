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
 * Mock console.
 */

// ----------------------------------------------------------------------------

import { Console } from 'node:console'
import { Writable } from 'node:stream'

// ============================================================================

export class Mock {
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
