---
name: design-review
description: 'Review the design and implementation of the whole xPack Logger library (@xpack/logger): defects, usability for a new user (tasks done from the documentation and the typings alone), the public API, the ES module only packaging, structure, naming and consistency, simplicity, modern TypeScript usage, performance, and security. Confirm suspected defects with probe programs. Each review is fresh (the earlier reports are not read); report the problems found in a new numbered report, each with a permanent number, and suggest improvements. Use when the user asks for a "design review", an "architecture review", a "full review" of the library, to "analyse the design", or for a review before a release.'
argument-hint: 'Optional: file or folder to review (e.g. src/lib/logger.ts); defaults to src/ and the packaging in package.json'
---

# Design Review — xPack Logger

The rules for judging, tagging, numbering, and writing reports are in
`.github/skills/review-common.md`; read it first.

## When to Use

- The user asks for a review of the design, the architecture, or the
  implementation of the library as a whole, or of a part of it.
- Before a release, to collect the changes worth making, in
  particular those that change the contract with the users.
- After a large change to the public API or the packaging, to check
  that the design is still consistent.

This skill judges the library as a user and a maintainer meet it:
through its API, its documentation, its packaging, and its code. It
reports problems and suggests improvements; it does not change the
code, unless the user asks for that separately (see "Acting on an
Item" in `.github/skills/review-common.md`).

Related skills, with different scopes:

- `code-review`: the conventions, documentation, and correctness of a
  change (a diff, a set of commits, or a path); cheap, and run often;
- `consistency-check`: the consistency between the code, the TSDoc
  documentation, the website, the packaging, the tests, and the other
  project files.

## A Fresh Review Each Time

**Each review is independent of the previous ones.** Do not read the
earlier reviews (`maintenance/docs/DESIGN-REVIEW-*.md` and
`maintenance/docs/CODE-REVIEW-*.md`), the other reports in
`maintenance/docs/` (for example `CONSISTENCY-CHECK.md`), or the
commit messages and GitHub issues that refer to their items. Judge the
library as it is now, as if for the first time: the earlier
conclusions must not decide what is examined, what is reported, or how
it is classified. A problem that an earlier review already reported,
and that is still present, is reported again.

The only use of the earlier reports is their file names, to choose
the number of the new report. Never modify an earlier report as part
of a new review.

## Scope

If the user specifies a file or a folder, review only that (but read
whatever it depends on). Otherwise review:

- all the sources in `src/` (`index.ts` and `lib/logger.ts`);
- the packaging in `package.json` (`exports`, `main`, `module`,
  `types`, `type`, `engines`, `dependencies`, `devDependencies`,
  `scripts`) and `.npmignore`;
- the TypeScript configuration (`tsconfig.json` and
  `maintenance/config/tsconfig-*.json`);
- the tests in `tests/tap/`, as a statement of the intended behaviour.

Do not review `node_modules/`, or `website/` (the website is
reviewed only for the claims that it makes about the API; see
"Using the Library as a Newcomer"). Do not review the generated common
files, which are produced by `generate-top-commons`.

State the scope, the branch, and the commit (`git rev-parse --short
HEAD`) at the top of the report.

## Using the Library as a Newcomer

Before reading the implementation, use the library as a new user
would, to find what makes it hard to learn and to use. This exercise
comes first: once the implementation has been read, it can no longer
be done without that knowledge.

If the agent can start a sub-agent, give the exercise to a fresh one,
with only this section as its instructions, and use its notes.
Otherwise do it before reading `src/`.

The newcomer reads only what a user sees: `README.md`, the published
typings (`dist/index.d.ts` and `dist/lib/logger.d.ts`, after `npm run
compile`), and the pages of the project website in `website/docs/`
(`getting-started`, `install`, `faq`, and the generated API reference).

The newcomer does not read `src/lib/logger.ts`, the tests, or the
earlier reports. For each task, write down the steps, and write the
program in `<scratch>/newcomer/`, then run it:

1. install the package, use it from an ES module program, and try it
   from a CommonJS program, noting what the user sees and whether the
   documentation explains it (the package is ES module only; the
   packaging is part of the usability);
2. create a logger with a level and write a message at each level;
3. create a logger without a level, log some messages, set the level,
   and see which messages appear;
4. check the level before doing expensive work (`isDebugEnabled`, `isLevel()`);
5. use a different console (for example a mock) to capture the output;
6. log an `Error`, a message with format directives, `undefined`, and
   an object;
7. find out which stream (`stdout` or `stderr`) each method uses, and
   when to use `always()` and `output()`;
8. use the library from TypeScript, with the typings only.

For each task, record what had to be looked up and where it was found,
or not found; the places where several ways are offered for the same
thing; the places where the documentation, the typings, and the
behaviour disagree; and the terms used for one concept.

The findings go to section 2 ("Usability"). A problem whose only cause
is stale documentation goes to the incidental observations, with the
`consistency-check` skill named as the one that covers it.

## Reading the Code

Read **every** file in scope in full; do not skim and do not rely on
searches alone. A useful order:

1. `package.json` and `src/index.ts` (what is exported, and
   how a consumer resolves it);
2. the types and the constants at the top of `src/lib/logger.ts`;
3. the constructor, the `level` setter, the buffer, and the `write()`
   method;
4. the logging methods, one by one;
5. `tests/tap/`, to see which behaviour is specified, and which is
   not.

While reading, note for each member: who calls it, what it costs, and
what it does that its name does not say.

Run the tooling, and report every error and warning:

```sh
npm run compile
npm run lint
npm test
```

Check what would be published with `npm pack --dry-run`, and compare
it with the intention of `.npmignore`.

## Checks

### 1. Defects

Wrong results, lost or duplicated messages, wrong streams, wrong
levels, exceptions, and unhandled cases. Probe each one (see
"Confirming Findings with Probes" in `.github/skills/review-common.md`).
Look in particular at:

- the comparison of the numeric levels, the `always` level, the
  `silent` level, and the `all` level;
- the preliminary state: the order of the replayed messages, the
  replay on a second assignment of the level, a level set from inside a
  replayed callback, and the buffer growing without limit;
- the functions kept in the buffer and the log functions of the
  console: whether they are called with the right receiver, and which
  console is used when the console object is replaced later;
- the handling of `undefined`, `null`, empty and non-string messages,
  `Error` instances (stack, `cause`), and extra arguments;
- the `assert()` calls: whether they remain in the published code,
  what the caller sees, and whether they validate the constructor
  parameters (the console, the level) completely;
- behaviour under a console without some methods, or one whose methods
  throw.

### 2. Usability

The findings of the newcomer exercise, and:

- the clarity of the names (`output`, `always`, `verbose`, `trace`) and
  of their relationship to the levels;
- whether the level can be read and set conveniently, and whether the
  errors for an invalid level tell the caller what to do;
- the documentation in the TSDoc comments: accuracy, examples that
  work, completeness for the generated reference, and the structure of
  the comments (see `.github/skills/tsdoc-rules.md`);
- the use of the library from both module systems and from TypeScript.

### 3. Structure and layering

- The size and the responsibilities of the `Logger` class: whether the
  buffer, the level logic, and the output belong in one class.
- The visibility of the members (`protected` versus `private`, and the
  members marked `@internal`): what a subclass may rely on, and
  whether the protected surface is part of the contract.
- The ES module only packaging: the `exports` map (the `types`
  condition, the `default`), the `files` list, the tracked `dist/`
  output, the declaration files, and the consequences for CommonJS
  consumers (`require()` of an ES module, the minimum Node.js version
  in `engines`).
- The `dependencies`: whether `@xpack/mock-console` is used by `src/`,
  or only by the tests, and so belongs in `devDependencies`.
- The `engines` field against `@types/node`, the `target` and `lib` of
  the compiler, and the syntax emitted.

### 4. Naming and consistency

- Names of members, types, and files; a consistent vocabulary (level,
  threshold, buffer, preliminary) in the code, the comments, and the
  documentation.
- Consistency between the methods: the same treatment of arguments,
  the same documentation pattern, the same stream conventions.
- The use of `any`, and of exported type names (`LogLevel`,
  `NumericLogLevel`, `LoggerFunction`, `LoggerBufferRecord`).

### 5. Simplicity and duplication

- The near-identical logging methods: whether the repetition is
  justified or removable without changing the behaviour.
- Code that is not needed, state that can be derived, and paths that
  can never be taken.

### 6. Modern TypeScript

- The compiler options against the current practice
  (`strict`, `exactOptionalPropertyTypes`, and the others in
  `maintenance/config/tsconfig-common.json`), and the TypeScript
  version pinned in
  `devDependencies` against the syntax that the code could use.
- Static members used as mutable global state (`defaultLevel`,
  `numericLevels`, `numericLevelUndefined`, `numericLevelAlways`):
  whether they are `readonly`, `as const`, or modifiable by a consumer.
- A string union (`LogLevel`) and a separate map of numeric values:
  whether they can drift apart.
- Parameter objects typed inline in the constructor, and the use of
  `assert` for argument validation instead of type guards.

### 7. Performance and resources

- The cost of a message that is not output: the formatting
  (`util.format`) before the level check, and the allocation of the
  arguments array.
- The cost of the buffer: memory, and the work done when it is replayed.
- The cost of loading the module, and the size of the package.

Measure, do not guess: write a probe that calls a suppressed method a
million times, and report the time.

### 8. Security

- Whether messages can inject terminal control sequences or forge
  messages (newlines, ANSI escapes) and whether the documentation tells
  the caller.
- The handling of the formatting directives in a message that contains
  user input (`%s`, `%o`, `%j`), and prototype or getter side effects
  when objects are formatted.
- The supply chain: the dependencies, the lock file, the scripts that
  run on install or publish, and the files published in the package.

### 9. Incidental observations

Everything noticed that belongs to another category, or to another
skill, with the skill named.

### 10. Reviewed and found sound

Record the areas checked and found sound, so that the next review
knows what was covered.

## Judging Findings and Numbering

Follow "Judging Findings" and "Numbering" in
`.github/skills/review-common.md`.

## Report

Write the report to a new file, `maintenance/docs/DESIGN-REVIEW-<n>.md`
(see "Report Files" in `.github/skills/review-common.md`):

```markdown
# Design review

Date: <YYYY-MM-DD HH:MM>, on branch `<branch>`, commit `<hash>`.

Scope: <files and packaging reviewed>.

Method: <how the code was read, the number of files and lines, the
tooling results, how the probes were built, and who did the newcomer
exercise (a sub-agent, or the reviewer before reading the code)>.

Independence: the earlier reports in `maintenance/docs/`, and the
commits and issues that refer to them, were deliberately not
consulted.

Summary: <n> problems (<open> open, <fixed> fixed, <withdrawn>
withdrawn). <The most serious problems, by number, and the suggested
order of work: defects first, then non-breaking clean-ups, then the
breaking changes, grouped for one major release.>

<the meaning of the tags [breaking], [internal], and [confirmed]>

## 1. Defects

- **#1 — <short title>.** [breaking|internal] **[confirmed]**
  `<file>` lines <n> to <m>: <what is wrong, the evidence, and the
  suggested change>

## 2. Usability

## 3. Structure and layering

## 4. Naming and consistency

## 5. Simplicity and duplication

## 6. Modern TypeScript

## 7. Performance and resources

## 8. Security

## 9. Incidental observations

## 10. Reviewed and found sound

- <parts checked without problems>
```

## Procedure

1. Determine the scope, and the number of the new report (from the
   file names only; do not read the earlier reports).
2. Do the newcomer exercise, or start the sub-agent that does it,
   before reading anything else.
3. Run the tooling (compile, lint, test, `npm pack --dry-run`).
4. Read every file in scope in the order given, noting suspected
   problems with their file and line.
5. Write probes for every suspected defect that can be probed, and
   reproduction steps for the others; record the outcome.
6. Classify, tag, and number the findings, including those of the
   newcomer exercise.
7. Write the report to the new file.
8. Give the user a short summary: the counts, the most serious
   problems by number, and the decisions needed. Do not change the
   code unless asked.
