import { copyable, divider, heading, panel, text } from '@metamask/snaps-sdk';

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
