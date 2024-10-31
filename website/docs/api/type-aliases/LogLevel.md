# Type Alias: LogLevel

> **LogLevel**: `"silent"` \| `"error"` \| `"warn"` \| `"info"` \| `"verbose"` \| `"debug"` \| `"trace"` \| `"all"`

Type of the strings recognised as valid level names.

Internally these strings are converted into integer values,
and these numbers are used in comparisons.

Higher values mean more verbosity.

## Defined in

[logger.ts:59](https://github.com/xpack/logger-ts/blob/36710e82aebcbf11da34c40c8eb2fc19625709a0/src/lib/logger.ts#L59)
