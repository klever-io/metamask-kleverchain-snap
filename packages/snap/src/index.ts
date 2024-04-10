import type { OnRpcRequestHandler } from '@metamask/snaps-sdk';

import {
  broadcastTransactions,
  buildTransaction,
  getAddress,
  signMessage,
  signTransaction,
  validateSignature,
} from './rpc';
import type {
  SignMessageParams,
  SignTransactionParams,
  BroadcastTransactionsParams,
  BuildTransactionParams,
  ValidateSignatureParams,
} from './types';
import { web } from '@klever/sdk';

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
  if (web.isKleverWebActive()) {
    await web.initialize();
  }
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
    case 'klv_buildTransaction':
      return await buildTransaction(
        request.params as unknown as BuildTransactionParams,
      );
    case 'klv_signTransaction': {
      const params = request.params as unknown as SignTransactionParams;
      params.origin = origin;
      return await signTransaction(params);
    }
    case 'klv_broadcastTransactions':
      return await broadcastTransactions(
        request.params as unknown as BroadcastTransactionsParams,
      );
    default:
      throw new Error('Method not found.');
  }
};
