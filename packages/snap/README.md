# Kleverchain Snap (beta)

This snap acts as a interface between the Kleverchain JS SDK and Metamask.

## Supported rpc methods:

### klv_getAddress:

Returns the address of the current account.

Returns:

```
string
```

### klv_signMessage:

Signs a message with the current account.

Params:

```json
{
  "message": "string"
}
```

Returns:

```
string
```

### klv_validateSignature:

Validates a signature.

Params:

```json
{
  "message": "string",
  "signature": "string",
  "address": "string"
}
```

Returns:

```
bool
```

### klv_buildTransaction:

Builds a Kleverchain transaction object.

Params: (for more information about the fields, check the [Kleverchain SDK JS](https://github.com/klever-io/kleverchain-js))

```json
{
  "contracts": "IContractRequest[]",
  "txData": "string[]",
  "options": "ITxOptionsRequest"
}
```

Returns:

```
ITransaction
```

### klv_signTransaction:

Signs a transaction object.

Params:

```json
{
  "transaction": "ITransaction"
}
```

Returns:

```
ITransaction
```

### klv_broadcastTransactions:

Broadcasts a set of transaction objects to the network.

Params:

```json
{
  "transactions": "ITransaction[]"
}
```

Returns:

```
IBroadcastResponse
```

## Unsupported features

These are some features that we are aware of the importance but are not supported yet:

- Multiple accounts (currently every action leads to the account on vault 0)
- Network change
