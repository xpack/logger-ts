# Type Alias: LogLevel

> **LogLevel**: `"silent"` \| `"error"` \| `"warn"` \| `"info"` \| `"verbose"` \| `"debug"` \| `"trace"` \| `"all"`

Type of the strings recognised as valid level names.

Internally these strings are converted into integer values,
and these numbers are used in comparisons.

Higher values mean more verbosity.

## Defined in

[logger.ts:59](https://github.com/xpack/logger-ts/blob/2846243d6dac2448aa7de3003e2e9e9b7885e439/src/lib/logger.ts#L59)
