import { useEffect, useState } from 'react';
import { useInvokeSnap } from './useInvokeSnap';

export const useBalance = (isSnapInstalled: boolean) => {
  const [balance, setBalance] = useState<string | undefined>();
  const invokeSnap = useInvokeSnap();

  useEffect(() => {
    if (isSnapInstalled) {
      void (async () => {
        const balanceResponse = await invokeSnap({ method: 'klv_getBalance' });
        if (balanceResponse) {
          setBalance(balanceResponse);
        }
      })();
    }
  }, [isSnapInstalled]);

  return { balance };
};
