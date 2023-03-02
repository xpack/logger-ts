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
 * Mock console.
 */

// ----------------------------------------------------------------------------

import { Console } from 'node:console'
import { Writable } from 'node:stream'

// ============================================================================

export class Mock {
  stdout: any
  ostream: any
  stderr: any
  errstream: any
  console: Console

  constructor () {
    this.stdout = []
    this.ostream = new Writable({
      write: (chunk, _encoding, callback) => {
        this.stdout.push(chunk.toString())
        callback()
      }
    })

    this.stderr = []
    this.errstream = new Writable({
      write: (chunk, _encoding, callback) => {
        this.stderr.push(chunk.toString())
        callback()
      }
    })
    this.console = new Console(this.ostream, this.errstream)
  }

  clear (): void {
    this.stdout = []
    this.stderr = []
  }
}

// ----------------------------------------------------------------------------
