/*
 * This file is part of the xPack project (http://xpack.github.io).
 * Copyright (c) 2023 Liviu Ionescu. All rights reserved.
 *
 * Licensed under the terms of the MIT License.
 * See LICENSE in the project root for license information.
 */

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
