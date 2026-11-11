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
 * Test the types, by compiling the fixtures in `tests/types/` with the
 * TypeScript compiler, with different options.
 */

// ----------------------------------------------------------------------------

import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

// https://www.npmjs.com/package/tap
import { test } from 'tap'

// ----------------------------------------------------------------------------

const packageFolder = fileURLToPath(new URL('../../', import.meta.url))

// Run the compiler through `node`, since the `.bin/tsc` shim differs on
// Windows.
function compile(
  fixture: string,
  options: string[]
): {
  status: number | null
  output: string
} {
  const result = spawnSync(
    process.execPath,
    [
      `${packageFolder}node_modules/typescript/bin/tsc`,
      '--ignoreConfig',
      '--noEmit',
      '--strict',
      '--module',
      'nodenext',
      '--moduleResolution',
      'nodenext',
      '--target',
      'es2022',
      '--types',
      'node',
      '--skipLibCheck',
      ...options,
      fixture,
    ],
    { cwd: packageFolder, encoding: 'utf8' }
  )
  return { status: result.status, output: result.stdout + result.stderr }
}

await test('level types compile with exactOptionalPropertyTypes', (t) => {
  const result = compile('tests/types/level-types.ts', [
    '--exactOptionalPropertyTypes',
  ])
  t.equal(result.status, 0, `tsc succeeds ${result.output}`)

  t.end()
})

await test('level types compile without exactOptionalPropertyTypes', (t) => {
  const result = compile('tests/types/level-types.ts', [])
  t.equal(result.status, 0, `tsc succeeds ${result.output}`)

  t.end()
})

// ----------------------------------------------------------------------------
