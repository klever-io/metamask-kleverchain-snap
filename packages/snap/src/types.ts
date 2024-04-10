import { IContractRequest, ITransaction, ITxOptionsRequest } from '@klever/sdk';

export type SignMessageParams = {
  message: string;
  origin: string;
};

export type ValidateSignatureParams = {
  message: string;
  signature: string;
  address: string;
};

export type BuildTransactionParams = {
  contracts: IContractRequest[];
  txData?: string[];
  options?: ITxOptionsRequest;
};

export type SignTransactionParams = {
  transaction: ITransaction;
  origin: string;
};

export type BroadcastTransactionsParams = {
  transactions: ITransaction[];
};
