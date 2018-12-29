## Change log

Changes in reverse chronological order.

Refer to GitHub [issues](https://github.com/xpack/cli-start-options-js/issues).

## v1.0.0 (2018-12-29)

- rename CLiLogger -> Logger

## v0.6.0 (2018-12-29)

Copied from cli-start-options-js.git

```sh
git clone https://github.com/xpack/cli-start-options-js.git logger-js.git
cd logger-js.git
git remote remove origin
git ls-files
# remove the unwanted 'test' folder, recursively
git filter-branch -f --prune-empty --index-filter "git rm --cached --ignore-unmatch -r test"
# remove all other unwanted files
git filter-branch -f --prune-empty --index-filter "git rm --cached --ignore-unmatch lib/cli-application.js lib/cli-command.js lib/cli-error.js lib/cli-help.js lib/cli-options.js"
# ... and so on, until only cli-logger.js remained
# remove all tags
git tag | xargs git tag -d
```
