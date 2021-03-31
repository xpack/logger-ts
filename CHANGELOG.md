# Change log

Changes in reverse chronological order.

Refer to GitHub [issues](https://github.com/xpack/logger-js/issues/).

## 2019-11-25

- v3.0.0 released
- [#5] Make the console in the constructor optional
- [#6] Add support for directly accessing the console
- [#7] Change the functions to check the log level to getters
- switch to GitHub Action; remove Travis & AppVeyor

## 2019-11-12

- v2.2.1 released
- split README-MAINTAINER from README
- bump deps
- CI updates to test on 8, 10, 12

## 2019-01-15

- v2.2.0 released
- [#4] Add `Logger.defaultLevel`
  
## 2019-01-07)

- v2.1.0 released
- [#3] Add `hasLevel()`

## 2018-12-30)

- v2.0.0 released

Incompatible changes:

- [#1] Change the logger constructor to use the generic arguments object

## 2018-12-30

- v1.0.1 released
- package.json: add more keywords
- README.md: add more types in prototypes; cosmetics

- v1.0.0 released
- update for standalone usage
- tests added; coverage 100%
- documentation added in README.md
  
## 2018-12-29

- v0.6.0 released
- rename CliLogger -> Logger

Copied from `cli-start-options-js.git`.

```console
$ git clone https://github.com/xpack/cli-start-options-js.git logger-js.git
$ cd logger-js.git
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
