import type { BIP44Node } from '@metamask/key-tree';
import { getBIP44AddressKeyDeriver } from '@metamask/key-tree';

/**
 * Derive the single account we're using for this snap.
 * The path of the account is m/44'/690'/0'/0/0.
 */
export const getAccount = async (): Promise<BIP44Node> => {
  const kleverchainNode = await snap.request({
    method: 'snap_getBip44Entropy',
    params: {
      coinType: 690,
    },
  });

  const deriveKleverchainPrivateKey = await getBIP44AddressKeyDeriver(
    kleverchainNode,
  );

  return deriveKleverchainPrivateKey(0);
};
