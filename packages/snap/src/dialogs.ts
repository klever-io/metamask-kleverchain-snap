import type { IDecodedTransaction } from '@klever/sdk/dist/types/lib/types/dtos';
import {
  copyable,
  divider,
  heading,
  panel,
  row,
  text,
} from '@metamask/snaps-sdk';

import type { SignMessageParams } from './types';

export const confirmSignMessage = async (
  params: SignMessageParams,
): Promise<boolean | string | null> => {
  return await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: panel([
        heading('Confirm Signature'),
        divider(),
        text('Sign the following message:'),
        copyable(params.message),
        text('For the following origin:'),
        copyable(params.origin),
      ]),
    },
  });
};

export const confirmSignTransaction = async (
  decodedTx: IDecodedTransaction,
  origin: string,
): Promise<boolean | string | null> => {
  // Format value to KLV with precision
  const formatValue = (value: number) => {
    const newValue = (value / 1e6).toFixed(2);
    return `${newValue} KLV`;
  };

  // Format key to human-readable
  const formatKey = (key: string): string => {
    const result = key.replace(/([A-Z])/gu, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
  };

  // This process is to implement a generic way to display the transaction data in the confirmation dialog
  // it reads all the parameters of all contracts and displays them in a table, should work for all types of contracts
  // TODO: manually implement the display of the parameters for each type of contract to support internationalization
  const contractsData: any[] = [];
  if (decodedTx.data.tx.contract) {
    for (const contract of decodedTx.data.tx.contract) {
      const contractType = contract.typeString.replace('ContractType', '');
      contractsData.push(divider());
      contractsData.push(heading(`${contractType} Contract`));
      for (const key in contract.parameter) {
        contractsData.push(
          row(formatKey(key), text(contract.parameter[key].toString())),
        );
      }
    }
  }

  return await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: panel([
        heading('Confirm TX Signature'),
        ...contractsData,
        divider(),
        row('Kapp Fee', text(formatValue(decodedTx.data.tx.kAppFee))),
        row('Bandwidth Fee', text(formatValue(decodedTx.data.tx.bandwidthFee))),
        divider(),
        text('For the following origin:'),
        copyable(origin),
      ]),
    },
  });
};
