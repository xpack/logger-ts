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
 * Test that the sections of the User's Guide named by the TSDoc comments
 * exist, since the guide is the single source of the long explanations,
 * and a renamed heading would leave a reference to nothing.
 */

// ----------------------------------------------------------------------------

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// https://www.npmjs.com/package/tap
import { test } from 'tap'

// ----------------------------------------------------------------------------

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')

await test('the sections of the guide named by the comments exist', (t) => {
  const source = readFileSync(join(root, 'src/lib/logger.ts'), 'utf8')
  const guide = readFileSync(
    join(root, 'website/docs/user/_project/_content.mdx'),
    'utf8'
  )

  const headings = new Set(
    [...guide.matchAll(/^#{2,4} (.+)$/gm)].map((match) => match[1] ?? '')
  )
  t.ok(headings.size > 0, 'the guide has headings')

  // The comments wrap the lines, so join them before the search.
  const text = source.replace(/\n\s*\*\s?/g, ' ')
  const sections = new Set(
    [...text.matchAll(/section "([^"]+)" of the User's Guide/g)].map(
      (match) => match[1] ?? ''
    )
  )
  t.ok(sections.size > 0, 'the comments name sections of the guide')

  for (const section of sections) {
    t.ok(headings.has(section), `the guide has the section "${section}"`)
  }
  t.end()
})

// ----------------------------------------------------------------------------
