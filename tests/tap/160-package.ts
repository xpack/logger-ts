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

import ts from 'typescript'

// https://www.npmjs.com/package/tap
import { test } from 'tap'

// ----------------------------------------------------------------------------

// The folder of the package, where the self-reference by name works.
const packageFolder = fileURLToPath(new URL('../../', import.meta.url))

interface PackageJson {
  type?: string
  main?: string
  typings?: string
  exports?: Record<string, string | Record<string, string>>
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
  t.ok(entry && typeof entry === 'object', 'has the main export')
  const conditions = typeof entry === 'object' ? entry : {}
  t.ok(conditions.default, 'has a default condition')
  t.ok(conditions.types, 'has a types condition')

  for (const target of Object.values(conditions)) {
    t.ok(existsSync(`${packageFolder}${target}`), `${target} exists`)
  }

  t.end()
})

await test('legacy fields repeat the exports map', (t) => {
  // `main` and `typings` are kept for the TypeScript projects that use
  // `moduleResolution: node10`, which ignores `exports`; support for them
  // will be removed in a future major release.
  const entry = packageJson.exports?.['.']
  const conditions = typeof entry === 'object' ? entry : {}

  t.equal(packageJson.main, conditions.default, 'main is the default')
  t.equal(packageJson.typings, conditions.types, 'typings is the types')

  t.end()
})

await test('package.json can be read through the package name', (t) => {
  t.equal(
    packageJson.exports?.['./package.json'],
    './package.json',
    'package.json is exported'
  )

  const output = runNode(
    'commonjs',
    `console.log(require('@xpack/logger/package.json').name)`
  )
  t.equal(output, '@xpack/logger', 'require() of package.json works')

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

// The declaration files are what the editors of the users show: they must
// keep the TSDoc comments, with the deprecations.
function documentedMembers(): Map<string, ts.Node> {
  const path = `${packageFolder}dist/lib/logger.d.ts`
  const source = ts.createSourceFile(
    path,
    readFileSync(path, 'utf8'),
    ts.ScriptTarget.ES2022,
    true
  )

  const members = new Map<string, ts.Node>()
  const visit = (node: ts.Node): void => {
    if (
      (ts.isClassDeclaration(node) ||
        ts.isPropertyDeclaration(node) ||
        ts.isMethodDeclaration(node) ||
        ts.isGetAccessorDeclaration(node)) &&
      node.name !== undefined
    ) {
      members.set(node.name.getText(source), node)
    }
    ts.forEachChild(node, visit)
  }
  visit(source)
  return members
}

await test('the declarations keep the TSDoc comments', (t) => {
  const members = documentedMembers()

  for (const name of [
    'Logger',
    'level',
    'isLevel',
    'timestamp',
    'recommendedLevel',
    'info',
    'error',
    'write',
  ]) {
    const node = members.get(name)
    t.ok(node, `${name} is declared`)
    if (node !== undefined) {
      t.ok(
        ts.getJSDocCommentsAndTags(node).some(ts.isJSDoc),
        `${name} has a TSDoc comment`
      )
    }
  }

  t.end()
})

await test('the type parameter tag does not take the class text', (t) => {
  const node = documentedMembers().get('Logger')
  t.ok(node, 'Logger is declared')
  if (node === undefined) {
    t.end()
    return
  }

  // A block tag extends to the next block tag, so a `@typeParam` placed
  // before the description would take it, in the generated reference and
  // in the editors.
  // TypeScript does not know `@typeParam` (it knows `@template`), so it is
  // a generic tag, found by name.
  const tags = ts
    .getJSDocTags(node)
    .filter((tag) => tag.tagName.text === 'typeParam')
  t.equal(tags.length, 1, 'one type parameter tag')
  const text = ts.getTextOfJSDocComment(tags[0]?.comment) ?? ''
  t.ok(text.length > 0, 'the tag has a text')
  t.ok(text.length < 200, `the tag text is short (${String(text.length)})`)
  t.notMatch(text, /Output methods/, 'the tag has no description of the class')

  t.end()
})

await test('every public member of the class has a category', (t) => {
  const node = documentedMembers().get('Logger')
  t.ok(node, 'Logger is declared')
  if (node === undefined || !ts.isClassDeclaration(node)) {
    t.end()
    return
  }

  // The generated reference groups the members by `@category`; a member
  // without it lands in the group `Other`.
  for (const member of node.members) {
    if (
      ts.isConstructorDeclaration(member) ||
      ts.isSetAccessorDeclaration(member) ||
      member.name === undefined ||
      // The `#private` marker of the declaration.
      ts.isPrivateIdentifier(member.name) ||
      ts.getCombinedModifierFlags(member) & ts.ModifierFlags.Private
    ) {
      continue
    }
    const name = member.name.getText()
    t.ok(
      ts.getJSDocTags(member).some((tag) => tag.tagName.text === 'category'),
      `${name} has a category`
    )
  }

  t.end()
})

await test('the declarations keep the deprecations', (t) => {
  const members = documentedMembers()

  // What the editors show with a strike-through.
  for (const name of [
    'defaultLevel',
    'isSilent',
    '_console',
    'levelNumericValue',
    'levelName',
    'buffer',
  ]) {
    const node = members.get(name)
    t.ok(node, `${name} is declared`)
    if (node !== undefined) {
      t.ok(ts.getJSDocDeprecatedTag(node), `${name} is deprecated`)
    }
  }

  const recommended = members.get('recommendedLevel')
  t.ok(
    recommended && !ts.getJSDocDeprecatedTag(recommended),
    'recommendedLevel is not deprecated'
  )

  t.end()
})

// ----------------------------------------------------------------------------
