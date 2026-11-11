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
 * Test the packaging: the ES module only package can be loaded from both
 * module systems by its name, and the minimum Node.js version is the one
 * that makes `require()` of ES modules work by default.
 *
 * The tests use the compiled files in `dist/`, so they need `npm run compile`
 * (done by the `pretest` script).
 */

// ----------------------------------------------------------------------------

import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// https://www.npmjs.com/package/tap
import { test } from 'tap'

// ----------------------------------------------------------------------------

// The folder of the package, where the self-reference by name works.
const packageFolder = fileURLToPath(new URL('../../', import.meta.url))

interface PackageJson {
  type?: string
  main?: string
  exports?: Record<string, Record<string, string>>
  engines?: { node?: string }
}

const packageJson = JSON.parse(
  readFileSync(`${packageFolder}package.json`, 'utf8')
) as PackageJson

function runNode(inputType: 'commonjs' | 'module', code: string): string {
  return execFileSync(
    process.execPath,
    [`--input-type=${inputType}`, '--eval', code],
    { cwd: packageFolder, encoding: 'utf8' }
  ).trim()
}

await test('package is an ES module only', (t) => {
  t.equal(packageJson.type, 'module', 'type is module')

  const entry = packageJson.exports?.['.']
  t.ok(entry, 'has the main export')
  t.ok(entry?.['default'], 'has a default condition')
  t.ok(entry?.['types'], 'has a types condition')

  for (const target of Object.values(entry ?? {})) {
    t.ok(existsSync(`${packageFolder}${target}`), `${target} exists`)
  }

  t.end()
})

await test('minimum Node.js version loads ES modules with require()', (t) => {
  // `require()` of an ES module is enabled by default from 22.12; the
  // earlier versions of the 22 line fail with ERR_REQUIRE_ESM.
  t.equal(packageJson.engines?.node, '>=22.12', 'engines.node is >=22.12')

  t.end()
})

await test('the package can be required from CommonJS', (t) => {
  const output = runNode(
    'commonjs',
    `const { Logger } = require('@xpack/logger');
     const log = new Logger({ level: 'info' });
     console.log(typeof Logger, log.level)`
  )
  t.equal(output, 'function info', 'Logger is usable with require()')

  t.end()
})

await test('the package can be imported from ES modules', (t) => {
  const output = runNode(
    'module',
    `import { Logger } from '@xpack/logger';
     const log = new Logger({ level: 'info' });
     console.log(typeof Logger, log.level)`
  )
  t.equal(output, 'function info', 'Logger is usable with import')

  t.end()
})

await test('the package can be imported dynamically from CommonJS', (t) => {
  const output = runNode(
    'commonjs',
    `import('@xpack/logger').then((m) => console.log(typeof m.Logger))`
  )
  t.equal(output, 'function', 'Logger is usable with import()')

  t.end()
})

// ----------------------------------------------------------------------------
