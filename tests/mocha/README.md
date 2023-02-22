# mocha

This folder includes an example of a mocha test using `expect()`.

## Prerequisites

To install the prerequisites as development dependencies:

```sh
npm install --save-dep mocha @types/mocha chai @types/chai c8 ts-node typescript
```

## Configuration

To configure mocha to use the ES modules, add a property to `package.json`:

```json
  "mocha": {
    "require": "ts-node/register",
    "loader": "ts-node/esm"
  },
```

## Test

Tests can be started using scripts:

```json
    "mocha": "mocha tests/mocha/*.ts",
    "mocha-c8": "c8 mocha tests/mocha/*.ts",
```

## Conclusion

`mocha` is a solid testing framework, and, when paired with `chai`
provides a wide range of primitives.

However, `tap` seems easier to use, the reporter seems more versatile
by being very terse when showing summaries to being very verbose
when showing each individual test.

## Links

- <https://mochajs.org>
- <https://www.chaijs.com>
- <https://github.com/bcoe/c8>
- <https://www.npmjs.com/package/ts-node>
