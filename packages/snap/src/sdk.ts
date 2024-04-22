import { Account } from '@klever/sdk';

import { removeHexPrefix } from './hex-utils';
import { getAccount } from './private-key';

export const getSdkAccount = async () => {
  const mmAccount = await getAccount();
  const pk = removeHexPrefix(mmAccount.privateKey as string);
  const account = new Account(pk);
  await account.ready;
  return account;
};
