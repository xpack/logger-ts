/*
 * This file is part of the xPack project (http://xpack.github.io).
 * Copyright (c) 2017-2026 Liviu Ionescu. All rights reserved.
 *
 * Permission to use, copy, modify, and/or distribute this software
 * for any purpose is hereby granted, under the terms of the MIT license.
 *
 * If a copy of the license was not distributed with this file, it can
 * be obtained from https://opensource.org/license/mit/.
 */

/* eslint max-len: [ "error", 80, { "ignoreUrls": true } ] */

// ----------------------------------------------------------------------------

/**
 * A levelled console logger for Node.js applications and libraries.
 *
 * @remarks
 * The package exports the `Logger` class, which writes messages to the
 * console from a given log level, and the types of its options. Create a
 * logger with a level, then call its logging methods (`error()`, `warn()`,
 * `info()`, `verbose()`, `debug()`, and `trace()`); a message is written
 * only if the level of the logger is equal to or higher than that of the
 * method.
 *
 * The package is an ES module, and has no runtime dependencies.
 *
 * @packageDocumentation
 */

// Re-export the library definitions.
export * from './lib/logger.js'

// ----------------------------------------------------------------------------
