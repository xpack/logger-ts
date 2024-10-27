# Type Alias: LogLevel

> **LogLevel**: `"silent"` \| `"error"` \| `"warn"` \| `"info"` \| `"verbose"` \| `"debug"` \| `"trace"` \| `"all"`

Type of the strings recognised as valid level names.

## Remarks

Internally these strings are converted into integer values,
and these numbers are used in comparisons.

Higher values mean more verbosity.

## Defined in

[logger.ts:60](https://github.com/xpack/logger-ts/blob/3c12ae665e2c169fd25e7a3e7a562063efb9889a/src/lib/logger.ts#L60)
