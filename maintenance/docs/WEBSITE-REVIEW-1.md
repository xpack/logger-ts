# Website review

Date: 2026-11-12 19:10, on branch `development`, commit `3ce4653`; local
sources of the working tree (the published site was not read).

Scope: the files of `website/` that are written by hand, which is every file
except those under `docs/api/` (the API reference, reviewed by
`WEBSITE-API-REVIEW-1.md`) and those that start with "DO NOT EDIT!"
(generated from templates), and except the generated intermediate files
(`tsdoc/`, the API sidebar and navbar files) and the images. That is 49
files: the `_project/` partials of the pages, the blog posts and the release
post template, the navigation files (`navbar-docs-items.ts`,
`sidebar-docs-custom.ts`, `docusaurus-config-redirects.ts`), `robots.txt`,
`README.md`, and the files in `config/`. The generated pages were read only
for context (the title, the imports, and the order in which the partials
render). The library design is in `DESIGN-REVIEW-1.md`.

Method: every file in scope was read in full, with the page that imports it
for context. Statements were checked against `src/lib/logger.ts`, the
declarations in `dist/`, `package.json` (`engines`, `devDependencies`,
`scripts`), `git tag` and the `package.json` of each tag, the first commits,
and the build log of a local build of the site. The TypeScript examples of
the user's guide were compiled in strict mode against `dist/`, with
`exactOptionalPropertyTypes` and `noUncheckedIndexedAccess`; they compile
(only the import of the mock console of my probe failed, a problem of the
probe). The partials that no page imports were found with `grep` over the
`import` lines. There is no earlier website review. The published site
(branch `website`) was not compared: the user named the files, not the
pages.

Summary: 36 problems (0 open, 34 fixed, 2 withdrawn). The most serious are the
statements of the user's guide that are wrong today (#1, #2) and the release
posts, which carry unfinished summaries (#6) and a wrong code sample (#7),
with a stale template that will repeat them in the next release (#8). The
`warn`, `isWarnEnabled`, and timestamp text is correct and complete. Items #1
to #4, #6 to #13, and #15 to #36 are fixed in the working tree (all but #19
staged), and not yet committed, and the build of the site passes (no broken
link or anchor).

## Note on generated files

The files with a "DO NOT EDIT!" header (most `_common/` partials, the
`index.mdx` pages, `blog/authors.yml`, `blog/tags.yml`, and
`docusaurus.config.ts`) are generated from the templates of
`@xpack/docusaurus-template-liquid` by `npm run generate-website-commons` in
`website/`, and were not reviewed. The files reviewed here have no such
header, so they are edited in place; every finding is marked **[project]**.
No finding is in a template. Problems that appear to come from the shared
xPack setup (#9, #10, #12) are marked, since the other xPack sites probably
have them too.

## 1. Defects

- **#1 — The list of the logging methods shows signatures that do not
  exist.** (fixed) [project] **[confirmed]**
  `website/docs/user/_project/_content.mdx` lines 270 to 278: the list gives
  `always (message: any = '', ...args: any[]): void` for every method, and a
  separate `error (message: Error): void`. The declarations
  (`dist/lib/logger.d.ts`, lines 1210 to 1425) have
  `always(message?: unknown, ...args: unknown[]): void`, the same shape for
  the other seven methods, and no overload of `error()` for an `Error`:
  an `Error` is just a `message: unknown`. A reader who copies the
  signatures gets `any`, which the strict settings of the project forbid.
  Replace the list with `message?: unknown, ...args: unknown[]` once ("all
  the logging methods have the signature `(message?: unknown, ...args:
  unknown[]): void`"), and delete the `error (message: Error)` line.
  Fixed in the working tree (staged, not yet committed): one sentence and one
  signature, `(message?: unknown, ...args: unknown[]): void`.

- **#2 — The cost figures of the preliminary state are stale.** (fixed)
  [project]
  `website/docs/user/_project/_content.mdx` lines 227 to 233: "about
  3 microseconds, against 0.2 microseconds" and "a message of about 70
  characters takes about 250 bytes". The probe of the API review measured
  about 401 bytes per message on Node.js v24.22.2 (4.1 and 0.34
  microseconds), and the TSDoc comment of the class was changed to "several
  hundred bytes" and "indicative". Use the same words here: "takes several
  hundred bytes", and say that the times depend on the machine and on the
  Node.js version.
  Fixed in the working tree (staged, not yet committed): "a few microseconds",
  "a fraction of a microsecond", "several hundred bytes", and a sentence that
  the values depend on the machine and on Node.js.

- **#3 — The FAQ says to use `assert()` without saying which.** (fixed)
  [project]
  `website/docs/faq/_project/_content.mdx` line 188: "use `assert()`
  instead". The logger has no such method; the TSDoc of the class, which had
  the same sentence, now says `assert()` from `node:assert`. Use the same
  text.
  Fixed in the working tree (staged, not yet committed): `assert()` from
  `node:assert`.

- **#4 — The History page dates the release 6.0.0 wrongly.** (fixed) [project]
  **[confirmed]**
  `website/docs/project/history/_project/_content.mdx` lines 17 to 21: "In
  February 2023, version 6.0.0 introduced an ES6 wrapper". The tag `v6.0.0`
  is dated 2024-10-30, and the release post is dated 2024-10-30; February
  2023 is the date of v5.0.3 and v5.0.4 (and of the pre-release tag
  `v5.0.5-pre-cjs`, 2023-02-12). Write "October 2024".
  Fixed in the working tree (staged, not yet committed): "October 2024".

- **#5 — The release posts give wrong Node.js versions.** (withdrawn) [project]
  **[confirmed]**
  Fourteen posts, from `blog/2018-12-30-logger-v1-0-0-released.mdx` to
  `blog/2023-02-09-logger-v5-0-4-released.mdx`, have `nodeVersion: "16.0.0"`
  in the front matter, which the "Prerequisites" section shows as the
  required version. The `engines` of the tags say otherwise: `>7.7.0` for
  v1.0.0 to v2.2.1, `>10.0` for v3.0.1 to v5.0.0, `>=14.13.1 || >=15.3.0 ||
  >=16.0.0` for v5.0.4, and `>=18.0.0` for v6.0.0 (whose post says 18.0.0).
  Node.js 16 did not exist in 2018. Set `nodeVersion` of each post from the
  `package.json` of its tag (`git show <tag>:package.json`), or remove the
  "Prerequisites" section from the old posts.
  Withdrawn: the maintainer decided that the value `16.0.0` of the old
  posts stays, and the posts were restored.

- **#6 — Nine release posts have an unfinished summary.** (fixed) [project]
  The first line of the posts v1.0.1, v2.2.1, v3.0.0, v3.0.1, v4.0.0, v5.0.0,
  v5.0.1, v5.0.2, and v5.0.3 ends with "; it ..." (for example "Version
  **4.0.0** is a new major release; it ..."), the placeholder of the
  template, and it is the text that the blog index shows. Write the summary
  from the commits of the release (`git log <previous tag>..<tag>`), or
  end the sentence at "major release.", as the posts v1.0.0 and v2.0.0 do.
  Fixed in the working tree (staged, not yet committed): the summaries are
  written from the commits of the release; the post v5.0.1, whose only commit
  is "prepare", ends at "maintenance release.".

- **#7 — A code sample uses `request()` instead of `require()`.** (fixed)
  [project]
  `website/blog/2024-10-30-logger-v6-0-0-released.mdx` line 62 (and line 66
  of `blog/_templates/blog-post-release-liquid.mdx`):
  `const { Logger } = request('@xpack/logger')` fails with a
  `ReferenceError`. Replace `request` with `require`.
  Fixed in the working tree (staged, not yet committed): `require()`, in the
  post and in the template.

- **#8 — The template of the release posts is stale for the next release.**
  (fixed)
  [project]
  `website/blog/_templates/blog-post-release-liquid.mdx` lines 45, 47, and
  57 to 67: "a TypeScript and dual mode CommonJS/ECMAScript Node.js module",
  `<Prerequisites nodeVersion="18.0.0"/>`, and an "Import" section that
  presents `require()` as the CommonJS form. The release 7.0.0 is an ES module
  only, with Node.js 22.12 as the minimum, so the post made from this
  template would be wrong in the first paragraph. Also line 87, "a set of
  tests were performed ." (see #32). Change the sentence to "a TypeScript
  Node.js ES module", read the Node.js version from `engines` (or from
  `_websiteConfig`, see #9), and fix the Import section.
  Fixed in the working tree (staged, not yet committed): the template says "a
  TypeScript Node.js ES module", has `nodeVersion="22.12"`, and a correct
  Import section.

- **#9 — The Node.js version of the website configuration is 18.20.4.** (fixed)
  [project] (probably shared with the other xPack sites)
  `website/package.json` line 98 (`_websiteConfig.nodeVersion`) and
  `website/config/website-templates.json` line 4: `18.20.4`, while `engines`
  of the package says `>=22.12`, and the developer and maintainer pages
  already pass `nodeVersion="22.12"`. No rendered page shows the value at
  present, but the first page that uses it will be wrong. Set both to
  `22.12`.
  Fixed in the working tree (staged, not yet committed): `22.12`, in both files.

- **#10 — The keywords of the website are those of another project.** (fixed)
  [project] (probably shared)
  `website/package.json` line 95 and `website/config/website-templates.json`
  line 3: `"xpm, xpack, build, test, dependencies, npm, reproducibility"`
  describe the `xpm` tool, not a logger. Use "xpack, logger, console, log
  level, nodejs, typescript".
  Fixed in the working tree (staged, not yet committed): "xpack, logger,
  console, log level, nodejs, typescript", in both files.

- **#11 — The README of the website describes TypeDoc, which is not
  used.** (fixed) [project]
  `website/README.md` lines 12 to 31: the section "docusaurus-plugin-typedoc"
  tells the reader to install `typedoc`, `typedoc-plugin-markdown`, and
  `docusaurus-plugin-typedoc`, and generates `docs/api`; none of these is in
  `website/package.json` or `docusaurus.config.ts` (`grep` finds no
  `typedoc`), and the API reference is generated by `api-extractor`,
  `api-documenter`, and `tsdoc2docusaurus-cli`
  (`npm run generate-website-tsdoc`). Replace the section with that
  description, and the note on categories and groups, which belongs to the
  old tool, with nothing.
  Fixed in the working tree (staged, not yet committed): the README describes
  `npm run generate-website-tsdoc`.

- **#12 — A debug statement prints every page path during the build.** (fixed)
  [project] **[confirmed]** (probably shared)
  `website/docusaurus-config-redirects.ts` line 30: `logger.info(existingPath)`
  in `createRedirects()`. The build log of a local build has 114 lines of
  the form `[INFO] /docs/api/logger/classes/logger/error/`, which hide the
  real warnings. The function creates no redirect (it returns `undefined`).
  Delete the line, or the whole `createRedirects()` while there are no
  redirects.
  Fixed in the working tree (staged, not yet committed): the statement and the
  unused import are removed; the log of a local build has no more `[INFO]`
  lines of paths.

- **#13 — The notice of v5.0.0 says that `hasLevel()` is a method.** (fixed)
  [project]
  `website/docs/getting-started/_project/_compatibility-notices.mdx` lines 161
  to 168: the notice says that `hasLevel` was changed from a method to an
  accessor, and then that "the method to check if the level was set is via
  `hasLevel()`". After the change it is `hasLevel`, without parentheses.
  Rewrite the sentence as "to check if the level was set, use the accessor
  `hasLevel`".
  Fixed in the working tree (staged, not yet committed): "to check if the
  level was set, use the accessor `hasLevel`".

## 2. Version history

- **#14 — The History page and the first commit disagree on the origin.**
  (withdrawn) [project]
  `website/docs/project/history/_project/_content.mdx` lines 4 to 7: "when it
  was extracted as a separate project from the early **xpm** version".
  Withdrawn: the maintainer confirmed that the page is right, and the text
  stays as it is.

- **#15 — The History page stops at 2023, and omits most of the versions.**
  (fixed)
  [project]
  `website/docs/project/history/_project/_content.mdx`: three entries (April
  2017, May 2021, February 2023), none for the first releases (v1.0.0
  to v2.0.0, three releases on 2018-12-30), for v3.0.0 (2019), or for the 5.x
  releases, and nothing for 7.0.0 (ES
  module only, Node.js 22.12, `timestamp`, the validation of the level),
  which is the largest change since v4.0.0. Add an entry for each major
  version, with the month, from the dates of the tags, and a link to the
  compatibility notice.
  Fixed in the working tree (staged, not yet committed): entries for December
  2018, November 2019, and May 2021 (5.0.0), and the date of 6.0.0; there is
  none for 7.0.0, which is not released.

- **#16 — The posts of the major versions have empty sections.** (fixed)
  [project]
  The posts v3.0.0, v4.0.0, v5.0.0, and v6.0.0 have "Bug fixes: none" and
  "Enhancements: none", although their summaries or the compatibility notices
  describe changes (v4.0.0 moved the code to TypeScript, v5.0.0 changed
  `hasLevel` to an accessor, v6.0.0 added the ES module support). The skill
  rule is that breaking changes are listed as "Major changes", not as
  enhancements; here they are not listed at all. Add a "Major changes"
  section to these posts, with the text of the compatibility notice of the
  version, and a link to it.
  Fixed in the working tree (staged, not yet committed): a "Major changes"
  section, with a link to the compatibility notices, in the posts v3.0.0,
  v4.0.0, v5.0.0, and v6.0.0.

## 3. Structure

### The user's guide

- **#17 — The guide gives the packaging details before the first example.**
  (fixed)
  [project]
  `website/docs/user/_project/_content.mdx` lines 4 to 53: the page starts
  with the import forms, the `Console` typing, the module resolution modes
  `node10`, `node16`, `nodenext`, and `bundler`, `package.json`, and
  `require()`, and the first use of the logger is at line 55. A reader who
  wants to log a message passes about 50 lines of module system detail.
  Proposal in #34.
  Fixed in the working tree (staged, not yet committed): see #34.

- **#18 — The sections of the guide start at level 3.** (fixed)
  [project]
  `website/docs/user/_project/_content.mdx` (all the headings, lines 70 to
  512): the page is "# How to use xPack Logger" (`docs/user/index.mdx`), and the
  partial has only `###` headings, so there is no level 2, and the table of
  contents of the page starts with level 3. Use `##` in the partial; check
  that no other page imports it (only `docs/user/index.mdx` does).
  Fixed in the working tree (staged, not yet committed): the sections are `##`.

- **#19 — Eight sections of the guide repeat the TSDoc of the class, and
  they have drifted apart.** (fixed) [project]
  `website/docs/user/_project/_content.mdx`: "Delaying setting the log level",
  "Logging methods", "Timestamps", "Empty messages", "Logging untrusted
  input", "Logging errors", "Extending the logger", and "Log level checks" say
  the same things as the description of `Logger` in the API reference, in
  other words. The copies diverge: the guide has the stale figures of #2 and
  "flushed" (see #27), the TSDoc was corrected. Choose one place for each
  topic: the guide for the explanations and the examples, with the TSDoc
  limited to the contract of the member and a link to the guide; this is a
  decision for the maintainer, since the TSDoc is also read in editors.
  Decision of the maintainer: the guide is the single source of the
  explanations. Fixed in the working tree, not yet committed: the TSDoc
  comments of the class, of `error()`, of `timestamp`, and of `hasLevel`
  keep the contract and two or three sentences, with a reference to the
  section of the guide (empty messages, logging errors, timestamps,
  untrusted input, log level checks, delaying setting the log level); the
  description of the class
  went from 10.6 kB to 8.5 kB. The new test `tests/tap/230-guide-links.ts`
  checks that every section of the guide named in the comments exists.

- **#20 — The numeric values of the levels and the level checks are not
  given.** (fixed) [project]
  `website/docs/user/_project/_content.mdx` lines 121 to 156 and 512 to 548:
  the guide says that the levels have numeric values (`Logger.numericLevels`)
  and "higher numeric values correspond to greater verbosity", but gives
  neither the values (0 to 70) nor a table of the levels with their purpose
  (the TSDoc has this paragraph now); and the section "Log level checks" names
  only `isDebugEnabled` and `isLevel()`, so the reader does not learn that
  there are seven checks, that each is true at its own level and at the higher
  ones, and that the previous names (`isError` to `isAll`) are deprecated.
  Add a table `Level | Value | Used for`, and a sentence that lists the
  seven checks.
  Fixed in the working tree (staged, not yet committed): a table of the
  levels, with the values and the purpose, and a paragraph on the seven checks
  and the deprecated names.

### The compatibility notices

- **#21 — The notice of v7.0.0 mixes breaking and non-breaking changes in
  145 lines.** (fixed) [project]
  `website/docs/getting-started/_project/_compatibility-notices.mdx` lines 4
  to 146: breaking changes (the ES module only package, Node.js 22.12, the
  constructor message, the errors, the static members, two compile-time
  changes) are interleaved with additions and deprecations (the
  `isXEnabled` names, `package.json` export, `LoggerConsole`, `timestamp`,
  the declaration files, `isSilent`). The reader who upgrades has to read
  every paragraph to find what must change. Proposal in #35.
  Fixed in the working tree (staged, not yet committed): the notice of v7.0.0
  has the parts "Breaking changes", "Deprecations", and "Additions" (see #35).

### The navigation and the files

- **#22 — The sidebar has an empty category.** (fixed) [project]
  `website/sidebar-docs-custom.ts` lines 23 to 38: "User's Guide" is a
  category with a link and `items: []` (the items are commented out), which
  shows an expansion arrow with nothing to expand. Make it a plain `doc`
  entry, like "Getting Started", until it has children (or give it the
  sections of the guide, see #36).
  Fixed in the working tree (staged, not yet committed): "User's Guide" is a
  plain `doc` entry.

- **#23 — Three partials are not imported by any page.** (fixed) [project]
  **[confirmed]**
  `website/docs/_shared/_documentation.mdx` and
  `website/docs/_shared/_release-schedule.mdx` (the pages import the
  copies in `docs/_project/`, with different wording: "solely" and
  "employs" against "exclusively" and "adheres to"), and
  `website/docs/install/_project/_troubleshooting-windows.mdx`, which holds
  only a line `// import Heading from '@theme/Heading';` and would show it
  as text if it were imported. A `grep` over the `import` lines finds no
  importer. Delete the three files (the `_shared` folder may be a template
  convention; check `npm run generate-website-commons` first).
  Fixed in the working tree (staged, not yet committed): the three files are
  deleted (`git rm`); the template package does not create them.

- **#24 — A partial has unused imports.** (fixed) [project]
  `website/docs/_project/_release-schedule.mdx` lines 1 and 2:
  `versionMajor` and `versionMinor` are imported and never used. Remove them.
  Fixed in the working tree (staged, not yet committed): the two imports are
  removed.

- **#25 — `robots.txt` exists twice.** (fixed) [project]
  `website/robots.txt` and `website/static/robots.txt` are identical (`diff`);
  only the one in `static/` is published (the site serves it: HTTP 200).
  Delete the one in the root of `website/`.
  Fixed in the working tree (staged, not yet committed): `website/robots.txt`
  is deleted.

- **#26 — The README of `config/` is incomplete.** (fixed) [project]
  `website/config/README.md` lists four files; the folder has six, and
  `patch-doc-model-json.sh` and `website-templates.json` are not described.
  `api-extractor-original.json` (454 lines, "the result of `api-extractor
  --init`") is referenced by nothing else; keep it only if it is wanted as a
  reference. Add the two files to the list.
  Fixed in the working tree (staged, not yet committed): the two files are
  described.

## 4. Consistency

| #   | Concept | Variants found (where) | Suggested |
| --- | ------- | ---------------------- | --------- |
| #27 | replay of the buffer | "flushed" (`user/_project/_content.mdx` line 262), "replayed" (the same file, line 209, and `CLAUDE.md`) | "replayed" (fixed) |
| #28 | website | "web site" (`blog/2024-10-24-web-site.mdx`, title and text, `docs/project/about/_project/_website.mdx` "The web site"), "website" (`website/`, the navigation, the other pages) | "website" (fixed) |

Items #27 and #28: fixed in the working tree (staged, not yet committed):
"replayed" in the guide, and "website" in the post and in the About page.

## 5. Language and style

- **#29 — Typo "extrated".** (fixed) [project]
  `website/docs/project/history/_project/_content.mdx` line 6: "extrated" is
  "extracted".
  Fixed in the working tree (staged, not yet committed): "extracted".

- **#30 — Typo "mjor".** (fixed) [project]
  `website/blog/2021-05-07-logger-v4-0-0-released.mdx` line 4: the
  description "a new mjor release" is "major" (the description is the text
  that search engines show).
  Fixed in the working tree (staged, not yet committed): "major".

- **#31 — Typo "Octomber".** (fixed) [project]
  `website/docs/project/about/_project/_website.mdx` line 8:
  `<Website date="Octomber 2024"/>` is "October 2024".
  Fixed in the working tree (staged, not yet committed): "October 2024".

- **#32 — Grammar and spacing in the "CI tests" section.** (fixed) [project]
  `website/blog/2024-10-30-logger-v6-0-0-released.mdx` line 83 and
  `website/blog/_templates/blog-post-release-liquid.mdx` line 87: "a set of
  tests were performed ." has a space before the full stop; and in every
  release post (the other posts, line 70) "a set of tests were performed" is
  plural: use "a set of tests was performed."
  Fixed in the working tree (staged, not yet committed): "a set of tests was
  performed.", in all the posts and in the template.

- **#33 — Colloquial sentences in the guide.** (fixed) [project]
  `website/docs/user/_project/_content.mdx` lines 67 to 68 ("the (possibly)
  long operations be performed only if necessary") and 514 to 516 ("it makes
  no sense to do it and call the logging method to simply return if the log
  level is low and the message is not needed"). Write: "When the preparation
  of a message is expensive, check the log level first, so that the work is
  done only if the message will be written." Both sentences describe the
  same guard; keep one.
  Fixed in the working tree (staged, not yet committed): both sentences are
  replaced by one, in "Log level checks", with a reference in the quick start.

## 6. Proposed restructuring

- **#34 — Put the quick start at the top of the user's guide.** (fixed) The
  first
  section, "Using the logger", takes the example of lines 55 to 65 (the
  creation of a logger with a level, and two messages, with the import line
  of lines 7 to 11); the second, "Importing the module", takes lines 13 to 53
  (the typings, `node10`, `package.json`, `require()`, and the asynchronous
  `import()`). The sections of "The console" to "Log level checks" follow as
  they are (see #36 for their order).
  Fixed in the working tree (staged, not yet committed): the sections "Using
  the logger" and "Importing the module".

- **#35 — Group the notice of v7.0.0 by kind.** (fixed) In
  `_compatibility-notices.mdx`, a first part "Breaking changes", with the
  eight paragraphs that start with "**Breaking change**", ordered by the
  likelihood that the reader is affected (the ES module only package and
  the Node.js version first, then the errors, the constructor, the static
  members, the two compile-time changes); a second part "Deprecations", with
  the `isXEnabled` names, `defaultLevel`, the protected members, `isSilent`,
  and `node10`; a third, "Additions", with `package.json`, `LoggerConsole`,
  `timestamp`, and the declaration files.
  Fixed in the working tree (staged, not yet committed): the order of the
  breaking changes is the ES module and Node.js first, then the errors, the
  constructor, the static members, and the compile-time changes.

- **#36 — Order the sections of the guide by the reader's task.** (fixed) After
  the quick start and the import (#34): "Log levels" (with the table of
  #20), "Logging methods", "The console", "Log level checks", "Logging
  errors", "Timestamps", "Empty messages", "Logging untrusted input", and,
  last, the advanced topics "Delaying setting the log level" (the
  preliminary state) and "Extending the logger", under one `##` heading.
  The FAQ links to the sections by anchor (`#delaying-setting-the-log-level`
  and others), so keep the titles, or update the FAQ.
  Fixed in the working tree (staged, not yet committed): the order is as
  proposed, with "Advanced topics" (`###` sections for the preliminary state
  and for extending); the anchors of the FAQ are unchanged.

## 7. Incidental observations outside the website

None. The statements of the guide about behaviour (the table of the logging
methods, the prefixes, the streams, the timestamp format, the empty
messages, the untrusted input, the errors) agree with the library, as the
API review confirmed with probes.

## 8. Reviewed and found correct

- `website/docs/user/_project/_content.mdx`: the table of the logging methods
  and their streams and prefixes; the `warn` level name and the prefix
  `warning: `; the timestamp format and its rules; the empty messages; the
  untrusted input; the table of the errors; the examples (all the TypeScript
  samples compile in strict mode against `dist/`, and the `UpperCaseLogger`
  override and the custom console type check); the statement that
  `node10` is deprecated, and the `require()` of the ES module on Node.js
  22.12 or later (checked by `tests/tap/160-package.ts`); the anchors used by
  the FAQ (the build fails on a broken anchor, `onBrokenAnchors: 'throw'`).
- `website/docs/faq/_project/_content.mdx`: all the answers except #3, and
  the links to the guide.
- `website/docs/getting-started/_project/_compatibility-notices.mdx`: the
  breaking changes of v7.0.0 and their replacements (the names
  `isErrorEnabled` and the others, `Logger.recommendedLevel`, `RangeError`
  and `TypeError`), the deprecation of `isSilent`, and the notices of v2.0.0
  to v6.0.0, apart from #13.
- `website/docs/developer/_project/` (the test results sample matches the
  scripts `pretest`, `pretest-coverage`, `test-coverage`, and `test-one`, and
  the 100% coverage of `npm test`), `website/docs/maintainer/_project/
  _dependencies-details.mdx` (the eleven `devDependencies` of `package.json`,
  and no runtime dependencies), `website/docs/getting-started/_project/
  _overview.mdx`, `_status.mdx`, and the empty partials `_more-credits.mdx`,
  `_more-licenses.mdx`, `_more.mdx`, and `_more-intro.mdx`.
- The release posts: the dates and the versions agree with the git tags
  (v1.0.0 to v6.0.0; the pre-release tag `v5.0.5-pre-cjs` has no post, which
  is right for a pre-release); `blog/2024-10-24-web-site.mdx`.
- `website/navbar-docs-items.ts` and `website/sidebar-docs-custom.ts`: every
  entry points to an existing page, and the labels match the page titles
  (apart from #22); `website/config/tsdoc2docusaurus.json`,
  `api-extractor.json`, `tsconfig-api-extractor.json`, and
  `patch-doc-model-json.sh` agree with the scripts of `website/package.json`.
