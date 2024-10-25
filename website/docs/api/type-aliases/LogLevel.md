# Type Alias: LogLevel

> **LogLevel**: `"silent"` \| `"error"` \| `"warn"` \| `"info"` \| `"verbose"` \| `"debug"` \| `"trace"` \| `"all"`

Type of the strings recognised as valid level names.

## Remarks

Internally these strings are converted into integer values,
and these numbers are used in comparisons.

Higher values mean more verbosity.

## Defined in

[logger.ts:60](https://github.com/xpack/logger-ts/blob/3a91b7e1ef8c2616c50e125745638b32cf08a81e/src/lib/logger.ts#L60)
