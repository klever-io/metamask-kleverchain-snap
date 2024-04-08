import { utils } from '@klever/sdk';

import { getAccount } from './private-key';

export const getAddress = async (): Promise<string> => {
  const account = await getAccount();
  const pk = (account.privateKey as string).replace('0x', '');
  const address = await utils.getAddressFromPrivateKey(pk);

  if (!address) {
    throw new Error('Address not found');
  }

  return address;
};
