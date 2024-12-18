# Interface: LoggerBufferRecord

**`Internal`**

Type of a record stored in the internal buffer.

## Remarks

If the logger was constructed without a log level, all initial
messages are stored in a buffer, and processed at a later time,
when the log level is set.

Each record in the buffer stores the message, the log level and
a function to process the message.

## Properties

### message

> **message**: `string`

The string message to be logged.

#### Defined in

[logger.ts:99](https://github.com/xpack/logger-ts/blob/3a91b7e1ef8c2616c50e125745638b32cf08a81e/src/lib/logger.ts#L99)

***

### numericLevel

> **numericLevel**: `number`

The numeric log level at the time of the call.

#### Defined in

[logger.ts:101](https://github.com/xpack/logger-ts/blob/3a91b7e1ef8c2616c50e125745638b32cf08a81e/src/lib/logger.ts#L101)

***

### func

> **func**: [`LoggerFunction`](../type-aliases/LoggerFunction.md)

The function to be called to log the message.

#### Defined in

[logger.ts:103](https://github.com/xpack/logger-ts/blob/3a91b7e1ef8c2616c50e125745638b32cf08a81e/src/lib/logger.ts#L103)
