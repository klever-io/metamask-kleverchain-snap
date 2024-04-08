import type { OnRpcRequestHandler } from '@metamask/snaps-sdk';

import { getAddress, signMessage, validateSignature } from './rpc';
import type { SignMessageParams } from './types';
import { ValidateSignatureParams } from './types';

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  switch (request.method) {
    case 'klv_getAddress':
      return await getAddress();
    case 'klv_signMessage': {
      const params = request.params as SignMessageParams;
      params.origin = origin;
      return await signMessage(params);
    }
    case 'klv_validateSignature':
      return await validateSignature(request.params as ValidateSignatureParams);
    default:
      throw new Error('Method not found.');
  }
};
