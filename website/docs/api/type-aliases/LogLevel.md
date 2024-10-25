# Type Alias: LogLevel

> **LogLevel**: `"silent"` \| `"error"` \| `"warn"` \| `"info"` \| `"verbose"` \| `"debug"` \| `"trace"` \| `"all"`

Type of the strings recognised as valid level names.

## Remarks

Internally these strings are converted into integer values,
and these numbers are used in comparisons.

Higher values mean more verbosity.

## Defined in

[logger.ts:60](https://github.com/xpack/logger-ts/blob/62f0bf298555a020ff5b41904da48c7de7b9f72e/src/lib/logger.ts#L60)
