[![npm (scoped)](https://img.shields.io/npm/v/@xpack/logger.svg)](https://www.npmjs.com/package/@xpack/logger)
[![license](https://img.shields.io/github/license/xpack/logger-ts.svg)](https://github.com/xpack/logger-ts/blob/xpack/LICENSE)
[![TS-Standard - Typescript Standard Style Guide](https://badgen.net/badge/code%20style/ts-standard/blue?icon=typescript)](https://github.com/standard/ts-standard)
[![Actions Status](https://github.com/xpack/logger-ts/workflows/CI%20on%20Push/badge.svg)](https://github.com/xpack/logger-ts/actions)
[![GitHub issues](https://img.shields.io/github/issues/xpack/logger-ts.svg)](https://github.com/xpack/logger-ts/issues/)
[![GitHub pulls](https://img.shields.io/github/issues-pr/xpack/logger-ts.svg)](https://github.com/xpack/logger-ts/pulls)

# Maintainer info

This page complements the developer page and documents the
maintenance procedures related to making releases for the
`@xpack/logger` module.

## Use older node

To ensure compatibility with older node, revert to an older one:

```sh
nvm use --lts 14
code
```

## Prepare the release

Before making the release, perform some checks and tweaks.

### Update npm packages

- `npm outdated`
- `npm update` or edit and `npm install`
- repeat and possibly manually edit `package.json` until everything is
  up to date

Keep:

- `@types/node` locked to the
  [latest node.js LTS](https://nodejs.org/en/) available for
  [TypeScript](https://www.npmjs.com/package/@types/node)

### Check Git

In this Git repo:

- in the `develop` branch
- push everything
- if needed, merge the `master` branch

### Determine the next version

Use the semantic versioning semantics.

### Fix possible open issues

Check GitHub issues and pull requests:

- <https://github.com/xpack/logger-ts/issues/>

### Update Release Notes in `README.md`

- add a new entry in the Release Notes section
- check the rest of the file and update if needed, to reflect the new features
- update version in `README-MAINTAINER.md`

## Update `CHANGELOG.md`

- check the latest commits `npm run git-log`
- open the `CHANGELOG.md` file
- check if all previous fixed issues are in
- add a line _* v6.0.0 released_
- commit with a message like _prepare v6.0.0_

## Publish to npmjs.com

- terminate all running tasks (**Terminal** → **Terminate Task...**)
- select the `develop` branch
- commit everything
- `npm run fix`
- in the develop branch, commit all changes
- `npm run test`
- `npm run pack`; check the list of packaged files, possibly
  update `.npmignore`
- `npm version patch` (bug fixes), `npm version minor` (compatible API
  additions), `npm version major` (incompatible API changes)
- push all changes to GitHub; this should trigger CI
- **wait for CI tests to complete**
- check <https://github.com/xpack/logger-ts/actions/>
- `npm publish --tag next` (use `--access public` when publishing for the first time)

Check if the version is present at
[@xpack/logger Versions](https://www.npmjs.com/package/@xpack/logger?activeTab=versions).

### Test

Test it with:

```bash
npm install -global @xpack/logger@next
```

### Change tag to latest

When stable:

- `npm dist-tag ls @xpack/logger`
- `npm dist-tag add @xpack/logger@6.0.0 latest`
- `npm dist-tag ls @xpack/logger`

### Merge into `master`

In this Git repo:

- select the `master` branch
- merge `develop`
- push all branches
