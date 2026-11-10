---
name: code-review
description: 'Perform a thorough, uncompromising code review of a change (uncommitted changes, a set of commits, or a path) in the xPack Logger library (@xpack/logger): style, naming, TSDoc documentation, API and packaging, tests, and correctness. Report the problems found in a new numbered report, each with a permanent number. Use when the user asks for a "code review", to "review the code", to "review changes", or to check a file, folder, or diff before a commit.'
argument-hint: 'Optional: path, commit range, or "staged"; defaults to the uncommitted changes, or to the commits on development not yet on master'
---

# Code Review — xPack Logger

The rules for judging, tagging, numbering, and writing reports are in
`.github/skills/review-common.md`; read it first.

## When to Use

- The user asks for a code review of a file, folder, diff, or set of
  commits.
- The user asks to check adherence to the project's coding standards
  before a commit.

This skill reviews a change against the project's conventions. The
design of the library as a whole (the public API, the packaging, the
structure) is reviewed by the `design-review` skill; suggest it when a
change raises a question of that kind, rather than extending this
review.

## Review Scope

- If the user specifies a path, review that path in full.
- If the user specifies commits or a range, review their diff
  (`git diff <range>`), reading the changed files in full for context.
- Otherwise, review the uncommitted changes (`git diff HEAD`); if the
  working tree is clean, review the commits on `development` that are
  not on `master` (`git diff master...development`).

Include the tests in `tests/tap/` that exercise the changed code, and
the parts of `package.json` that depend on it (`exports`, `main`,
`module`, `types`, `scripts`, `tap`, `engines`).

Do not review `cjs/`, `node_modules/`, `website/`, or the generated
common files (the workflows, and the `_common` folders under
`website/`), which are produced by `generate-top-commons`. `esm/index.js`
is a hand-written shim and is reviewed.

State the scope, the branch, and the commit (`git rev-parse --short
HEAD`) at the top of the report.

## Checklist

Review every item below, with file and line references.

### Naming and style

- The code passes `ts-standard` (the `standard` style: two spaces, no
  semicolons, single quotes, a space before the parentheses of
  function and method declarations); no line exceeds 80 characters,
  including comments, except for URLs.
- Classes and types are `PascalCase`; functions, methods, properties,
  and variables are `camelCase`; constants follow the style already
  used in the file.
- Member names that are not public follow the convention already used
  in the file; flag a new member that does not.
- Method names start with a verb that states their effect; getters
  have no side effects.
- Relative imports use the `.js` extension (`node16` module
  resolution).
- The sections of a file use the existing separator comments
  (`// ----` and `// ====`).
- The change follows the patterns already used elsewhere in the code
  base, or has a visible reason not to.

### Documentation (TSDoc)

- Every class, method, property, parameter, and return value has a
  TSDoc comment, including `protected` members and the members marked
  `@internal`.
- Members carry the `@category` tag used by their neighbours, so that
  the generated typedoc reference stays grouped.
- Examples in the comments are valid and still match the signature.
- Comments use British English spelling ("behaviour", "initialise"),
  formal wording, no contractions, and the Oxford comma.
- Existing documentation is reviewed: improve it where it is vague,
  repeats the signature, or is out of date with the change.
- The file header carries the xPack MIT licence block, with a
  plausible copyright year range, and the `max-len` eslint comment.

### API and packaging

- A new public member is exported through `src/index.ts`; nothing that
  should be private is exported.
- A change to a name, a signature, a level value, the stream used by a
  method, or the output format is a change of the contract with the
  users; flag it as **[breaking]**.
- `package.json` stays consistent with the code: `exports`, `main`,
  `module`, and `types` point to files that exist after `npm run
  compile`; `esm/index.js` re-exports everything that `cjs/index.js`
  does.
- The library stays free of runtime dependencies that it does not
  import in `src/`.

### Correctness and robustness

- Level logic: a message is output when the numeric level of the
  logger is greater than or equal to that of the method; `always` is
  output at every level, including `silent`; the `is*` getters and
  `isLevel()` agree with the numeric values.
- The preliminary state (no level): messages are buffered, in order,
  with the function to be used; the buffer is replayed exactly once
  when the level is set, honouring the level, and emptied; setting the
  level again does not replay old messages.
- Arguments: `undefined`, `null`, empty strings, non-string values,
  `Error` instances, and format directives with and without extra
  arguments behave as documented.
- The console passed to the constructor is used for every output; the
  methods are called so that a console with replaced methods, or a
  mock, receives the calls with the expected receiver (`this`).
- `assert()` is used for programming errors only, with a message that
  tells the caller what was wrong.
- Type safety: no `any` where a type is possible (the existing
  `message: any` follows the `util.format` signature), no non-null
  assertions without justification, and no casts instead of guards.
- The change adds no dead code and does not duplicate logic that
  already exists.

### Tests

- Every behaviour added or changed has a test in `tests/tap/`; a
  defect fix has a test that fails without the fix.
- Tests follow the existing files (`import { test } from 'tap'`,
  numeric prefix in the file name, a mock console to capture the
  output), and check the stream and the exact text.
- The tests would still pass if the implementation were wrong in the
  obvious way (for example, they assert on both the `log` and the
  `error` output).

## Tooling Verification

Verify by running rather than by reading only:

```sh
npm run compile
npm run lint
npm test
```

`npm test` runs the lint first, then `tap --show-full-coverage`; report
the failures and every uncovered line. Do not run `npm run fix`, which
modifies the files. Do not accept inline `eslint-disable` comments that
silence a finding without a stated reason.

The release notes (`CHANGELOG.md`) are written during the release
preparation, not with each change; do not report their absence from a
change.

## Evidence

Probe the suspected defects as described under "Confirming Findings
with Probes" in `.github/skills/review-common.md`, and tag the
confirmed ones **[confirmed]**.

## Report

Write the report to a new file, `maintenance/docs/CODE-REVIEW-<n>.md`
(see "Report Files" in `.github/skills/review-common.md`):

```markdown
# Code review

Date: <YYYY-MM-DD HH:MM>, on branch `<branch>`, commit `<hash>`.

Scope: <the path, the range, or the uncommitted changes>.

Tooling: <the results of compile, lint, and test, with the coverage>.

Summary: <n> problems. <The most serious, by number.>

## Naming and style

- **#1 — <short title>.** [internal] **[confirmed]**
  `<file>` line <n>: <what is wrong, the evidence, and the suggested
  change>

## Documentation

## API and packaging

## Correctness and robustness

## Tests

## Not reported

<anything left out because it was not certain enough to include>
```

## Procedure

1. Identify the review scope, and the number of the new report.
2. Read the changed files fully; do not review from partial context.
3. Go through the checklist section by section, collecting concrete
   findings (file, line, description, why it matters).
4. Probe the suspected defects that can be probed.
5. Run the tooling, and include the results.
6. Write the report to the new file.
7. Give the user a short summary: the counts and the most serious
   problems by number.
8. Do not fix the issues unless the user asks for that separately; see
   "Acting on an Item" in `.github/skills/review-common.md`.
