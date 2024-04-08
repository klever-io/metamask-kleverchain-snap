/**
 * Check if a snap ID is a local snap ID.
 *
 * @param snapId - The snap ID.
 * @returns True if it's a local Snap, or false otherwise.
 */
import type { RpcMethodTypes } from 'snap/src/rpc-types';

import { defaultSnapOrigin } from '../config';

export const isLocalSnap = (snapId: string) => snapId.startsWith('local:');

// eslint-disable-next-line @typescript-eslint/naming-convention
type SnapRpcRequestParams<M extends keyof RpcMethodTypes> =
  RpcMethodTypes[M]['input'] extends undefined
    ? { snapRpcMethod: M }
    : { snapRpcMethod: M; params: RpcMethodTypes[M]['input'] };

// eslint-disable-next-line @typescript-eslint/naming-convention
const snapRpcRequest = async <M extends keyof RpcMethodTypes>(
  args: SnapRpcRequestParams<M>,
) => {
  const result = await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultSnapOrigin,
      request: {
        method: `klv_${args.snapRpcMethod}`,
        params: 'params' in args ? args.params : undefined,
      },
    },
  });

  return result as unknown as RpcMethodTypes[M]['output'];
};

// eslint-disable-next-line jsdoc/require-returns
/**
 * Invoke the "klv_getAddress" RPC method from the snap.
 */
export const getAddress = async () => {
  return snapRpcRequest({
    snapRpcMethod: 'getAddress',
  });
};
