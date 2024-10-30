# Change log

Changes in reverse chronological order.

Refer to GitHub [issues](https://github.com/xpack/logger-ts/issues).

## 2024-10-30

* v6.0.0 prepared
* af09113 package.json update
* 4286082 logger.ts: update typedoc metadata
* 438b133 re-generate workflows
* 2846243 website: blog updates
* 75f2cbf website: docs updates

## 2024-10-28

* 37fbaf1 website: move some code to templates

## 2024-10-27

* 3c12ae6 website: add preliminary posts
* b36b3c9 website: update docs
* 8f514fe test-ci.yml: exclude website

## 2024-10-25

* 6c3e027 website update
* 3a91b7e logger.ts: typedoc cosmetics
* 756854a website: typedoc updated
* 62f0bf2 logger.ts: add @category at the end
* d5efddb website: update content, empty pages
* a154c77 tests: comment out assert
* a08c85e logger.ts: update TypeDoc for new specs

## 2024-10-20

* 28427b6 create-docusaurus
* a8110b2 workflows/publish-github-pages.yml
* b3045d5 package.json: add safari script

## 2023-04-17

* 7af688f package.json: typedoc 0.24.4
* eae255f publish-*.yml: add package.json to includes

## 2023-04-16

* ae4a37d package.json: typedoc 0.24.2

## 2023-04-09

* f9e8bbf package.json: add tap-c8
* 3ec4ab4 bump typedoc 2.24.1

## 2023-04-05

* 3b4e91f update for separate mockConsole

## 2023-04-04

* ac3bf44 test-ci.yml: bump node 16

## 2023-03-18

* 99521e6 CHANGELOG update
* a956173 READMEs updates
* dece581 package.json cosmetics
* 640837d update licenses
* 133d9b9 eslint max-len
* bb82415 rename workflows

## 2023-03-09

* 43677bb logger.ts: comment why not enum for numericLevels
* 007965c logger.ts: fix console definition
* 26c75bb logger.ts: move *ConstructorParameters in place
* 03338f1 README update
* ee4ba14 READMEs updated
* ec2c43d typedoc.json: cosmetics
* feb41b8 .npmignore assets
* 4bd7511 typedoc.yml: cosmetics
* 2eb03ea nodejs.yml: test on 16 & 18
* 074e6b9 package.json: update engine & lock to node 16

## 2023-03-05

* aabf751 READMEs updates
* 35d3ab9 typedoc.json: add sort
* 93050bd logger.ts: update typedoc metadata
* c726e4d typedoc.yml: use node 14

## 2023-03-04

* 27a5ad9 README update
* 4dec353 typedoc.json: disable version
* aae8d17 cosmetics in comments
* efb4061 README updates
* 1e3685d README update
* d48d237 040-is-level.ts: add test for isLevel()
* bba65c1 logger.ts: simplify isLevel()
* 2e2c070 logger.ts: update typedoc comments
* 94d3e04 #17: add isLevel(level)
* 218d356 logger.ts: update typedoc comments
* 502fb81 logger.ts: edit typedoc description
* 118e18c rename custom.css
* 5c12ebd .vscode/settings.json: ignoreWords
* 73cb192 remove scripts
* 6bf9a41 src/package.json: add redundant name for typedoc
* 91b4d41 package.json: typedoc --verbose
* 92534be typedoc.json: explicit ./README.md
* ef4f8c1 typedoc.json: add $schema
* d9849e5 typedoc: add custom css

## 2023-03-03

* a35dd44 package.json: rework exports
* a8d0ca3 remove eslint comments
* 7aa57dd rename esm/index.js
* d5a61d9 .gitignore
* ec38cd9 typedoc.yml update to src
* b96237b READMEs updates
* 0859e35 .npmignore /.github
* 9b43461 rename dist to cjs
* cb92852 READMEs updates
* 5e4a905 .npmignore updates
* 75a1892 .gitignore updates
* 12523ca .vscode/launch.json: *.ts & --loader=ts-node/esm
* 20cd3e4 package.json: compile-watch tests
* 88999b4 index.mjs: fix path
* 842dc04 rename mockConsole
* ce9d68c mock-console.ts: reworked, derived from Console

## 2023-03-02

* a5cb6d0 update copyright notices

## 2023-03-01

* 6753634 READMEs update
* 0193ab3 package.json: remove --require=ts-node/register
* df48b0b package.json: update lint/fix to check .mjs
* 2cddcdb add src/README.md
* 677f532 package.json: commonjs & dual request/import
* 578f549 add src/index.mjs
* 7da4f59 src/tsconfig.json: module commonjs
* 4ad413e add local package.json with type module
* 046e067 README cleanup
* 66dadff README update
* 9e30318 package-lock.json update
* 4ebe151 package.json: update homepage
* 27ed9e1 package.json: update scripts
* 2998b87 tsconfig.json cleanups

## 2023-02-22

* 2e1c864 tsconfig.json: move typeRoots to common
* 4f1ebd5 nodejs.yml: ignore typedoc.json
* 7663e8a typedoc.json update
* f8155a2 typedoc.json: update for src
* 3838f7f package.json: del-cli
* 8931b77 tests/tap run with ts & esm
* 3bbec88 tests/mocha
* 0a215f2 tests/samples
* 215cee4 tests/mocks
* 949806c move TS code back to src -> dist

## 2023-02-21

* 0d2b1bd package.json update
* 8936126 nodejs.yml cosmetics
* dc631bb typedoc update
* 72d67ba .gitignore docs
* 77a015f remove docs
* ef6e787 README updates
* e0ced66 package.json update
* 62e1160 .npmignore
* 5bab2ef .gitignore
* 34f1486 tests: update paths for root sources
* 91d3add move sources to project root
* 0ad86c3 package.json: add pretest scripts
* 88b109c use async to run tests

## 2023-02-20

* 9089326 docs update
* af629b4 typedoc.json: update
* b503a59 080-undefined.ts: update for TS
* a1d4237 logger.ts: export types for tests
* 8f85c4c logger.ts: protected write()
* 9f9cc21 package.json: update scripts
* dbb68e6 tests/tap: eslint-disable-next-line
* 69aa96a mock-console.ts: TS update
* 13abb26 migrate tests to TS

## 2023-02-19

* 03f9117 logger.ts cosmetics
* 6ff7dcb docs update
* 663d6e7 logger.ts: typedoc updates
* bb582a4 typedoc.json: cosmetics
* c86f2d1 package-lock.json update
* 99bc839 README updates
* be7682a docs update
* 7deb837 README updates
* 2a0b73e docs update
* 6f488ec README updates
* 952f90d docs update
* a6eb381 README update
* f7fad86 docs update
* f9fad17 package-lock.json update
* 520f1e2 package.json: add npm-link
* 2273c81 remove README-DEVELOP
* de7dfd1 README updates
* d05bdff README update
* 20ad3b4 docs update
* 4af936d .npmignore /scripts/
* a820a8c fix-absolute-*.sh: ${1}
* 771fb77 logger.ts: update Typedoc metadata
* 62e5c3c logger.ts: rename arg message
* d344d6d logger.ts: rename LoggerConstructorParameters

## 2023-02-18

* 1de5d10 README fix typo & republish web
* 4b3e52b nodejs.yml: ignore FUNDING.yml
* 0dae0a3 Create FUNDING.yml
* 1bc21e3 typedoc.yml: update push filter
* ac2d75a add script to fix absolute symlinks
* 163cb76 make docs links relative
* b40e296 docs update
* 8e1f2f5 README update
* a20cd55 .vscode/settings.json: ignoreWords
* af1ea4c typedoc.yml: remove build, assume already done
* bc9a14b rename & edit typedoc.yml
* aa2641d Create static.yml
* 1302d04 add docs
* b5791e3 typedoc.json: .nojekyll
* 49aecc5 6.0.0
* 5496be4 logger.ts: add typedoc comments
* 7eb9d5e prepare v6.0.0
* 5070ea6 add typedoc.json
* 8232480 package.json: add theme yaf
* 9a485ac package.json: add typedoc dep
* 26c8e2e rename private members, functions and args
* bc0ff4d tsconfig.json: more restrictive rules
* ed15f73 package.json: update scripts
* 8b889f9 package.json: add c8 devDep
* 8ff5fab switch to es modules

## 2023-02-12

* v6.0.0 released
* c634e88 package.json: 5.0.5-pre
* 05ee60c migrate tests to es modules
* d563e42 package.json: update scripts
* a64e54f package.json: downgrade @types/node":"^14.18.36
* 91f0c90 package.json: add exports for es modules
* 0901c1d node16 mode resolution
* 384e860 logger.ts: use explicit 'node:*' in imports

## 2023-02-09

* 0494f2d 5.0.4
* f97bd53 prepare v5.0.4
* be7b4ff nodejs.yml: try again npm ci
* f639868 README update
* 65aad10 package-lock.json: generated with v14
* 9a45e17 package.json: rename script prepare
* dcb0923 nodejs.yml: stick to npm install, ci fails
* 6584ec7 nodejs.yml: try npm install -dd
* a3ae0eb nodejs.yml: try npm ci -dd
* fffd3d0 README update
* d057e26 .vscode/settings.json: ignoreWords
* 524c49f package.json: "@types/node": "^18.13.0"
* 8c33467 5.0.3
* ae45aab prepare v5.0.3
* 6fbcc7e nodejs.yml: tags|paths-ignore
* 27df2fb nodejs.yml: bump matrix
* 083c10e .vscode/settings.json: ignoreWords
* f46a5c7 tsconfig.json: es2020
* 1184354 logger.ts: fix standard warning
* ef8675c package.json: bump deps

## 2021-05-09

* v5.0.2 released
* fix paths in `dist`
* v5.0.1 released
* add `types` in package.json
* v5.0.0 released
* `hasLevel` was changed from method to getter
* rework exports; use undefined for initial level

## 2021-05-07

* v4.0.0 released
* prepare migration to TypeScript

## 2021-03-31

* v3.0.1 released
* update tests to use .ok(), .notOk()
* bump devDeps
* [#13] Make _write(msg) ignore undefined

## 2019-11-25

* v3.0.0 released
* [#5] Make the console in the constructor optional
* [#6] Add support for directly accessing the console
* [#7] Change the functions to check the log level to getters
* switch to GitHub Action; remove Travis & AppVeyor

## 2019-11-12

* v2.2.1 released
* split README-MAINTAINER from README
* bump deps
* CI updates to test on 8, 10, 12

## 2019-01-15

* v2.2.0 released
* [#4] Add `Logger.defaultLevel`

## 2019-01-07)

* v2.1.0 released
* [#3] Add `hasLevel()`

## 2018-12-30)

* v2.0.0 released

Incompatible changes:

* [#1] Change the logger constructor to use the generic arguments object

## 2018-12-30

* v1.0.1 released
* package.json: add more keywords
* README.md: add more types in prototypes; cosmetics

* v1.0.0 released
* update for standalone usage
* tests added; coverage 100%
* documentation added in README.md

## 2018-12-29

* v0.6.0 released
* rename CliLogger -> Logger

Copied from `cli-start-options-js.git`.

```console
$ git clone https://github.com/xpack/cli-start-options-js.git logger-ts.git
$ cd logger-ts.git
$ git remote remove origin
$ git ls-files
$ # remove the unwanted 'test' folder, recursively
$ git filter-branch -f --prune-empty --index-filter "git rm --cached --ignore-unmatch -r test"
$ # remove all other unwanted files
$ git filter-branch -f --prune-empty --index-filter "git rm --cached --ignore-unmatch lib/cli-application.js lib/cli-command.js lib/cli-error.js lib/cli-help.js lib/cli-options.js"
$ # ... and so on, until only cli-logger.js remained
$ # remove all tags
$ git tag | xargs git tag -d
```
