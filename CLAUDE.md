# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@.github/copilot-instructions.md

## Project Overview

`@xpack/logger` is a small TypeScript library that provides a levelled console
logger (`Logger` class), published to npm as an ES module only package.
The whole implementation is a single class in `src/lib/logger.ts`, re-exported
by `src/index.ts`.

## Commands

- `npm run compile`: build `src` to `dist/` (`tsc --project tsconfig.json`);
  `compile-watch` for watch mode.
- `npm run lint`: ESLint on `src` and `tests`, with
  `maintenance/config/eslint.config.js` (`@eslint/js` recommended,
  `typescript-eslint` `strictTypeChecked` and `stylisticTypeChecked`, and
  `eslint-config-prettier`). Line length is limited to 80 characters
  (`max-len`, a warning).
- `npm run fix`: ESLint with `--fix` on `src` and `tests`.
- `npm run prettier`: format `src` and `tests` with Prettier, using
  `maintenance/config/.prettierrc.json` (no semicolons, single quotes,
  `es5` trailing commas, 80 columns) and `maintenance/config/.prettierignore`.
- `npm run fix-compile`: Prettier, ESLint fix, and compile.
- The ESLint configuration uses the TypeScript project service, so it only
  accepts files included in a tsconfig. Other files, such as the scripts in
  `maintenance/scripts/`, fail with "was not found by the project service";
  lint them with a configuration that extends the project one and sets
  `parserOptions.projectService.allowDefaultProject`.
- `npm test`: the `pretest` hook compiles the sources and type-checks the
  tests (`compile`, `compile-tests`); then `test` runs `test-coverage`,
  whose `pretest-coverage` hook runs lint, followed by
  `tap --show-full-coverage`. Lint runs once. Use
  `npm run test-no-coverage` to skip coverage (its
  `pretest-no-coverage` hook also runs lint, but it does not compile).
- Run a single test file: `npx tap --disable-coverage tests/tap/040-is-level.ts`,
  or `npm run test-one -- tests/tap/040-is-level.ts` (several files can be
  given).
- `npm run dev-cycle`: ESLint fix, compile, and test.
- `npm run clean` removes build output; `prepare` runs Prettier, lint, and
  compile.

Tests under `tests/tap/*.ts` are TypeScript run directly by `tap` (no separate
compilation) and import from the library sources. The `include` option in
`.taprc` restricts `tap` to these files; without it, `tap` would also run
the other TypeScript files under `tests/`, such as `tests/samples/sample.ts`.

## Architecture

- **Single source of truth**: `src/lib/logger.ts`. There is no other runtime
  code. The root `tsconfig.json` compiles it as ES modules into `dist/`
  (generated, but tracked in git; it contains `.d.ts` and source map files
  too).
- **ES module only packaging**: the root `package.json` has `"type": "module"`
  and its `exports` map points to `dist/index.js` and `dist/index.d.ts`; there
  is no CommonJS build. The minimum Node.js version is 22.12 (`engines`), the
  first 22.x that loads ES modules with `require()` by default, so CommonJS
  consumers can still `require()` the package; `tests/tap/160-package.ts`
  checks this. The legacy `main` and `typings` fields repeat the `exports`
  map only for the TypeScript `moduleResolution: node10`, which ignores
  `exports`; the support for it is deprecated and will be removed in a
  future major release (the test checks that the fields agree with
  `exports`). The `exports` map also exports `./package.json`. Source imports
  use `.js` extensions
  (`./lib/logger.js`) because of Node.js module resolution.
- **Published files**: the `files` list in `package.json` selects `dist/` and
  `src/` (without `src/README.md`); check with `npm pack --dry-run`. Note that
  `npm pack` runs `prepare`, which rebuilds `dist/`.
- **Logger model**:
  - Levels are ordered by `Logger.numericLevels` (`silent` 0 to `all` 70);
    it, and the other static members, are read-only, and the class is
    frozen after its definition.
    A message is emitted when the logger's numeric level is greater than or
    equal to the method's level.
  - `always()` uses `numericLevelAlways` (-1), so it is always output.
  - The state of the logger is in ES private fields (`#numericLevel`,
    `#levelName`, `#buffer`, and `#console`). The protected `_console`,
    `levelNumericValue`, `levelName`, and `buffer` are deprecated accessors
    over it, kept until the next major version; the supported extension
    point of the subclasses is the protected `write()`. Static initializers
    must use `this`, not `Logger`, since the emitted code assigns the class
    alias after the class definition.
  - The build has two passes (the `compile` script): `tsconfig.json`
    compiles without comments (`removeComments` in
    `maintenance/config/tsconfig-common.json`), and
    `tsconfig-declarations.json` then emits only the declaration files, with
    the comments, so the published `.d.ts` files carry the TSDoc and the
    `@deprecated` tags, which `tests/tap/160-package.ts` checks, while the
    tracked JavaScript in `dist/` changes only when the code changes. Running
    only the first pass leaves bare declarations; `compile-watch` runs only
    the first pass. The second configuration and the changed script are not
    in the template yet.
  - The constructor option `timestamp` (fixed at construction, with a
    read-only accessor) makes the four methods that have a prefix (`error`,
    `warn`, `debug`, and `trace`) start with the local time,
    `YYYY-MM-DD HH:mm:ss.SSS`, and replaces the prefix by the kind in square
    brackets (`[warning]`); it is tied to the method, not to the prefix that
    is written, so `error(err)` is stamped too. The tests control the clock
    with `mock.timers` of `node:test`, and the time zone with the `TZ`
    variable.
  - Vocabulary, used in the code, the TSDoc, and the documentation: a logger
    without a level is in the **preliminary state**; the messages logged then
    are stored in the **internal buffer**, and replayed when the level is set;
    a **message** is what one call of an output method logs (not "log line"
    or "log entry"); a level has a **name** (`LogLevel`, like `info`) and a
    **numeric level** (`Logger.numericLevels`); a level is **set**, not
    "initialised"; the methods are the **logging methods**.
  - A logger created without a `level` is in a **preliminary state**
    (`numericLevelUndefined` is `Infinity`): messages are stored in an internal
    `buffer` and replayed when the `level` setter is called.
  - The constructor accepts an optional `console`, so tests inject
    `@xpack/mock-console` (a development dependency; the package has no
    runtime dependencies) to capture output.
- `maintenance/config/tsconfig-common.json` extends
  `@tsconfig/node22` and is strict (`exactOptionalPropertyTypes`,
  `noUncheckedIndexedAccess`, `noImplicitOverride`, and others).

## Website and generated files

- `website/` is a separate Docusaurus site (own `package.json`, not covered
  by `npm run lint`); the API reference is generated by typedoc from the TSDoc
  comments. It is not needed for library changes.
- `generate-top-commons` (via `@xpack/npm-packages-helper`) regenerates shared
  boilerplate files (workflows, website commons, some root files); these are
  generated, so avoid hand-editing them.
- `tests/tap/README.md` describes the setup for `tap` and may not match the
  current `package.json` configuration; trust `package.json`.

## Skills

The skills in `.github/skills/` (also visible as `.claude/skills`) share
`.github/skills/review-common.md` (judging, numbering, report files, probes,
acting on an item). Review reports are written to `maintenance/docs/`, which is
created on demand and excluded from the npm package by `.npmignore`.

## Questions to the user

When running on macOS and a question for the user is needed (for example
when asking for approval of a draft or a decision between alternatives),
first speak the question with the `say` command (run it before the text
is displayed), then display the text of the question as usual.
