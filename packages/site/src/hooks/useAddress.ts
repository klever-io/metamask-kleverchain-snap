import { useEffect, useState } from 'react';
import { useInvokeSnap } from './useInvokeSnap';

export const useAddress = (isSnapInstalled: boolean) => {
  const [address, setAddress] = useState<string | undefined>();
  const invokeSnap = useInvokeSnap();

  useEffect(() => {
    if (isSnapInstalled) {
      void (async () => {
        const addressResponse = await invokeSnap({ method: 'klv_getAddress' });
        if (addressResponse) {
          setAddress(addressResponse);
        }
      })();
    }
  }, [isSnapInstalled]);

  return { address };
};
