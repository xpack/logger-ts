## Change log

Changes in reverse chronological order.

Refer to GitHub [issues](https://github.com/xpack/cli-start-options-js/issues).

### v2.1.0 (2019-01-07)

- [#3] Add `hasLevel()`

### v2.0.0 (2018-12-30)

Incompatible changes:

- [#1] Change the logger constructor to use the generic arguments object
    
### v1.0.1 (2018-12-30)

- package.json: add more keywords
- README.md: add more types in prototypes; cosmetics

### v1.0.0 (2018-12-30)

- update for standalone usage
- tests added; coverage 100%
- documentation added in README.md
  
### (2018-12-29)

- rename CliLogger -> Logger

### v0.6.0 (2018-12-29)

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
