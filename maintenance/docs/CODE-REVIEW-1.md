# Code review

Date: 2026-11-12 00:55, on branch `development`, commit `98cb506`.

Scope: the whole current code: `src/index.ts`, `src/lib/logger.ts`, the
tests in `tests/tap/`, and the parts of `package.json` and of the build
configuration that the code depends on. `dist/`, `website/`, and
`node_modules/` were not reviewed.

Tooling: `npm run compile` passed; `npm run lint` passed with no warnings;
`npm test` passed (1147 assertions in 21 files), with 100% coverage of
statements, branches, functions, and lines, and no uncovered lines. The
probes are in the scratchpad folder of the session (`probe.mjs`, and a
typedoc run to JSON with a minimal `tsconfig`).

Summary: 22 problems. The most serious is #1 (the `@typeParam` tag of
the class captures almost the whole description of the class, so the
generated reference and the editors show it as the description of the
type parameter). #11 (an `Error` from another realm keeps the `error:`
prefix) and #12 (the contract of `write()` in the preliminary state) are
the behavioural problems; #13 is an inconsistency of the error types
thrown by the constructor, and the only **[breaking]** item. #15 (the
tests are not linted) explains the leftovers listed in #16.

## Naming and style

- **#1 — The `@typeParam` tag swallows the description of the class.**
  [internal] **[confirmed]** (fixed)
  `src/lib/logger.ts` lines 155-156: the `@typeParam C` block tag is placed
  after the second paragraph of the class comment, and in TSDoc a block
  tag extends to the next block tag; there is none, so the rest of the
  comment (lines 158-397: the table of the output methods, the timestamps,
  the prefix of an `Error`, the logging of errors, the untrusted input,
  and the preliminary state) belongs to the type parameter. A typedoc run
  on `src/index.ts` gives a class summary of 572 characters, and a comment
  of 10980 characters for the type parameter `C`, which starts with "The
  type of the console object; ..." and continues with "Use
  `log.always()` instead of ...". The generated API reference would show
  most of the user documentation under "Type Parameters", and the hover
  in the editors shows it in the same place. Move the `@typeParam` tag to
  the end of the comment, after line 397; consider adding a test to
  `tests/tap/160-package.ts` that the declaration of the class has a
  `@typeParam` tag whose text is short, or that the summary contains the
  table.
  GitHub issue #46.
  Fixed in `3f656bd` (GitHub issue #46): the tag is at the end of the
  class comment, as recommended; a test in `tests/tap/160-package.ts`
  checks that the tag in the published declaration is short. The test
  finds the tag by name, since TypeScript knows `@template`, not
  `@typeParam`.

- **#2 — A commented-out overload is left in the code.** [internal]
  (fixed)
  `src/lib/logger.ts` line 1337: `// error (message: Error): void` is dead
  code, a remnant of an older signature, placed between the TSDoc comment
  and the method it documents. Remove it.
  GitHub issue #47.
  Fixed in `37dcc7d` (GitHub issue #47): the line is removed, as
  recommended; no test, since only a comment changed.

## Documentation

- **#3 — `console` and `timestamp` have no `@category`.** [internal]
  (fixed)
  `src/lib/logger.ts` lines 1061-1071 and 1076-1087: all the other public
  members carry a `@category` tag, but these two accessors do not, so the
  generated reference puts them in a group of their own (the current
  generated page, `website/docs/api/classes/Logger.md`, lists `console`
  under "Other"). Add `@category Log Level Accessors` or a new category,
  such as `@category Configuration Accessors`, to both.
  GitHub issue #48.
  Fixed in `1a49483` (GitHub issue #48): both accessors have
  `@category Configuration Accessors`, as recommended; a test in
  `tests/tap/160-package.ts` checks that every public member of the class
  in the published declaration has a category.

- **#4 — The header comment of the file repeats the class description.**
  [internal] (fixed)
  `src/lib/logger.ts` lines 16-41 repeat, with small differences, lines
  158-167 and 351-358 of the class comment (the `always()` advice, the
  formatting directives, the missing `critical` level, and the
  preliminary state). Two copies drift apart; they already differ
  ("created, for example, when" against "created for example when",
  "is in a preliminary state" against "it is in a **preliminary
  state**"). Reduce the header to one line that states the purpose of the
  file, and keep the description only in the TSDoc of the class.
  GitHub issue #49.
  Fixed in `e6e5548` (GitHub issue #49): the header is two lines, which state
  the purpose of the file and point to the TSDoc of the class, as
  recommended; no test, since only a comment changed.

- **#5 — The `always()` advice makes a claim that the code does not
  support.** [internal] (fixed)
  `src/lib/logger.ts` lines 19-20 and 158-159: "Use `log.always()` instead
  of the `console.log()`, since it accounts for different contexts,
  created, for example, when using REPL." `always()` only calls `log()`
  on the console passed to the constructor, or on the global `console`;
  there is no code that handles a REPL or another context. The real
  reason to prefer it is that the output goes through the configured
  console (and so through a mock in the tests, and through `write()` in a
  subclass), and through the buffer of the preliminary state. Replace the
  sentence with that reason.
  GitHub issue #50.
  Fixed in `a809ad9` (GitHub issue #50): the sentence of the class comment
  gives that reason, as recommended; the copy in the header comment of the
  file had already been removed in the fix of item #4. No test, since
  only a comment changed.

- **#6 — Grammar and wording errors in the TSDoc.** [internal] (fixed)
  `src/lib/logger.ts`:
  - lines 27 and 162: "prevent the program to run" should be "prevent the
    program from running";
  - line 1066: "which allows to check the logged messages" should be
    "which allows the logged messages to be checked";
  - line 1098: "(like `isDebug`, etc)" combines "like" with "etc", and
    "etc" lacks its full stop; write "(like `isDebug`)";
  - line 1254: "regardless of the log level, (even `'silent'`, when no
    other messages are logged)" has a stray comma before the parenthesis;
  - lines 1254 and 1479 quote the level names (`'silent'`, `'debug'`),
    while the rest of the file writes them without quotes (`silent`,
    `debug`); use one form.
  GitHub issue #51.
  Fixed in `5810adc` (GitHub issue #51): all the listed errors are corrected,
  as recommended; the occurrence at line 27 had already been removed in
  the fix of item #4. The quotes in the code examples (for example
  `log.level === 'silent'`) are kept, since they are code. No test,
  since only comments changed.

- **#7 — `CLAUDE.md` claims compiler options that are not set.**
  [internal] **[confirmed]** (fixed)
  `CLAUDE.md` lines 115-117 state that
  `maintenance/config/tsconfig-common.json` is strict with
  `exactOptionalPropertyTypes` and `noUncheckedIndexedAccess`; neither is
  set (`npx tsc --showConfig -p tsconfig.json` lists only `strict` among
  them), and `@tsconfig/node22` does not set them. The source is written
  as if they were (`level?: LogLevel | undefined`), and
  `tests/tap/180-types.ts` checks the typings with and without
  `exactOptionalPropertyTypes`, so the library is not exposed, but the
  sources and the tests are not compiled with them. Either add the two
  options to the template that generates `tsconfig-common.json`, which
  also makes the `if (call === undefined)` guards of the tests necessary
  rather than defensive, or correct `CLAUDE.md`.
  GitHub issue #52.
  Fixed in `0ad6d4b` (GitHub issue #52): the first alternative, the two
  options are added to the template in `@xpack/npm-packages-helper`
  (`templates/common/maintenance/config/_xpack/tsconfig-common-liquid.json`,
  not yet committed in that repository) and the file is re-generated;
  `CLAUDE.md` is now correct. The sources and the tests compile with the
  options without changes. The other packages that use the template get
  the options at their next re-generation.

- **#22 — The deprecated level setters can make the level and its name
  disagree.** [internal] **[confirmed]** (fixed)
  `src/lib/logger.ts`, the deprecated protected `levelNumericValue` and
  `levelName`: they write the private state directly, so the setter of
  one leaves the other unchanged. After `levelNumericValue` is set to
  `Logger.numericLevelUndefined`, `level` still returns the name while
  `hasLevel` is `false` and the messages are buffered; writing
  `levelName` changes `level` but not the level checks. This is the
  documented previous behaviour, kept until the next major version, so
  the behaviour is not changed. Added after the report, from the "Not
  reported" section, at the request of the maintainer.
  GitHub issue #65.
  Fixed in `f47aa89` (GitHub issue #65): a sentence in the TSDoc of both
  members, which tells the subclasses to set the `level` accessor
  instead; it is in the published declarations. The review suggested the
  warning for `levelNumericValue` only; `levelName` has the same hazard.
  No test, since only comments changed; `tests/tap/210-subclass.ts`
  already pins both behaviours.

## API and packaging

- **#8 — Unused and obsolete development dependencies.** [internal]
  (fixed)
  `package.json` lines 66, 71, and 74: `standard` and `ts-standard`, the
  linters used before ESLint, are not used by any script or source;
  `@types/tap` (version 15) describes a version of `tap` six major
  releases old, while `tap` 21 ships its own typings. They cost install
  time, add audit noise, and mislead a reader about the tooling. Remove
  them (and their mention in `tests/tap/README.md`), after checking that
  `generate-top-commons` does not add them back.
  GitHub issue #53.
  Fixed in `7626025` (GitHub issue #53): the three packages are removed from
  `package.json` and `package-lock.json`, and `@types/tap` from
  `tests/tap/README.md`, as recommended; the template does not add them
  back. `ts-node` is kept, as in the "Not reported" section. No test,
  since a removed package cannot be tested for.

- **#9 — The `test-one` script refers to files that do not exist.**
  [internal] **[confirmed]** (fixed)
  `package.json` line 110: `test-one` passes
  `--coverage-map=tests/coverage-map.js` and
  `tests/tap/*/object-substitution.ts`; neither exists (`ls
  tests/coverage-map.js` fails, and `tests/tap/` has no sub-folders), so
  the script cannot work. Remove it, or replace it with the command that
  `CLAUDE.md` documents (`npx tap --disable-coverage <file>`). If the
  script comes from the template, fix the template.
  GitHub issue #54.
  Fixed in `886a0f1` (GitHub issue #54): the script is replaced, not removed:
  `tap run --reporter=tap --disable-coverage`, which runs the test files
  given as arguments (`npm run test-one -- tests/tap/040-is-level.ts`),
  and `CLAUDE.md` mentions it. The script does not come from the
  template. Verified by running it, since a script cannot be covered by
  a test.

- **#10 — The npm description says "ES6 module".** [internal]
  (fixed)
  `package.json` line 4: "A Node.js ES6 module with a generic console
  logger class". The README (line 8) says "ES module", which is the
  current name, and the term used in `CLAUDE.md`; "ES6" also echoes the
  ES6 wrapper of v6, which v7 removed. The description is what npm shows
  in the search results. Change it to "A Node.js ES module with a generic
  console logger class".
  GitHub issue #55.
  Fixed in `400fb72` (GitHub issue #55): the description is changed as
  recommended, and so are the website metadata description
  (`website/package.json`) and the overview page
  (`website/docs/getting-started/_project/_overview.mdx`), which used
  "CommonJS/ES6 module"; the TSDoc has no such mention. The tagline in the
  generated `website/docusaurus.config.ts` still says "CommonJS/ES6
  module", and changes at the next re-generation of the website commons,
  which is a larger change; the generated `_commonjs-compatibility.mdx`
  says "ES6 modules", from the shared template. No test, since only texts
  changed.

## Correctness and robustness

- **#11 — `error()` keeps the prefix for an `Error` from another realm.**
  [internal] **[confirmed]** (fixed)
  `src/lib/logger.ts` line 1343: the prefix is omitted when `message
  instanceof Error`, which is false for an error created in another
  realm (for example in a `vm` context), while
  `util.format()` still expands it as an error. The probe
  `log.error(vm.runInNewContext('new Error("foreign")'))` writes
  `error: Error: foreign`, while `log.error(new Error('local'))` writes
  `Error: local`. The documentation (lines 255-264, 1299-1302) promises
  the omission for any `Error` object. Use
  `util.types.isNativeError(message) || message instanceof Error` (the
  second test keeps the objects that only inherit from `Error`), and add a
  test with `vm.runInNewContext()`. The output changes only for
  cross-realm errors, to match the documentation, so it is a fix, not a
  breaking change.
  GitHub issue #56.
  Fixed in `72c4146` (GitHub issue #56): different from the recommendation.
  `util.types.isNativeError()` is deprecated in favour of
  `Error.isError()`, which Node.js 22, the minimum version, lacks, so the
  check is `Object.prototype.toString.call(message) === '[object Error]'
  || message instanceof Error`. It recognises the errors of another
  realm, their subclasses, and the objects that inherit from `Error`; an
  object that sets `Symbol.toStringTag` to `'Error'` is also taken for an
  error, which `util.format()` would not do, and which is harmless.
  Tests with `vm.runInNewContext()` are in `tests/tap/090-errors.ts`.

- **#12 — The contract of `write()` is incomplete for the preliminary
  state.** [internal] **[confirmed]** (fixed)
  `src/lib/logger.ts` lines 1138-1141: "every message that passes the
  level check is formatted, prefixed, and passed here, so an override can
  inspect, change, redirect, or drop it". In the preliminary state every
  message passes, including those that the level set later discards, and
  the replay in the `level` setter (lines 867-871) calls the stored
  functions directly, not `write()`. A subclass that redirects the
  messages without calling `super.write()` therefore writes messages that
  should have been filtered: the probe, with an override that only
  records, logs `info('kept')` and `trace(...)`, sets the level to
  `info`, and records both. `tests/tap/140-write.ts` (the test "write()
  receives all the messages in the preliminary state") checks the
  behaviour, but the documentation does not state it. State in the TSDoc
  of `write()` that, in the preliminary state, it receives every message,
  that the filtering happens at the replay, which does not call `write()`
  again, and that an override that does not call `super.write()` must
  check `hasLevel` and filter the messages itself, with
  `numericLevel`.
  GitHub issue #57.
  Fixed in `02f5f1f` (GitHub issue #57): the TSDoc of `write()` states it, as
  recommended, with a refinement: in the preliminary state an override
  cannot filter, since the level is unknown, so it is told to call
  `super.write()`, or, if it handles the messages itself, to compare
  `numericLevel` with `Logger.numericLevels[this.level]` when `hasLevel`
  is true. No test, since only a comment changed; the behaviour is covered
  by `tests/tap/140-write.ts`.

- **#13 — The constructor validates its options with two kinds of
  errors.** [breaking] (fixed)
  `src/lib/logger.ts` lines 779-786: an invalid `console` throws an
  `AssertionError`, while an invalid `level` (lines 560-574) throws a
  `RangeError` or a `TypeError`, and an invalid `timestamp` (lines
  763-769) a `TypeError`. The probe confirms the three classes. All three
  are invalid arguments of the same call, and since v7 the library has
  moved the level validation from `assert()` to the standard error types
  for this reason; the console is the only one left behind. Throw a
  `TypeError` with the same messages. This changes the class of a thrown
  error, so it requires a major version, and the release notes must mark
  it as a breaking change. The previous behaviour cannot be preserved,
  since one error cannot be both an `AssertionError` and a `TypeError`;
  if it is done in v7, which already changes the level errors, it costs
  no extra major release. Release notes: "**Breaking change:** a console
  without the `log()` or `error()` function, passed to the `Logger`
  constructor, now throws a `TypeError` instead of an `AssertionError`;
  the messages are unchanged." Alternatively, keep the `AssertionError`
  and document why the console is different.
  GitHub issue #58.
  Fixed in `72a7f68` (GitHub issue #58): the first alternative, a `TypeError`
  with the same messages; the previous behaviour is not preserved, for
  the reason given. The TSDoc, the user guide, and the tests are updated,
  and the breaking change is in the compatibility notice of v7.0.0, with
  the text of the release notes above. The `node:assert` import is gone.

- **#14 — A new function is created for every message.** [internal]
  **[confirmed]** (withdrawn)
  `src/lib/logger.ts` lines 1238-1248: `emit()` creates a new arrow
  function for each message that passes the level, and in the preliminary
  state each buffered record keeps its own closure (part of the "about 250
  bytes" per record documented at line 390). The probe shows that two
  `info()` calls pass two different functions to `write()`. Two functions,
  created once per logger (for example two private fields that call
  `this.#console.log(msg)` and `this.#console.error(msg)`), and selected by
  the `stream` argument, avoid the allocation, reduce the memory of the
  buffer, and remove the branch inside the closure. The receiver of the
  console calls is unchanged.
  Withdrawn: the suggested change was implemented and measured (Node.js
  24.22.2, 2 million messages, three alternating runs of the old and of
  the new build). It was not faster: a written message took 30.2 to
  31.2 ns before and 31.5 to 34.4 ns after, and a message with an
  argument 99.1 to 110.9 ns before and 111.7 to 118.1 ns after. It
  saved memory only in the preliminary state, from 225 to 121 bytes per
  buffered message. The closure is cheap to allocate, so the saving does
  not justify two more private fields, and the documented figure of
  about 250 bytes per message is correct. No GitHub issue was created,
  and the change was reverted.

- **#18 — `isLogLevel()` uses the long form of `hasOwnProperty`.**
  [internal] (fixed)
  `src/lib/logger.ts` line 517:
  `Object.prototype.hasOwnProperty.call(Logger.numericLevels, value)`;
  `Object.hasOwn()` does the same, is shorter, and is available on every
  supported Node.js version. Use it. Added after the report, from the
  "Not reported" section, at the request of the maintainer.
  GitHub issue #62.
  Fixed in `d5e2163` (GitHub issue #62): as recommended; no new test, since
  the behaviour is unchanged and `tests/tap/100-level-names.ts` covers
  the inherited names.

- **#19 — `emit()` takes any string as the kind of a message.**
  [internal] (fixed)
  `src/lib/logger.ts`, the parameter `kind` of `emit()`: it is a `string`,
  where a union of the four kinds and the empty string is more precise;
  the method is private and is called from eight fixed places, so a
  mistyped kind compiles and gives a wrong prefix. Added after the
  report, from the "Not reported" section, at the request of the
  maintainer.
  GitHub issue #63.
  Fixed in `dce372c` (GitHub issue #63): the internal type `MessageKind`, not
  exported, is used for the parameter, as recommended. No test, since it
  is a type; a temporary typo in a call was rejected by the compiler.

- **#20 — `ts-node` may be an unused development dependency.**
  [internal] **[confirmed]** (withdrawn)
  `package.json`, `devDependencies`: `ts-node` is mentioned only in
  `tests/tap/README.md` and in `.vscode/launch.json`; it was not
  established whether the TypeScript plugin of `tap` 21 still needs it.
  Added after the report, from the "Not reported" section, at the request
  of the maintainer.
  Withdrawn: it was established that `tap` 21 does not need it (its
  TypeScript plugin depends on its own fork, `@isaacs/ts-node-temp-fork-
  for-pr-2009`), and that `npm test`, with the compilation, the lint, and
  all the tests, passes with 100% coverage when `ts-node` is hidden. But
  the debug configurations of `.vscode/launch.json` use it
  (`--loader=ts-node/esm`), and `node --loader=ts-node/esm
  tests/tap/020-logger-single.ts` works on Node.js 24.22.2, with an
  experimental-loader warning. The template of
  `@xpack/npm-packages-helper` adds it to every TypeScript package, so a
  removal here would be overwritten at the next re-generation, and a
  lasting removal is a decision for the template, for all the packages.
  No GitHub issue was created and nothing was changed. Not part of this
  item, and not fixed: `.vscode/launch.json` has entries for files that do
  not exist (`tests/tap/010-mock-console.ts` and `index.ts`), and
  `tests/tap/README.md` describes the old setup.

- **#21 — The cast `console as unknown as C` is unsound.**
  [breaking] **[confirmed]** (fixed)
  `src/lib/logger.ts` line 570: the logger uses the global `console` when
  none is passed, and the cast says that it is of the type `C`; this is
  unsound when the type argument is given explicitly without a console:
  `new Logger<MockConsole>({ level: 'info' })` compiles, and
  `log.console.outLines` is `undefined` at run time. Added after the
  report, from the "Not reported" section, at the request of the
  maintainer. The report first said that a fix needed a static factory;
  that was wrong.
  GitHub issue #64.
  Fixed in `0376b99` (GitHub issue #64): the arguments of the constructor
  depend on the type, `constructor(...args: Console extends C ?
  [params?: P] : [params: P & { console: C }])`, so the console is
  optional only when the global `console` is of type `C`, and the
  inference of `C` is kept; the new exported types are `LoggerParams` and
  `LoggerArguments`. It is a breaking change at compile time only, for
  code that is already wrong, so it needs the major version (7.0.0), and
  the previous typing is not preserved, since it is the one that allows
  the wrong code. The compatibility notice of v7.0.0 and the user guide
  are updated, and a type fixture in `tests/types/console-types.ts`
  checks the accepted and the rejected calls; it fails without the
  change.

## Tests

- **#15 — The tests are not linted.** [internal] **[confirmed]** (fixed)
  `package.json` line 93: `npm run lint` checks only `src`, and the
  ESLint configuration cannot check the tests:
  `npx eslint --config maintenance/config/eslint.config.js
  tests/tap/020-logger-single.ts` fails with "was not found by the project
  service", since the root `tsconfig.json` excludes `tests`. The tests are
  type-checked (`compile-tests`), but not checked for the rules of
  `strictTypeChecked`, although two of them carry `eslint-disable`
  comments, as if they were linted. Point the project service to
  `maintenance/config/tsconfig-tests.json` for the files under `tests/`
  (or use `allowDefaultProject`), and add `tests` to the `lint` script.
  #16 lists defects that a lint run would probably have shown.
  GitHub issue #59.
  Fixed in `62e6bca` (GitHub issue #59): different from the recommendation,
  because the lint script and the ESLint configuration are generated. An
  opt-in property `lintTests` is added to the templates of
  `@xpack/npm-packages-helper` (not yet committed in that repository),
  set in `maintenance/config/top-templates.json`, and the files are
  re-generated; the ESLint block for the tests uses
  `maintenance/config/tsconfig-tests.json`, not the project service. A
  lint of the tests gave 90 problems: the real ones are fixed, and the
  tests of the deprecated members and the type fixtures disable the
  rules that they must break, each with a stated reason.

- **#16 — Leftover debugging code in the tests.** [internal]
  (fixed)
  - `tests/tap/020-logger-single.ts` line 74:
    `console.log(mockConsole.outLines)` writes to the real console in the
    middle of the tap output;
  - `tests/tap/020-logger-single.ts` lines 22 and 38: `assert` is imported
    only for `assert(Logger)`, which checks nothing that the import does
    not already guarantee;
  - `tests/tap/030-logger-multi.ts`, `040-is-level.ts`, `050-buffer.ts`,
    `060-logger-empty.ts`, `070-logger-default.ts`, and
    `080-undefined.ts`, line 22: a commented-out import of `assert`.

  Remove them.
  GitHub issue #60.
  Fixed in `c1546dd` (GitHub issue #60): all the listed leftovers are removed,
  as recommended, and also a second commented-out debug line,
  `// console.log(mockConsole.errLines)`, in `020-logger-single.ts`.
  No test, since only leftovers were removed.

- **#17 — The generated test configuration has an unrendered
  placeholder.** [internal] (fixed)
  `maintenance/config/tsconfig-tests.json` line 3: the header reads
  "Automatically generated from template file: `{{fromFilePath}}`"; the
  template variable was not substituted, so the file does not say which
  template to change. The file is generated, so fix the template in
  `@xpack/npm-packages-helper`, not the file.
  GitHub issue #61.
  Fixed in `ec3f024` (GitHub issue #61): the template is renamed to
  `tsconfig-tests-liquid.json` in `@xpack/npm-packages-helper` (not yet
  committed in that repository), so that the generator renders it, and the
  file is re-generated; only the header line changes. No test, since the
  fix is in a generated header.
