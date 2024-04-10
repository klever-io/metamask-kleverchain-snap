import { utils } from '@klever/sdk';
import type { IDecodedTransaction } from '@klever/sdk/dist/types/lib/types/dtos';

import { confirmSignMessage, confirmSignTransaction } from './dialogs';
import { toHex } from './hex-utils';
import { getSdkAccount } from './sdk';
import type {
  SignMessageParams,
  ValidateSignatureParams,
  BroadcastTransactionsParams,
  BuildTransactionParams,
  SignTransactionParams,
} from './types';

export const getAddress = async (): Promise<string> => {
  const account = await getSdkAccount();
  const address = account.getAddress();

  if (!address) {
    throw new Error('Address not found');
  }

  return address;
};

export const signMessage = async (
  params: SignMessageParams,
): Promise<string> => {
  const confirmationResponse = await confirmSignMessage(params);

  if (confirmationResponse !== true) {
    throw new Error('Signature must be approved by user');
  }

  const account = await getSdkAccount();
  return await account.signMessage(toHex(params.message));
};

export const validateSignature = async (params: ValidateSignatureParams) => {
  return await utils.validateSignature(
    toHex(params.message),
    params.signature,
    params.address,
  );
};

export const buildTransaction = async (params: BuildTransactionParams) => {
  const account = await getSdkAccount();
  return await account.buildTransaction(
    params.contracts,
    params.txData,
    params.options,
  );
};

export const signTransaction = async (params: SignTransactionParams) => {
  let decodedTx = (await utils.decodeTransaction(
    params.transaction,
  )) as unknown;

  // some versions of klever sdk already return the tx instead of data
  // this code block puts the tx into the data field to be compatible with IDecodedTransaction object
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (!decodedTx.data) {
    decodedTx = {
      data: decodedTx,
    };
  }

  const confirmationResponse = await confirmSignTransaction(
    decodedTx as IDecodedTransaction,
    params.origin,
  );

  if (confirmationResponse !== true) {
    throw new Error('Signature must be approved by user');
  }

  const account = await getSdkAccount();
  return await account.signTransaction(params.transaction);
};

export const broadcastTransactions = async (
  params: BroadcastTransactionsParams,
) => {
  const account = await getSdkAccount();
  return await account.broadcastTransactions(params.transactions);
};
