/*
 * This file is part of the xPack project (http://xpack.github.io).
 * Copyright (c) 2023 Liviu Ionescu. All rights reserved.
 *
 * Permission to use, copy, modify, and/or distribute this software
 * for any purpose is hereby granted, under the terms of the MIT license.
 *
 * If a copy of the license was not distributed with this file, it can
 * be obtained from https://opensource.org/license/mit/.
 */

/* eslint max-len: [ "error", 80, { "ignoreUrls": true } ] */

// ----------------------------------------------------------------------------

import { Logger } from '../../src/index.js'

const mm = (): void => {
  const logger = new Logger({
    level: 'info'
  })

  logger.info('hello')
  logger.warn('oops')
  logger.error('not good')
}

mm()

// ----------------------------------------------------------------------------
