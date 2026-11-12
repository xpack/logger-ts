# Consistency check

Date: 2026-11-12 02:58, on branch `development`, commit `ee7bb5d`.

Scope: the whole project, excluding `node_modules/`, `dist/` (checked
only for being current), `.git/`, `.tap/`, `coverage/`, `*.tgz` files,
and the `node_modules/` and `build/` folders under `website/`.

Summary: 18 problems (0 open, 18 fixed, 0 withdrawn): 7 in functional
consistency, 9 in documentation, and 2 in names. The template of
`@xpack/npm-packages-helper` was fixed for #2 and #3 (`70e88fc`,
`65de686`, and `f514960`), but still lacks the `pretest-ci` script of #1
and has the old `@types/node` of #4; the template of
`docusaurus-template-liquid` was changed for #7.

## 1. Functional consistency

- **#1 — The CI workflow does not lint or type-check.** [internal]
  (fixed)
  `.github/workflows/test-ci.yml` runs `npm run test-ci`, which is
  `tap run --reporter=terse` (`package.json` line 103) and has no
  `pretest-ci` hook. `tap` loads the TypeScript files with its
  `@tapjs/typescript` plugin, whose `typecheck` option defaults to
  false, so CI does not run `npm run lint`, `npm run compile`, or
  `npm run compile-tests`; only `tests/tap/180-types.ts` compiles the
  two fixtures in `tests/types/`. A type error in `src/` or `tests/`,
  or a lint error, passes CI on all platforms. Expected: a
  `pretest-ci` hook (for example `npm run lint && npm run compile-tests`),
  or the CI step running `npm test`. The workflow and the scripts are
  generated; fix the templates in `@xpack/npm-packages-helper`
  (`templates/common/.github/workflows/_xpack/test-ci-liquid.yml` and
  `templates/common/_xpack/package-merge-liquid.json`).
  Fixed in `6e30834`: added the `pretest-ci` hook to `package.json`;
  the template of `@xpack/npm-packages-helper` still needs the same
  change, otherwise the next `generate-top-commons` run removes it.

- **#2 — Unused development dependencies.** [internal] (fixed) In
  `package.json`, `ts-node` (line 72) is imported by nothing: `tap`
  uses its own fork (`@isaacs/ts-node-temp-fork-for-pr-2009`), and the
  only reference is the stale `.vscode/launch.json` (#12). `json`
  (line 69) is used by no script and no file. `glob` and `liquidjs` are
  used only by the maintenance scripts of #3, which this project does
  not use. Conversely, `$dependenciesUrls` lists `ts-node` and `json`
  but omits `@xpack/mock-console`, the one development dependency that
  the tests import. They come from
  `templates/common/_xpack/package-merge-liquid.json` (lines 140-161);
  the template should add them only for the projects that need them.
  Fixed in `0e5eeb2`: removed `ts-node` and `json`, and added
  `@xpack/mock-console` to `$dependenciesUrls`. `glob` and `liquidjs`
  were left in place, since the maintenance scripts of #3 import them;
  decide them with #3. The template needs the same change, otherwise
  the next `generate-top-commons` run adds them again.

- **#3 — Maintenance files for other kinds of projects.** [internal]
  (fixed)
  `maintenance/config/.clang-format`, `maintenance/config/.cmake-format.py`,
  `maintenance/scripts/clang-format.mjs`, `cmake-format.mjs`,
  `jsonc-format.mjs`, and `xcdl-export.mjs` serve C/C++, CMake, and
  XCDL projects; no script of `package.json` refers to them. Two of
  them cannot run: `jsonc-format.mjs` imports `jsonc-parser` (line 17)
  and `xcdl-export.mjs` imports `json5` (line 21), and neither package
  is installed. The scripts are generated from
  `templates/common/maintenance/scripts/`; the template should not
  generate them for a TypeScript library (the two configuration files
  have no generated header, so check where they come from).
  Fixed in `004f097` and `b255956`: removed the files, and the `glob`
  and `liquidjs` development dependencies that only they used. The
  cause was in the generator: the skip lists of
  `maintenance/scripts/generate-top-commons.mjs` in
  `@xpack/npm-packages-helper` lacked the `maintenance/` prefix, so
  nothing was skipped; fixed there in `f514960`. The template
  `package-merge-liquid.json` still lists `glob` and `liquidjs`, which
  a regeneration adds again.

- **#4 — `@types/node` is newer than the minimum Node.js version.**
  [internal] (fixed) `package.json` line 66 requires `@types/node` `^26.6.6`,
  while `engines.node` is `>=22.12` and the compiler base is
  `@tsconfig/node22`. The type declarations accept Node.js APIs added
  after 22.12, so the compiler does not reject a call that fails on
  the minimum version (the comment in `src/lib/logger.ts` lines
  1376-1379 shows that this constraint matters). Expected: `^22.12`,
  matching `engines`, unless the newer version is deliberate; please
  confirm.
  Fixed in `d35f410`: `@types/node` is `^22.12.0`. With these types
  the `Console` imported from `node:console` is not a type (the module
  uses `export =`, and `Console` is a global interface), so the import
  was removed and the global `Console` is used; the user guide was
  corrected about what the compiler reports without `@types/node`. The
  template `package-merge-liquid.json` of `@xpack/npm-packages-helper` still
  has `^26.6.6`, which a regeneration restores.

- **#5 — `npm-link-deps` links the package to itself.** [internal]
  (fixed)
  `package.json` line 95: `"npm-link-deps": "npm link @xpack/logger"`
  links `@xpack/logger` into its own `node_modules/`. The package has
  no runtime dependency to link; the script appears to be a copy from a
  project that depends on the logger. Expected: remove it (it is not in
  the template).
  Fixed in `4dfc3f3`, differently from the proposal: the script was
  renamed `npm-link-dependencies` and links `@xpack/mock-console`, the
  development dependency, instead of being removed.

- **#6 — The API sidebar of the website lists 2 of the 8 exported
  names.** [internal] (fixed) `website/typedoc-sidebar.json` lists only
  `Logger` and `LogLevel`, while `src/lib/logger.ts` also exports
  `LoggerConsole`, `NumericLogLevel`, `LoggerFunction`,
  `LoggerBufferRecord`, `LoggerParams`, and `LoggerArguments`.
  `website/docs/user/_project/_content.mdx` refers to several of them
  (for example `LoggerConsole`, line 90, and the `write()` example,
  which uses `NumericLogLevel` and `LoggerFunction`), so the reference
  pages must exist. Expected: regenerate the API reference and the
  sidebar with typedoc.
  Fixed in `88849e3`, differently from the proposal: the website now
  generates the API reference with api-extractor and tsdoc2docusaurus,
  not typedoc, and the new sidebar (`website/sidebar-category-tsdoc.json`)
  has all the exported names. The old `website/typedoc-sidebar.json` is
  no longer used by anything, but is still tracked in git.

- **#7 — The website says that CommonJS compatibility is required.**
  [internal] (fixed) `website/docs/getting-started/_project/_overview.mdx`
  lines 1 and 10 include `_common/_commonjs-compatibility.mdx`, which
  says "Compatibility with legacy CommonJS is required until VS Code
  extensions will be updated to import ES6 modules". Version 7 is an
  ES module only package, without the CommonJS build, as the
  compatibility notices of the same page explain; the note contradicts
  them. Expected: remove the import and the component from
  `_overview.mdx` (a project file), or make the template
  (`docusaurus-template-liquid`, `_commonjs-compatibility-liquid.mdx`)
  conditional on the packaging.
  Fixed in `88849e3`, with the second option: the wording of the
  template `_commonjs-compatibility-liquid.mdx` was changed in
  `docusaurus-template-liquid` (to state that the package is an ES module
  only, loadable with `require()` or `import()`), and the website was
  regenerated; `_overview.mdx` still includes the note, with the new
  text. The change of the template was not yet committed when this was
  checked.

## 2. Documentation

- **#8 — `CLAUDE.md` gives the wrong scope of the lint.** [internal]
  (fixed)
  `CLAUDE.md` line 18 says that `npm run lint` runs ESLint "on `src`",
  and line 23 that `npm run fix` runs it "on `src`"; both scripts lint
  `src tests` (`package.json` lines 91 and 87). Expected: "on `src` and
  `tests`".
  Fixed in `12070fb`: both lines now say "on `src` and `tests`".

- **#9 — The declarations pass is described as missing from the
  template.** [internal] (fixed) `CLAUDE.md` (under "Logger model", the build in
  two passes) says "The second configuration and the changed script are
  not in the template yet", and `tsconfig-declarations.json` lines 11-12
  carry a `TODO` to add them. The template now has both:
  `templates/common/_xpack/tsconfig-declarations-liquid.json` and the
  `compile` script in `package-merge-liquid.json` (line 29). Expected:
  remove the sentence from `CLAUDE.md` and the `TODO` from the template
  (the copy in the repository is generated).
  Fixed in `f09c66a`: removed the sentence from `CLAUDE.md` and
  regenerated `tsconfig-declarations.json`; the `TODO` was removed from
  the template in `3b560ea` (`@xpack/npm-packages-helper`).

- **#10 — `src/README.md` is stale.** [internal] (fixed) Line 19 lists a
  `src/package.json` that does not exist. Line 32 calls the methods
  "level methods" (see #17). The overview omits the members and types
  added in v7 (`levelNames`, `isLogLevel()`, `recommendedLevel`, the
  `timestamp` option and accessor, `LoggerParams`, `LoggerArguments`,
  and the deprecated protected members with `write()` as the extension
  point). The "Main README" link (line 76) is described as "project
  overview and usage", but `README.md` has no usage; it refers to the
  website. Expected: update the folder tree, the components, and the
  link description.
  Fixed in `756a299`: the folder tree, the description of `Logger`
  (the v7 members, the constructor options, and `write()`), the list
  of types, and the link description were updated; the "level methods"
  wording had already been fixed in `f579201` (#17).

- **#11 — `tests/tap/README.md` describes another configuration.**
  [internal] (fixed) The file describes installing `node-tap`, `c8`, and
  `ts-node`; a `tap` property in `package.json` ("To configure mocha");
  the `--loader=ts-node/esm` argument; `tap --dump-config`; scripts
  that do not exist (`test-100`, `test-tap-coverage-100-c8`, and
  others); and the known issue that coverage needs `c8`. The project
  uses `tap` 21 with `.taprc`, its built-in TypeScript plugin and
  coverage, and the scripts `test`, `test-coverage`, `test-no-coverage`,
  and `test-one`; `tap config list` replaces `--dump-config`. Expected:
  rewrite it from `package.json` and `.taprc`, or remove it.
  Fixed in `dcb65af`: rewritten from `package.json` and `.taprc`.

- **#12 — `.vscode/launch.json` and `.vscode/README.md` are stale.**
  [internal] (fixed) `launch.json` line 11 starts `${workspaceRoot}/index.ts`,
  which does not exist; lines 23-24 start
  `tests/tap/010-mock-console.ts`, which does not exist; all the test
  configurations use `--loader=ts-node/esm` (line 32 and others), and
  they cover only the tests up to `050`. `.vscode/README.md` has the
  typo "setings.json" (line 6) and says that the settings follow
  "JavaScript Standard Style" (line 9); the project uses Prettier and
  ESLint. Expected: update or remove the obsolete configurations and
  fix the README.
  Fixed in `ecdbe4b`: the configurations that could not work were
  removed (`index.ts`, `010-mock-console.ts`, the legacy debug port,
  and the `ts-node` loader); the remaining ones, and a new one for the
  current file, run the `test-one` script in the integrated terminal
  of the debugger. The README was corrected. The configurations were
  not tried in VS Code.

- **#13 — The developer page shows obsolete test output.** [internal]
  (fixed)
  `website/docs/developer/_project/_test-results.mdx` shows
  `npm run test-100-c8`, the hook `pretest-100-c8`, the lint command
  `ts-standard src && standard esm`, and `npm run tap
  tests/tap/010-xxx.ts`. None of these scripts or tools exist. Expected:
  the output of `npm test` (lint, `tap --show-full-coverage`, the
  coverage table) and `npm run test-one -- tests/tap/040-is-level.ts`.
  Fixed in `6fff5b5`. The website was not built, so the rendering of
  the page was not checked.

- **#14 — The maintainer page lists obsolete dependencies.** [internal]
  (fixed)
  `website/docs/maintainer/_project/_dependencies-details.mdx` lists
  `@types/tap`, `standard`, `ts-standard`, and `typedoc`, which are not
  development dependencies of the package, and omits `eslint`,
  `@eslint/js`, `typescript-eslint`, `eslint-config-prettier`,
  `prettier`, `@tsconfig/node22`, and `glob`. Expected: the list of
  `devDependencies` in `package.json` (after #2).
  Fixed in `df5b0bf`: the list is the `devDependencies` of
  `package.json` (`glob` is no longer one, after #3), and a note says
  that the website has its own dependencies, including `typedoc`;
  the note was wrong, since the website uses api-extractor and
  tsdoc2docusaurus, and was corrected in `539b929`.

- **#15 — The FAQ page contains a placeholder.** [internal] (fixed)
  `website/docs/faq/_project/_content.mdx` lines 4-7 contain a
  `<details>` block with the German placeholder "Warum? Darum!". It is
  published on the FAQ page. Expected: real questions, or an empty
  project section.
  GitHub issue #66.
  Fixed in `cf6f5b7` (GitHub issue #66): the placeholder was replaced
  by ten questions, with answers and links to the User's Guide; the
  website build, which rejects broken links and anchors, succeeds.

- **#16 — The user guide suggests a subclass to add a timestamp.**
  [internal] (fixed) `website/docs/user/_project/_content.mdx` line 469 says "A
  class can be derived from `Logger`, for example to add a timestamp";
  since v7 the `timestamp` option of the constructor does this, as the
  same page explains (line 301). Expected: another example (to redirect
  the messages, or to count them), or a reference to the option.
  Fixed in `65cf3e9`: the examples are redirecting, counting, and
  formatting the messages, with a reference to the `timestamp` option;
  the website build, which rejects broken links and anchors, succeeds.

## 3. Names

- **#17 — Two names for the same methods.** [internal] (fixed)
  `CLAUDE.md`
  ("Vocabulary") fixes the term **logging methods**, which the
  `@category Logging Methods` tags use, but the TSDoc of `Logger` and
  the user guide call them "output methods"
  (`src/lib/logger.ts` lines 201, 219, 302, 1183, 1218, and 1295;
  `website/docs/user/_project/_content.mdx` lines 88, 413, and 503),
  and `src/README.md` line 32 calls them "level methods". "Output
  methods" is also ambiguous next to the `output()` method. The same
  vocabulary rules out "log line", which `src/lib/logger.ts` line 335
  and the user guide line 373 use ("forge log lines"); there it means a
  line of the output, so it may be deliberate. Expected: one term
  everywhere; please confirm which.
  Fixed in `f579201`: "logging methods" is used everywhere (the TSDoc,
  the user guide, `src/README.md`, the design-review skill, and the
  tests, with `tests/tap/110-output-methods.ts` renamed to
  `110-logging-methods.ts`), and "forge log lines" became "forge
  messages". The anchor of the user guide heading changed from
  `#output-methods` to `#logging-methods`; no link to it was found.

- **#18 — Stray files.** [internal] (fixed)
  `maintenance/config/tsconfig-original.json` is the default file of
  `tsc --init` (`"module": "commonjs"`, `"target": "es2016"`); nothing
  refers to it, and it contradicts the ES module only configuration.
  `tests/mocks/.gitkeep` keeps an empty folder that no file uses.
  Expected: remove both. `tests/samples/sample.ts` is also not run (it
  is excluded by `.taprc`) and is referred to only by `CLAUDE.md`, as
  an example of what `.taprc` excludes; it is type-checked and linted,
  so it may be deliberate; please confirm its purpose.
  Partly fixed in `004f097`: `tsconfig-original.json` was removed (the
  generator skips it since `f514960` in `@xpack/npm-packages-helper`).
  Fixed in `0b9c43b`: `tests/mocks/.gitkeep` was removed.
  `tests/samples/sample.ts` was kept, as a small manual sample that is
  type-checked and linted.

## 4. Verified as consistent

- Entry points: `"type": "module"`, `main`, `typings`, and the `exports`
  map point to `dist/index.js` and `dist/index.d.ts`, which exist after
  `npm run compile`; there is no CommonJS entry point; `./package.json`
  is exported; `src/index.ts` re-exports `./lib/logger.js`.
- Build: `tsconfig.json` (`src` to `dist`), `tsconfig-declarations.json`
  (declarations only, with the comments), `tsconfig-common.json`
  (`@tsconfig/node22`, strict options as stated in `CLAUDE.md`), and
  `tsconfig-tests.json` (no emit, `src` and `tests`) agree; `clean`
  removes `dist`, `build`, and `.tap`.
- `dist/` is current: `npm run compile` leaves `git status` clean.
- `npm run lint` passes with no warnings.
- `npm test` passes: 21 test files, 1204 assertions, 100% statements,
  branches, functions, and lines; lint runs once.
- Test files: lower-case, dashed names with unique, ordered prefixes
  from `020` to `220`; `.taprc` includes only `tests/tap/**/*.ts`.
- Dependencies: no runtime dependencies; `src/` imports only
  `node:console` and `node:util`; the tests import
  `@xpack/mock-console`, which is a development dependency;
  `npm ls --depth=0` shows no missing or invalid packages
  (`@xpack/npm-packages-helper` is linked, as `npm-link-helpers`
  intends).
- Packaging: `npm pack --dry-run` lists 13 files (`LICENSE`,
  `README.md`, `package.json`, `dist/`, `src/index.ts`, and
  `src/lib/logger.ts`); `src/README.md`, the tests, the website, and
  the maintenance files are excluded; `files` and `.npmignore` agree.
- Workflows: the Node.js versions 22, 24, and 26 satisfy `engines`;
  they match `top-templates.json`.
- `README.md`: the badges, the description (same as `package.json`),
  and the tag (now v7.0.0, the release in preparation, since the
  generated file uses the version of `package.json` without `-pre`) are
  consistent with the generator.
- `CHANGELOG.md`: dates in reverse order; all hashes exist; the commits
  after 2026-11-11 are missing by design (it is updated at release
  time, as the `github-commit` skill says).
- `package.json` metadata: `repository`, `bugs`, and `homepage` point
  to `xpack/logger-ts`; the package name, the repository name, the
  descriptive name (`xPack Logger`), and the README title agree.
- The website user guide and the compatibility notices match the code
  for the v7 changes (`recommendedLevel`, `levelNames`, `isLogLevel()`,
  `timestamp`, `LoggerConsole`, Node.js 22.12, `node10`); the home page
  and the README refer to v7.0.0, the release in preparation (the
  released version on npm is still 6.0.0).
- The instruction files and the skills refer only to files, folders,
  and scripts that exist; `.claude/skills` is a link to
  `.github/skills`.
- The TSDoc examples in `src/lib/logger.ts` use the current API.

## 5. Proposed next steps

- Templates: add `pretest-ci` (#1) and `@types/node` `^22.12.0` (#4) to
  `@xpack/npm-packages-helper`;
  commit the wording of the CommonJS note (#7) in
  `docusaurus-template-liquid`; add `allow-git` and `allowScripts` for
  npm 12 to the website template.
- Remove the unused `website/typedoc-sidebar.json` (#6).
