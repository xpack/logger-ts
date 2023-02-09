# Change log

Changes in reverse chronological order.

Refer to GitHub [issues](https://github.com/xpack/logger-ts/issues/).

## 2023-02-09

* v5.0.4 released
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
