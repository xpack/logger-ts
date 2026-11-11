# Design review

Date: 2026-11-11 18:17, on branch `development`, commit `9882f5a`
(with `package.json` modified locally, version `7.0.0-pre`).

Scope: an API review, as requested: the exported names, the `Logger`
class surface (constructor, methods, accessors, static and protected
members), the published typings (`dist/index.d.ts`,
`dist/lib/logger.d.ts`), the TSDoc comments, naming and consistency,
usability from the typings and the documentation alone, and the ES
module entry points. The sources (`src/index.ts`, `src/lib/logger.ts`),
the packaging (`package.json`, `.npmignore`), the TypeScript
configuration (`tsconfig.json`, `maintenance/config/tsconfig-*.json`),
and the tests (`tests/tap/`, as a statement of intent) were read.

Method: the 2 source files (878 lines) and the published typings were
read in full; the 7 test files (1889 lines) were consulted for the
intended behaviour. `npm run compile` and `npm run lint` report no
errors and no warnings; `npm test` passes 625 tests, with 1 skipped,
and 100% coverage. `npm pack --dry-run --ignore-scripts` lists 13
files (10.3 kB packed). Probes were ES module programs importing the
absolute path of `dist/index.js`, with a `node:console` `Console` over
in-memory streams, and TypeScript consumers type-checked with the
repository's `tsc` 6.0.3 through a symlinked package. They ran on
Node.js v24.22.2, and the module system tests also on v18.20.5,
v20.20.0, v22.11.0, and v22.22.0. The newcomer exercise was done by a
fresh sub-agent that read only `README.md`, the published typings, and
`website/docs/`; its findings are included below.

Independence: the earlier reports in `maintenance/docs/`, and the
commits and issues that refer to them, were deliberately not
consulted (there were none).

Summary: 33 problems (4 open, 28 fixed, 1 withdrawn).

The most serious problems are these:

- the level checks are all true before a level is set, so the
  documented patterns do not work in the preliminary state (#1);
- `isSilent` is a constant (#2);
- a message can be lost (#4) or duplicated (#3);
- the shared static configuration can be changed by any consumer
  (#6);
- the published typings carry no documentation at all (#7);
- `require()` fails on Node.js versions that `engines` accepts (#18).

Suggested order of work:

1. defects that do not change the contract: #3, #4 (documentation),
   #5, and #1 (documentation and example);
2. non-breaking improvements: #7, #9, #12, #14, #17, #19, #21, #24,
   #25, #26, and #27;
3. the breaking changes, grouped into the 7.0.0 release that is
   already in preparation: #2, #6, #8, #10, #11, #13, #15, #16, #18,
   #20, #22, and #23 (#32 was withdrawn); the new feature #33 (an
   option, not breaking) was done without changing the buffer record.

Items #28 to #31 belong to the `consistency-check` skill, or are
cosmetic.

Note that, in this report, `#N` is the number of an item; the number
of the GitHub issue is always written as `Issue #N` or as `(#N)` after
a commit hash, and the two numberings are unrelated (for example, the
item #32 of this report is not the GitHub issue #32).

Tags:

- **[breaking]** means the suggested change alters the contract with
  the users and requires a major version;
- **[internal]** means it does not;
- **[confirmed]** means a probe or a reproduction confirmed the
  problem.

Since version 7.0.0 is in preparation, every breaking item below can
go into it; the migration paths are given for each.

## 1. Defects

- **#1 — The `isLevel()` example fails in the preliminary state, and
  the behaviour of the level checks there is undocumented.**
  [internal] **[confirmed]** (fixed)
  `src/lib/logger.ts` lines 397 to 497 and 542 to 550: before a level
  is set, `levelNumericValue` is `Infinity`, so `isSilent` through
  `isAll` and `isLevel(any)` all return `true`.
  - For guarding expensive work (lines 128 to 139, and the user guide,
    `website/docs/user/_project/_content.mdx` lines 90 to 95), this
    is the correct behaviour. It cannot yet be known whether the
    message will be needed, so it is produced and buffered, then
    filtered when the level is set. Returning `false` would lose the
    message if the final level turned out to be high enough. The
    cost is wasted work when the final level is lower; the newcomer
    probe reported "expensive() called 1 time(s), but nothing
    printed" with a final level of `info`. This is not a defect, but
    the TSDoc did not say so.
  - The pattern documented for `isLevel()` at lines 523 to 531,
    `if (!log.isLevel(newLevel)) log.level = newLevel`, is a defect.
    It never sets the level in the preliminary state: the probe gave
    `[level, hasLevel] = [undefined, false]`, and every later message
    stays in the buffer. The example also called `log.islevel()`,
    which does not exist.

  Suggested changes:
  - state in the TSDoc of every `is*` accessor and of `isLevel()`
    that they return `true` until a level is set, and why;
  - change the `isLevel()` example to
    `if (!log.hasLevel || !log.isLevel(newLevel))`;
  - add the same remark to the user guide;
  - add a test of the results in the preliminary state.

  Making the checks return `false` in the preliminary state would be
  **[breaking]**, and is not recommended: it would lose messages that
  are buffered today.

  Issue #18.
  Fixed in `dbf4723` (#18): the behaviour is documented in the TSDoc of
  the `is*` accessors and of `isLevel()`, and in the user guide; the
  `isLevel()` example now checks `hasLevel` first; tests were added for
  the checks in the preliminary state, for guarded messages, and for
  the corrected example. The behaviour itself is unchanged, as
  recommended.

- **#2 — `isSilent` is always `true`.** [breaking] **[confirmed]** (fixed)
  `src/lib/logger.ts` lines 387 to 399: `silent` is 0, the lowest
  level, so `levelNumericValue >= 0` holds for every level and for
  the preliminary state.
  - The probe gave `[true, true, true, true]` for `silent`, `info`,
    `all`, and unset.
  - `tests/tap/040-is-level.ts` asserts `isSilent` at every level,
    lines 55 to 209.
  - The name suggests "the logger is silent", which the accessor
    cannot express.

  Suggested change: either deprecate `isSilent` (TSDoc `@deprecated`,
  "always true; use `log.level === 'silent'`") and remove it in the
  next major version, or redefine it as `this.levelName === 'silent'`.
  Redefining it requires a major version and has no migration path,
  since the name stays the same. Release notes text: "`isSilent` was
  always `true`; it now returns `true` only when the level is
  `silent`."

  Issue #19.
  Fixed in `e69b9de` (#19): `isSilent` is deprecated with a TSDoc
  `@deprecated` tag, recommending `log.level === 'silent'`; the
  behaviour is unchanged, a v7.0.0 compatibility notice and a note in
  the user guide were added, and the accessor is to be removed in the
  next major version, as recommended.

- **#3 — A console that throws during the replay causes duplicate
  messages.** [internal] **[confirmed]** (fixed)
  `src/lib/logger.ts` lines 359 to 368: the buffer is cleared only
  after the `forEach()` loop completes. If the console throws for one
  record, the exception escapes the setter, the buffer keeps every
  record, and the next assignment of the level replays the records
  that were already written. The probe, with a console that throws on
  its second call, gave `["a", "a", "b", "c"]`. Suggested change:
  detach the buffer before the replay
  (`const records = this.buffer; this.buffer = []`), then iterate
  over `records`.

  Issue #20.
  Fixed in `8b4dadc` (#20): the level setter detaches the buffer before
  the replay, so each message is written at most once; if the console
  throws, the exception is propagated, the level remains set, and the
  unwritten messages are discarded, which is documented in the TSDoc
  and in the user guide. Tests were added for a console that throws
  during the flush and for a second assignment of the level. This
  follows the recommendation of the report.

- **#4 — Every message, including `always()` and `error()`, is lost
  when the level is never set.** [internal] **[confirmed]** (fixed)
  `src/lib/logger.ts` lines 576 to 586: in the preliminary state all
  output goes to the buffer, and nothing writes it out on exit. The
  newcomer probe (`t3-never-set.mjs`) printed nothing when the code
  that should have set the level threw first. The name `always()`
  promises the opposite, and no documentation warns about this.
  Suggested changes:
  - document it in the class TSDoc and in the user guide;
  - optionally add a `flush(level = Logger.defaultLevel)` method, for
    use in a `catch` block or a `process.on('exit')` handler. Adding
    the method is non-breaking.

  Issue #21.
  Fixed in `c97fa23` (#21): the behaviour is documented in the TSDoc of
  `Logger` and `always()` and in the user guide, with a `catch` pattern
  that sets the level using `hasLevel`; tests were added for a logger
  whose level is never set and for the pattern. The optional `flush()`
  method was not added, as the report left it optional.

- **#5 — `output(err)` is documented as hiding the stack trace, but
  prints it.** [internal] **[confirmed]** (fixed)
  `src/lib/logger.ts` line 685 says "Do not show the stack trace.",
  but lines 677 to 679 and the code (`util.format(err)`) show it. The
  probe printed `Error: boom` followed by the stack on stdout.
  Suggested change: correct the example comment. Printing only
  `err.message` would be a **[breaking]** alternative.

  Issue #22.
  Fixed in `3cf86fc` (#22): the example is corrected, and how `Error`
  objects are logged is documented in the TSDoc of the class, `error()`,
  `warn()`, and `output()`, and in a new "Logging errors" section of the
  user guide: the full details when the object is passed, a single line
  when `err.message` is passed, the prefix rule of `error()`, and a
  pattern that shows the message at `error` and the stack trace only at
  `debug`. The behaviour is unchanged; the prefix rule itself is left
  to #13. Tests were added in `tests/tap/090-errors.ts`.

- **#6 — The shared configuration is mutable global state.**
  [breaking] **[confirmed]** (fixed)
  `src/lib/logger.ts` lines 159 to 191: `defaultLevel`,
  `numericLevels`, `numericLevelUndefined`, and `numericLevelAlways`
  are writable static members, `numericLevels` is not frozen, and the
  typings allow assignment. Any module in the process can change the
  behaviour of every logger:
  - `Logger.numericLevels.debug = 0` makes `debug()` output at
    `info`;
  - `Logger.numericLevelUndefined = 5` makes `hasLevel` true on an
    unset logger.

  The documentation lists these members under "Constants". Suggested
  change: declare them `static readonly`, and define `numericLevels`
  as `Object.freeze({ ... } as const)`. This requires a major
  version. There is no deprecation path for the assignment, but no
  correct program assigns these members. Release notes text: "The
  static level constants of `Logger` are now read-only."

## 2. Usability

  Issue #39.
  Fixed in `f726fe0` (#39): `numericLevels` is
  `Object.freeze({...} as const satisfies Record<LogLevel, number>)`
  and the other three members are `static readonly`, as recommended.
  This differs from the recommendation in two points. The `Logger`
  class is also frozen after its definition, since `readonly` is
  checked only by the compiler and the three scalar members would
  otherwise remain writable at run time. `LogLevel` was not derived
  from the object, since the `satisfies` check of #25 already keeps the
  two in step. The 7.0.0 compatibility notice marks the change as
  breaking and tells subclasses not to assign to the inherited statics;
  the tests are type checks that the assignments do not compile, and
  `tests/tap/200-statics.ts` (25 of its 28 assertions failed against the
  previous source).

- **#7 — The published typings contain no documentation.** [internal]
  **[confirmed]** (fixed)
  `maintenance/config/tsconfig-common.json` line 37 sets
  `"removeComments": true`, which also removes the comments from the
  declaration files, so `dist/lib/logger.d.ts` has no TSDoc and IDE
  hovers show only signatures. The comprehensive TSDoc in the source
  is invisible to the users who most need it. Suggested change:
  remove `removeComments`, or keep it for the JavaScript and emit the
  declarations in a separate pass that keeps the comments.
  `tsconfig-common.json` is generated, so the change belongs in the
  `npm-packages-helper` template.

  Issue #45.
  Fixed in `015f71a` (#45): the published declarations carry the TSDoc and
  the six `@deprecated` tags, which is what the item asked for. The
  suggested change was to remove `removeComments`, which was not done:
  it would also have kept the comments in the compiled JavaScript
  (6.6 kB became 52 kB, and the packed package 20 kB became 40 kB), and
  it would have made the tracked JavaScript in `dist/` change at every
  edit of a comment. Instead, as decided with the maintainer, the build
  has two passes: the first, as before, without comments, and a second
  one, with the new `tsconfig-declarations.json`, that emits only the
  declaration files, with the comments (the package grows from 20 kB to
  30 kB). The `compile` script runs both; `compile-watch` runs only the
  first, which leaves bare declarations. The new configuration and the
  second step of the script are not in the template yet, and the
  generated `tsconfig-common.json` was left unchanged. Tests in
  `tests/tap/160-package.ts` check the TSDoc and the deprecations in the
  published declarations with the TypeScript compiler API (14 of the
  assertions fail with the first pass only). Whether `dist/` should be
  tracked in git, and completely, with its declarations, as in the
  other projects, is open (see the consistency check).

- **#8 — Invalid levels fail with an `AssertionError` that does not
  help the caller.** [breaking] **[confirmed]** (fixed)
  `src/lib/logger.ts` lines 349 to 353 and 543 to 547:
  - an unknown name gives
    `AssertionError [ERR_ASSERTION]: Log level 'verbos' not
    supported.`, without the list of valid names;
  - an empty string or `undefined` gives the generic "The expression
    evaluated to a falsy value: assert(level)";
  - the documentation says only "an assert will fire" (line 334),
    for the setter only.

  Since level names typically come from a command line or from an
  environment variable, this is a user input error, not a bug.
  Suggested change: throw a `RangeError` (or a `TypeError` for a
  value that is not a string) with the message
  `Unsupported log level 'x'; valid levels are: silent, error, …`,
  and document it with `@throws`. Changing the error class requires a
  major version. Release notes text: "Invalid log levels now throw a
  `RangeError` instead of an `AssertionError`."

  Issue #36.
  Fixed in `1617e0e` (#36): the constructor, the `level` setter, and
  `isLevel()` throw a `RangeError` for a string that is not a level name
  and a `TypeError` for a value that is not a string, as recommended,
  with a message that lists the valid names; the value is shown as
  `util.inspect()` writes it, so that an untrusted value is escaped
  (not in the report, added after item #27). The errors are documented
  with `@throws` and in the user guide, the 7.0.0 compatibility notice
  marks the change as breaking and gives the migration, and the tests
  are in `tests/tap/170-level-errors.ts`. The old `AssertionError` was
  not kept as a deprecated alias, since it cannot be thrown together
  with the new classes.

- **#9 — There is no runtime list of level names and no type guard.**
  [internal] **[confirmed]** (fixed)
  A program that reads the level from a string must cast it: in the
  probe, `l2.level = fromCli` gave TS2322. To validate the string, it
  must call `Object.hasOwn(Logger.numericLevels, s)` itself. Suggested
  change: add `static isLogLevel(value: unknown): value is LogLevel`
  and `static readonly levelNames: readonly LogLevel[]`. Both are
  additions.

  Issue #23.
  Fixed in `f7770ab` (#23): `Logger.levelNames` (a frozen array derived
  from `numericLevels`) and `Logger.isLogLevel()` (a type guard) were
  added, as recommended, and are used by the level setter and by
  `isLevel()`; they are documented in the TSDoc and in the user guide,
  and tested in `tests/tap/100-level-names.ts`.

- **#10 — The `level` setter accepts `undefined` at compile time,
  but the constructor rejects an explicit `undefined`.** [breaking]
  **[confirmed]** (fixed)
  `src/lib/logger.ts` line 348 types the setter as
  `LogLevel | undefined`, so `log.level = undefined` compiles and
  then throws at runtime (#8). Conversely, lines 274 and 280 declare
  `level?: LogLevel`. Under `exactOptionalPropertyTypes`,
  `new Logger({ level: maybeLevel })` with
  `maybeLevel: LogLevel | undefined` is rejected (TS2379), although
  the constructor handles `undefined` (line 286). Suggested changes:
  - type the setter as `LogLevel`; since TypeScript 5.1 the getter
    and the setter may have unrelated types;
  - declare `level?: LogLevel | undefined` and
    `console?: Console | undefined` in the constructor parameters.

  The setter change breaks only code that would already throw at
  runtime. Release notes text: "Assigning `undefined` to
  `Logger.level` is now a compile error."

  Issue #37.
  Fixed in `5a4d80a` (#37): the setter is typed `LogLevel` (the getter stays
  `LogLevel | undefined`), and the constructor options are
  `level?: LogLevel | undefined` and `console?: Console | undefined`, as
  recommended. The `related-getter-setter-pairs` rule of ESLint objects
  to a setter type narrower than the getter type, so it is disabled for
  the level accessors, with a comment. The 7.0.0 compatibility notice
  marks the setter change as a compile-time breaking change. A type
  fixture, compiled with the TypeScript compiler by
  `tests/tap/180-types.ts` with and without
  `exactOptionalPropertyTypes`, guards the types (it failed against the
  previous types).

- **#11 — The `console` parameter requires a full `Console`.**
  [breaking] **[confirmed]** (fixed)
  `src/lib/logger.ts` lines 203, 280, and 510: the runtime needs only
  `log()` and `error()` (lines 290 to 297), but a minimal
  `{ log, error }` object is rejected at compile time (TS2740,
  "missing … assert, clear, count, countReset, and 17 more"), so the
  tests and the users must cast. Suggested change: define
  `export type LoggerConsole = Pick<Console, 'log' | 'error'>` and use
  it for the parameter. Widening the parameter alone is
  non-breaking. Also changing the `console` getter to return
  `LoggerConsole` is breaking, because callers that use other console
  methods through it would need a cast. Either keep the getter as
  `Console` with an internal cast, or make the getter change in 7.0.0.

  Issue #38.
  Fixed in `7a6deb8` (#38): the exported type `LoggerConsole`
  (`Pick<Console, 'log' | 'error'>`) was added, as recommended, and the
  `console` option accepts any such object. This differs from the
  recommendation in one point, decided with the maintainer: instead of
  changing the `console` accessor to return `LoggerConsole` (breaking),
  `Logger` is now generic over the console type,
  `Logger<C extends LoggerConsole = Console>`, and the accessor returns
  the type that was passed (`Console` by default), so the change is not
  breaking and a mock keeps its own type. The types are documented in
  the TSDoc, in the user guide, and in the 7.0.0 compatibility notice;
  the tests are a type fixture compiled by `tests/tap/180-types.ts`
  (which failed against the previous types) and the run-time tests in
  `tests/tap/190-console.ts`.

- **#12 — The typings depend on an ambient `Console`.** [internal]
  **[confirmed]** (fixed)
  `dist/lib/logger.d.ts` lines 23, 29, and 42 refer to `Console`
  without `/// <reference types="node" />`. A consumer compiled with
  `lib: ["es2022"]`, `types: []`, and without `skipLibCheck` gets
  TS2304 "Cannot find name 'Console'" three times. With the DOM
  library, the name silently binds to the DOM `Console`. Suggested
  change: `import type { Console } from 'node:console'` in the
  source, or #11, which reduces the dependency to two methods.

  Issue #24.
  Fixed in `94712ab` (#24): `Console` is imported with
  `import type { Console } from 'node:console'`, as recommended, so the
  typings always refer to the Node.js type and the compiler tells the
  user to install `@types/node` when it is missing; the requirement is
  documented in the user guide. The emitted JavaScript is unchanged.

- **#13 — The `error:` prefix depends on the position of the
  `Error`.** [breaking] **[confirmed]** (fixed)
  `src/lib/logger.ts` lines 647 to 669: the prefix is omitted only
  when the first argument is an `Error`. Therefore:
  - `error(err)` and `error(err, 'extra')` have no prefix;
  - `error('failed:', err)` gives `error: failed: Error: boom…`;
  - `warn(err)` gives `warning: Error: boom…`, so `warn()` does not
    make the same exception.

  The rule is not visible in the typings. Suggested change: either
  always prefix, or treat `warn()` in the same way and document the
  rule in both methods. Either change requires a major version.
  Release notes text: "`error()` now prefixes `Error` objects with
  `error: `, like any other message."

  Issue #41.
  Fixed in `05a9c7d` (#41): the current rule was kept, as decided with the
  maintainer (option 1: only `error()` omits its prefix, and only when
  the first argument is an `Error`; the alternatives, always prefixing
  or never prefixing an `Error` that comes first, were rejected because
  the second loses the severity of `warn()`, `debug()`, and `trace()`),
  so no behaviour changed and the item is not breaking. The rule and its
  reason are now documented in the TSDoc of the class and of every
  output method and in the user guide, and table-driven tests in
  `tests/tap/090-errors.ts` cover all the methods, with the `Error`
  first and not first, and for the buffered messages. The earlier
  documentation of this rule for `error()` and `warn()` is in `3cf86fc`
  (#22). The timestamp of #33 is tied to the method, so it does not
  depend on this rule.

- **#14 — The role of `output()` is unclear.** [internal]
  **[confirmed]** (fixed)
  `src/lib/logger.ts` lines 671 to 711: the TSDoc calls `output()`
  "Log an error message", yet it writes to stdout without a prefix
  and is used for the normal output of a program. It is suppressed at
  `silent`, unlike `always()`. The newcomer had to build a table to
  tell `always()`, `output()`, and `info()` apart: all three write to
  stdout without a prefix, with thresholds of always, `error`, and
  `info`. The remark about "REPL contexts" (lines 111 to 112) does
  not explain when to use `always()`. Suggested change: rewrite the
  TSDoc of `always()` and `output()` with one sentence each on the
  intended use ("the result of the command, suppressed only by
  `silent`"), and add a table of method, threshold, stream, and
  prefix to the class TSDoc. Renaming `output()` would be
  **[breaking]**, and is not recommended on its own.

  Issue #25.
  Fixed in `7a64f31` (#25): a table of the output methods (threshold,
  stream, and prefix) was added to the TSDoc of the class and to the
  user guide, with the intended use of `always()`, `output()`, and
  `info()`; the description of `output()` was corrected; and a test
  checks the documented table at every level, in
  `tests/tap/110-output-methods.ts`. The methods were not renamed, as
  recommended.

- **#15 — The constructor writes a line into the user's output.**
  [breaking] **[confirmed]** (fixed)
  `src/lib/logger.ts` line 299 emits `trace: <ClassName>.constructor()`
  at `trace` and `all`. This happens on the real console, in a mock
  console, and in the preliminary buffer: 100000 calls left 100001
  records. A user who counts captured lines in tests, or who uses
  `trace` for application tracing, gets a line about the library
  itself. Suggested change: remove the line. This requires a major
  version, since the output changes. Release notes text: "The
  `Logger` constructor no longer logs a `trace:` line."

  Issue #34.
  Fixed in `f456fab` (#34): the trace line was removed from the constructor,
  as recommended; the 7.0.0 compatibility notice marks it as a breaking
  change, with the text for the release notes, and tells the users to
  remove the line from the expected results of their tests; the tests
  that expected the line were updated, and a test checks that the
  constructor writes nothing and does not call `write()`.

- **#16 — `defaultLevel` is not used by the library.** [breaking]
  **[confirmed]** (fixed)
  `src/lib/logger.ts` line 159: the name suggests the level that a
  new logger gets. However, a logger created without a level stays in
  the preliminary state, and changing `defaultLevel` has no effect
  (the probe gave `level: undefined`). It is only a suggestion for
  the application. Suggested change: make it `readonly` (#6), and
  either rename it `recommendedLevel`, keeping `defaultLevel` as a
  `@deprecated` alias for one major version, or state in its TSDoc
  that the library never applies it. The rename requires a major
  version. The documentation change alone is non-breaking.

  Issue #40.
  Fixed in `0024f4f` (#40): `Logger.recommendedLevel` was added, with the
  same value, and its TSDoc and the user guide say that the library
  never applies it, as recommended; `defaultLevel` is kept as an alias
  with a TSDoc `@deprecated` tag, to be removed in the next major
  version, so the rename is not a breaking change (the item was tagged
  [breaking] only for the rename without an alias). The 7.0.0
  compatibility notice describes the deprecation, and the tests cover
  the new name, the alias, and the fact that the level is never
  applied. The deprecation is not visible in the published typings
  until #7 is fixed.

- **#17 — An `undefined` message prints an empty line, contrary to
  the documentation.** [internal] **[confirmed]** (fixed)
  The output methods declare `message: unknown = ''`
  (`src/lib/logger.ts` lines 607, 647, 700, 729, 757, 785, 814, and
  843). A default parameter also replaces an explicit `undefined`, so
  `info(undefined)` prints an empty line, and `always(undefined, 1)`
  prints ` 1` with a leading space. The TSDoc says "as accepted by
  `util.format()`", which prints `undefined`. Suggested change:
  document the substitution in the `@param message` text. Changing it
  would be **[breaking]**.

  Issue #26.
  Fixed in `f9fc608` (#26): the substitution of an omitted or `undefined`
  message by an empty string is documented in the TSDoc of the class
  and of the eight output methods, and in the user guide, with
  `String(value)` to write the text `undefined`; tests of the public
  methods were added in `tests/tap/120-empty-messages.ts`. The
  behaviour is unchanged, as recommended; making it match
  `console.log()` would be breaking and is left for a decision.

- **#18 — `require()` fails on Node.js versions that `engines`
  accepts.** [breaking] **[confirmed]** (fixed)
  `package.json` line 127 declares `"node": ">=22.0"`. The package is
  ES module only, and `require()` of an ES module is enabled by
  default only from Node.js 20.19 and 22.12. The newcomer's probes
  gave `ERR_REQUIRE_ESM` on 22.11.0 and 18.20.5, while `require()`
  worked on 20.20.0, 22.22.0, and 24.22.2; dynamic `import()` worked
  everywhere. Meanwhile, `README.md` line 8 and the website still
  describe a CommonJS package (#28). Suggested change: set
  `engines.node` to `">=22.12"` (or `"^20.19 || >=22.12"`), and
  document `require()` and `import()` for CommonJS consumers. Raising
  the minimum version requires a major version. Release notes text:
  "The package is ES module only. `require()` works on Node.js
  22.12 or later; on older versions use `await import()`."

  Issue #33.
  Fixed in `5ecea48` and `a9be368` (#33): `engines.node` was raised to
  `>=22.12` (`5ecea48`), as recommended, and the README, the
  prerequisites page, and the user guide were corrected; a compatibility
  notice for 7.0.0 gives the migration for CommonJS projects
  (`require()` from 22.12, or `import()`); and `tests/tap/160-package.ts`
  loads the package by its name with `require()`, `import`, and
  `import()`. The alternative range `^20.19 || >=22.12` was not chosen.

- **#19 — Several TSDoc examples are wrong.** [internal]
  **[confirmed]** (fixed)
  These examples in `src/lib/logger.ts` are incorrect:
  - line 528 calls `log.islevel(newLevel)`, which is `undefined` at
    runtime;
  - line 721, in `warn()`, shows `log.info(title)`;
  - lines 134 to 136 check `isVerbose`, then call `trace()`;
  - lines 313 to 317 use an unqualified `defaultLevel`, inside a
    `console` code fence instead of a `javascript` one;
  - line 125 links the Node.js v10 documentation;
  - lines 118 to 120 and 22 to 24 say "not really necessary with
    ES6" without explaining what is meant.

  Suggested change: correct the examples, and use `@example` blocks
  that compile.

- **#33 — The diagnostic messages cannot be timestamped.** [internal] (fixed)
  New feature, requested by the maintainer, not a finding of the
  review: a constructor option, a boolean, that makes the messages of
  the methods that have a prefix (`error()`, `warn()`, `debug()`, and
  `trace()`) start with a timestamp. The messages without a prefix
  (`always()`, `output()`, `info()`, and `verbose()`) are the normal
  output and the progress messages, and stay unchanged. Decisions made
  with the maintainer:
  - the timestamp is tied to the **method**, not to the rendered
    prefix: `error(err)` shows it although its prefix is omitted for an
    `Error` that comes first (see #13), otherwise the presence of the
    timestamp would depend on the position of the argument;
  - the flag is known at **construction** and **cannot be changed
    later**: a constructor option only, with no accessor; it is not
    useful to turn it on after some messages were logged;
  - the time is captured when the message is **logged**, not when it is
    written, so the buffered messages of the preliminary state keep
    their time (the buffer record gains a field, only if the option is
    set, so there is no cost when it is off);
  - the timestamp is written in front of the prefix, as
    `<timestamp> <prefix><message>`, on the first line only, like the
    prefix; the format suggested is ISO 8601 in UTC with milliseconds
    (`new Date().toISOString()`); the name of the option is to be
    decided (`timestamp` is suggested).

  The tests need a controllable clock (fake timers, or an injectable
  clock function). The change is not breaking (a new option, off by
  default). It changes the buffer record (`LoggerBufferRecord`), so it
  is scheduled together with #20, #23, and #32, which change the same
  record and the protected surface, and the uniform structure of the
  lines (`<timestamp> <prefix><message>`) is an argument for the
  decision of #13 to be "always prefix". Not started; no GitHub issue
  yet.

  Issue #44.
  Fixed in `2013e86` (#44): the constructor option `timestamp` was added,
  fixed at construction, with a read-only accessor, tied to the method,
  as agreed. The format changed during the work, at the request of the
  maintainer: the timestamp is in the local time,
  `YYYY-MM-DD HH:mm:ss.SSS`, not ISO 8601 in UTC, and the prefix is
  replaced by the kind in square brackets (`[warning]`), so
  `error()` with an `Error` that comes first is written as
  `<timestamp> [error] Error: boom` (a bare `Error` is also stamped, and
  has the kind, so that all the stamped messages have the same
  structure). The option is off by default, and without it the output is
  unchanged. The option name is `timestamp`. A value that is not a
  boolean is rejected with a `TypeError`. The time is taken when the
  message is logged, so the buffered messages keep it, which needed no
  change of the buffer record, so the feature does not depend on #32.
  The tests are in `tests/tap/220-timestamp.ts`, with the Node.js mock
  timers for the clock and the `TZ` variable for the time zones.

## 3. Structure and layering

  Issue #27.
  Fixed in `5684c76` (#27): the examples of the class (the guard now
  matches the logged level), of `warn()`, and of `hasLevel` were
  corrected, the `util.format()` link now points to the current Node.js
  documentation, the stray `function.` line was repaired, and the
  remark about ES6 was reworded; a test runs the corrected examples, in
  `tests/tap/130-examples.ts`. The `islevel()` example had been
  corrected earlier, with #18.

- **#20 — The protected and `@internal` surface is public in
  practice, inconsistently marked, and can break the invariants.**
  [breaking] **[confirmed]** (fixed)
  `src/lib/logger.ts` lines 65 to 101 and 196 to 223: the types
  `NumericLogLevel`, `LoggerFunction`, and `LoggerBufferRecord` are
  marked `@internal` but exported. They cannot be stripped, because
  the protected members `levelNumericValue`, `buffer`, and `write()`
  (line 566) refer to them in the published typings. Among the
  members, only `_console` is marked `@internal`; the others are
  merely placed in the "Internal Members" category. A subclass can
  set `levelName` without `levelNumericValue`: the probe gave
  `level: 'trace'` with `isTrace: false`. It can also clear or
  rewrite `buffer`. The tests rely on overriding `write()`
  (`tests/tap/080-undefined.ts` line 40). Suggested change: decide
  the extension contract.
  - If subclasses only need to intercept output, keep a documented
    protected `write()` and make the state `private` (or `#private`),
    exposing read-only accessors where needed.
  - Otherwise, drop `@internal` and document the protected members as
    supported.

  Making the state private requires a major version. Release notes
  text: "The protected fields `levelNumericValue`, `levelName`,
  `buffer`, and `_console` are now private; use `level`, `hasLevel`,
  and `console`."

  Issue #42.
  Fixed in `44910fc` (#42): this follows the report, with the migration
  path chosen with the maintainer (option A'): the state is in ES
  private fields, and `_console`, `levelNumericValue`, `levelName`, and
  `buffer` are kept as deprecated accessors over it, with the same
  behaviour and a TSDoc `@deprecated` tag, to be made unavailable in the
  next major version, so the change is not breaking in this version.
  `write()` is documented as the supported extension point, and
  `NumericLogLevel` and `LoggerFunction`, the types of its signature,
  are no longer `@internal`; `LoggerBufferRecord` stays internal, and it
  could not be deprecated because the project's lint rule objects to the
  class using a deprecated type. The invariant problem (a subclass that
  sets `levelName` alone) remains until the deprecated members are
  removed. The tests in `tests/tap/210-subclass.ts` pass against the
  previous source, apart from the one that checks that the state is
  private. A side effect to note: the state is no longer a property of
  the object, and a static initializer must use `this`, not `Logger`.

- **#21 — `@xpack/mock-console` is a runtime dependency, but only the
  tests use it.** [internal] **[confirmed]** (fixed)
  `package.json` lines 63 to 64: `src/` does not import it (only
  `tests/tap/*.ts` do), yet every consumer installs it. Suggested
  change: move it to `devDependencies`. The `CLAUDE.md` statement
  that it is "the only runtime dependency" must change too.

  Issue #28.
  Fixed in `ae03cfb` (#28): `@xpack/mock-console` was moved to
  `devDependencies`, in `package.json` and in `package-lock.json`, as
  recommended, and the descriptions that called it a runtime dependency
  (`CLAUDE.md` and the maintainer page of the website) were corrected;
  the package now has no runtime dependencies. `package.json` is
  generated, so the template needs the same change.

- **#22 — The packaging has redundant entry fields, and
  `package.json` is not exported.** [breaking] **[confirmed]** (fixed)
  `package.json` lines 6 to 12: `main` and `typings` duplicate the
  `exports` map, which takes precedence on every supported Node.js
  version and on `moduleResolution` `node16`, `nodenext`, and
  `bundler`. `@xpack/logger/package.json` gives
  `ERR_PACKAGE_PATH_NOT_EXPORTED`, which affects tools that read the
  package version through `exports`. Suggested change: add
  `"./package.json": "./package.json"` to `exports`, which is
  non-breaking. Removing `main` and `typings` would break only
  consumers using `moduleResolution: node10`. Keep them as a fallback,
  or remove them in 7.0.0 with the release notes text: "TypeScript
  consumers must use `moduleResolution` `node16`, `nodenext`, or
  `bundler`."

## 4. Naming and consistency

  Issue #35.
  Fixed in `f9840c8` (#35): `./package.json` is exported, as recommended.
  This differs from the recommendation in one point, decided with the
  maintainer: `main` and `typings` were kept, not removed, because they
  are needed by the TypeScript projects that use `moduleResolution:
  node10`; the user guide, the 7.0.0 compatibility notice, and
  `CLAUDE.md` document that the support for `node10` is deprecated and
  will be removed in a future major release, by removing these fields,
  which will be a breaking change of that release. Tests check that the
  fields agree with `exports` and that `package.json` can be read
  through the package name. `package.json` is generated, so the template
  needs the same change.

- **#23 — One concept has several names.** [breaking]
  **[confirmed]** (fixed) (by reading)
  - The unset level is called the "preliminary state", "undefined"
    (`numericLevelUndefined`), "not set", and "initialised"
    (`hasLevel`, line 306).
  - The numeric level is called `levelNumericValue` (line 209),
    `numericLevel` (lines 98 and 567), `NumericLogLevel`, and
    `numericLevels`.
  - Messages are called "log lines", "log entries", and "messages".
  - `_console` is the only member with an underscore.
  - The method `warn()` writes the prefix `warning: `.
  - The category "Output Methods" collides with the method `output()`
    and also contains `write()`.

  Suggested change: settle on "preliminary state", "numeric level",
  and "message" in the comments and the documentation, which is
  non-breaking. Rename the protected members consistently together
  with #20, which is breaking.

  Issue #43.
  Fixed in `c646602` (#43): a wording pass gave each concept one term in the
  TSDoc, the comments, the user guide, and the tests (preliminary
  state, internal buffer, message, set a level), the category "Output
  Methods" became "Logging Methods", and the vocabulary is recorded in
  `CLAUDE.md`. This differs from the recommendation in one point,
  agreed with the maintainer: the protected members were not renamed,
  since `#20` deprecated them and they will be removed, so a rename
  would only add another alias. The item was tagged [breaking] only for
  that rename; the change has no effect on the API.

## 5. Simplicity and duplication

- **#24 — The output methods repeat the same code.** [internal]
  **[confirmed]** (by reading) (fixed)
  `src/lib/logger.ts` lines 607 to 854:
  - the eight methods differ only in the threshold, the stream, and
    the prefix;
  - the two branches of `error()` (lines 649 to 667) are identical
    except for the prefix;
  - the level validation is duplicated in the setter and in
    `isLevel()` (lines 349 to 353 and 543 to 547);
  - the `message === undefined` path of `write()` (lines 571 to 574)
    cannot be reached from the public methods, which always pass a
    string, and exists only for a test subclass.

  Suggested change: introduce a private
  `emit(numericLevel, stream, prefix, message, args)` and a private
  `validateLevel(level)`, and either drop the `undefined` case or
  document it as part of the protected `write()` contract (#20). The
  behaviour stays the same.

## 6. Modern TypeScript

  Issue #29.
  Fixed in `ec1946b` (#29): the eight output methods now share a
  private `emit()` method, keeping the behaviour and the arguments
  passed to `write()`, which a new test (`tests/tap/140-write.ts`,
  written against the previous code) checks; a suppressed call costs
  the same, and a written message about 5% more. The `undefined` case
  of `write()` is kept and documented as part of its contract. This
  differs from the recommendation in one point: the shared level
  validation was not added, because it is already one
  `isLogLevel()` call in the setter and in `isLevel()`, and moving the
  remaining `assert(level)` lines to a helper would change the message
  that users see.

- **#25 — The level names are defined twice, and the numeric type
  adds no safety.** [internal] **[confirmed]** (by reading) (fixed)
  `src/lib/logger.ts` lines 59 to 60 and 168 to 177: the `LogLevel`
  union and the keys of `numericLevels` are not linked. Adding a
  level to one and not the other compiles, and the typings show
  `numericLevels` as an inline object type
  (`dist/lib/logger.d.ts` lines 11 to 20). `NumericLogLevel` is a
  plain alias of `number`, so any number is accepted. The TSDoc of
  `LogLevel` says "integer values", but `numericLevelUndefined` is
  `Infinity`. Suggested change: define
  `numericLevels = { … } as const satisfies Record<LogLevel, number>`
  (or derive `LogLevel` as `keyof typeof numericLevels`), and correct
  "integer". The type of `numericLevels` becomes narrower (literal
  values), which is compatible for every reader.

  Issue #31.
  Fixed in `9151804` (#31): `numericLevels` now ends with
  `satisfies Record<LogLevel, number>`, as recommended, so the compiler
  rejects a missing or an extra level name; the emitted code and the
  typings are unchanged, and a test was added. "integer" was corrected
  to "numeric" in the TSDoc and in the user guide. The derivation of
  `LogLevel` from a frozen `as const` object was not done, since it is
  breaking and belongs to #6.

## 7. Performance and resources

- **#26 — The preliminary buffer is unbounded and formats every
  message.** [internal] **[confirmed]** (fixed)
  `src/lib/logger.ts` lines 576 to 586: in the preliminary state,
  every call, including `trace()`, is formatted with `util.format()`
  and stored together with a new closure.
  - 100000 calls of `trace('obj %o', {…})` took 315 ms, about
    3.2 µs each, and left 100001 records.
  - With the level set, the cost is small: one million suppressed
    `debug('value %d', i)` calls took 44 ms (44 ns each), and
    `if (log.isDebug)` reduced that to 3.9 ms. This part is sound.

  Suggested change: document the cost. Optionally:
  - store the arguments and format them on replay, only for the
    records that pass the threshold (note that this changes the
    snapshot semantics for mutable objects);
  - or add a `maxBufferSize` constructor option.

  Issue #32.
  Fixed in `059d5b2` (#32): the cost of the preliminary state (formatting
  at each call even for messages that are later discarded, about 0.2
  microseconds for a short message and about 3 for an object passed to
  `%o`), the unbounded buffer (about 250 bytes per message of 70
  characters), and the snapshot semantics are documented in the TSDoc
  of the class and in the user guide, and tested in
  `tests/tap/050-buffer.ts`. The behaviour is unchanged, as recommended;
  the optional change (formatting only when the buffer is flushed) is
  the follow-up item that comes next in this section, "The preliminary
  buffer formats every message when it is logged".

- **#32 — The preliminary buffer formats every message when it is
  logged.** [breaking] (withdrawn)
  Follow-up of #26, decided with the maintainer: store the arguments
  of the messages in the preliminary state (the message, the arguments,
  and the method), and format them only when the buffer is flushed, and
  only for the records that pass the level. This removes the formatting
  cost of the messages that are later discarded. It is **[breaking]**
  because it changes the snapshot semantics: a change of an argument
  after the call, before the level is set, becomes visible in the
  output (today the message shows the object as it was when logged).
  It requires a major version; the migration path is to log immutable
  values, or to convert the value to a string before logging, and the
  release notes should say that the arguments are formatted when the
  level is set. Any change of the buffer records (`LoggerBufferRecord`)
  is also a change of the protected surface (see #20). Not started.

  Withdrawn: decided with the maintainer, after the analysis made when
  the item came up for work, not to do it. The saving is small: in the
  preliminary state a short message costs about 0.2 microseconds, an
  object with `%o` about 3 microseconds, and a message of 70 characters
  about 250 bytes, and it matters only for an application that logs many
  messages with large objects before it sets the level. The effects are
  real and surprising: a `toString()` or a getter that throws would fail
  inside the `level` setter at the flush, far from the call, and would
  abort the flush, losing the remaining buffered messages; the message
  would show the argument as it is at the flush, not as it was when it
  was logged; and the buffer would keep the argument objects, which
  could be large, instead of short strings, until the level is set. The
  previous behaviour cannot be kept next to the new one, so the change
  would be breaking. The cost, the unbounded buffer, and the snapshot
  semantics are documented since the fix of #26 (`059d5b2`), so the
  users can act on them, for example by setting the level early.

## 8. Security

- **#27 — Messages can forge log lines, and this is not documented.**
  [internal] **[confirmed]** (fixed)
  The prefixes are added only to the first line, and control
  characters are not neutralised. `warn('user: a\nerror: forged')`
  printed two lines, the second of which looks like a genuine
  `error:` line, and ANSI escape sequences pass through. A message
  that contains user input and is followed by more arguments is
  interpreted as a format string: `info('100%d', 5)` printed `1005`.
  Suggested change: document in the class TSDoc that messages are
  written verbatim, and recommend `log.info('%s', userInput)` for
  untrusted text. Escaping is the caller's decision.

  Issue #30.
  Fixed in `75cb9c6` (#30): the behaviour is documented in the TSDoc of
  the class and in the user guide: forged lines (the prefix is added
  only to the first line), control sequences, and the interpretation of
  format directives. The suggested `log.info('%s', userInput)` was
  refined: `%s` writes strings as they are, including newlines and
  control characters, so `%j` or `%O` are recommended to escape them.
  Tests were added in `tests/tap/150-untrusted.ts`. Escaping is left
  to the caller, as recommended.

## 9. Incidental observations

- **#28 — The README and the website describe an older API.**
  [internal] **[confirmed]** (for the `consistency-check` skill)
  - `README.md` line 8 says "CommonJS/ES6 module", and line 18 links
    the v6.0.0 tree.
  - `website/docs/user/_project/_content.mdx` line 16 uses
    `request('@xpack/logger')`, which throws a `ReferenceError`.
  - The same file, lines 62 to 65, sets `trace` and then says
    `log.debug('world') // Ignored.`, but the message is printed.
  - The same file, lines 72 to 80, lists `any` parameters and an
    `error(message: Error)` overload that does not exist.
  - `install/_common/_prerequisites-module.mdx` line 6 requires
    Node.js >= 18.0.0.
  - The generated API reference was produced from an older commit,
    and shows the constructor parameters as required.
  - The FAQ page is a placeholder.

- **#29 — `CLAUDE.md` describes compiler options that are not set.**
  [internal] **[confirmed]** (for the `consistency-check` skill)
  `CLAUDE.md` lines 67 to 69 say that `tsconfig-common.json` enables
  `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`, and
  others. The effective configuration (`tsc --showConfig`) has
  neither option. Because the library is not compiled with
  `exactOptionalPropertyTypes`, it did not notice #10.
  `maintenance/config/tsconfig-original.json` (target `es2016`,
  module `commonjs`) is not referenced anywhere visible and should be
  removed, or explained.

- **#30 — The `devDependencies` include tools that are no longer
  used.** [internal] (by reading; for the `consistency-check` skill)
  `package.json` lines 68, 72, 74, and 75: `@types/tap` (tap 21 ships
  its own types), `standard`, `ts-standard` (replaced by ESLint), and
  `ts-node` are not used by any script. They enlarge the
  installation and the audit surface for contributors.

- **#31 — There is a leftover comment, and the description is
  dated.** [internal] (by reading)
  `src/lib/logger.ts` line 646 has `// error (message: Error): void`,
  a fragment of a removed overload. `package.json` line 4 says
  "A Node.js ES6 module"; "ES module" is the current term.

## 10. Reviewed and found sound

- Level comparison: each method's threshold matches its level, and
  `always()` outputs at `silent`. The stream matrix (only `error()`
  and `warn()` use stderr) matches the TSDoc.
- Replay order: the buffer is replayed in call order and filtered
  by the new level. A second assignment does not replay. Messages are
  formatted at call time, so later changes to objects do not alter
  them.
- Console receiver: the console methods are called as
  `this._console.log(msg)`, with the correct receiver, including from
  the buffered closures.
- Level validation uses `hasOwnProperty`, so `'toString'` and other
  prototype keys are rejected.
- A `null` console falls back to the global console, and a console
  without `log()` or `error()` is rejected in the constructor.
- `Error` instances are printed with their stack and their `cause`.
- The typings use `unknown`, never `any`.
- The `exports` map lists `types` before `default`.
- The `files` list publishes `dist/` and `src/` (without
  `src/README.md`), and the source maps resolve to the published
  sources.
- ES module `import` works on every Node.js version tested.
- Lint is clean; the tests pass with 100% coverage.
- A suppressed call costs about 44 ns, since the level is checked
  before the formatting.
