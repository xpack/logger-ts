# tap

This folder contains the unit tests of the library, which use
[`tap`](https://node-tap.org).

The tests are written in TypeScript and run directly by `tap`, with its
built-in TypeScript support; they are not compiled separately. They import
the library from the sources (`src/index.js`), and use
`@xpack/mock-console` to capture the output of the logger.

## Configuration

The configuration is in `.taprc`, in the root of the project. Its `include`
option restricts `tap` to the files in `tests/tap/`; without it, `tap`
would also run the other TypeScript files under `tests/`, such as
`tests/samples/sample.ts`.

`tap` does not check the types of the tests by default. The type check is
done by the `compile-tests` script, with
`maintenance/config/tsconfig-tests.json`, which is also what ESLint uses
for the tests. The files in `tests/types/` are fixtures for the type
checks, compiled by `180-types.ts`; they are not run.

To see the effective configuration of `tap`:

```sh
npm run test-tap-config-list
```

## Test files

The names of the test files are a number, in steps of 10, followed by
a short description, like `040-is-level.ts`. The numbers are unique and
give the order of the files.

## Running the tests

The tests are started with the scripts of `package.json`:

- `npm test`: compile the sources, type-check the tests, run the lint, and
  run the tests with the coverage, which must be 100% for statements,
  branches, functions, and lines;
- `npm run test-no-coverage`: run the lint and the tests, without the
  coverage and without compiling;
- `npm run test-one -- tests/tap/040-is-level.ts`: run one or more
  given test files, with the TAP reporter;
- `npm run test-ci`: the tests with a terse reporter, as run by the
  continuous integration workflow, after compiling, type-checking, and
  linting (the `pretest-ci` script);
- `npm run test-all`: all the tests, with the TAP reporter and without the
  coverage.

## Links

- <https://node-tap.org>
- <https://www.npmjs.com/package/@xpack/mock-console>
