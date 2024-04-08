import { utils } from '@klever/sdk';

import { confirmSignMessage } from './dialogs';
import { toHex } from './hex-utils';
import { getSdkAccount } from './sdk';
import type { SignMessageParams, ValidateSignatureParams } from './types';

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
