import { useState } from 'react';

import { useInvokeSnap } from './useInvokeSnap';

export const useSendKLV = () => {
  const [lastTxId, setLastTxId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const invokeSnap = useInvokeSnap();

  const sendKLV = async (data: FormData) => {
    if (isLoading) {
      return;
    }
    try {
      setError(undefined);
      setLastTxId(undefined);
      setIsLoading(true);
      const toAddress = data.get('toAddress');
      const amountInKLV = data.get('amountInKLV');

      if (typeof toAddress === 'string' && typeof amountInKLV === 'string') {
        const transaction = await invokeSnap({
          method: 'klv_buildTransaction',
          params: {
            contracts: [
              {
                type: 0, // transfer
                payload: {
                  Amount: Number(amountInKLV),
                  KDA: 'KLV',
                  Receiver: toAddress,
                },
              },
            ],
          },
        });
        const signedTransaction = await invokeSnap({
          method: 'klv_signTransaction',
          params: {
            transaction,
          },
        });
        const broadcasted = await invokeSnap({
          method: 'klv_broadcastTransactions',
          params: {
            transactions: [signedTransaction],
          },
        });
        setLastTxId(broadcasted.data.txsHashes[0]);
      }
    } catch (exception: unknown) {
      if (exception instanceof Error) {
        setError(exception.message);
      } else if (typeof exception === 'string') {
        setError(exception);
      } else {
        setError(`An unknown error occurred: ${JSON.stringify(exception)}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { lastTxId, isLoading, error, sendKLV };
};
