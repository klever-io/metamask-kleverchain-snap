import { useState } from 'react';

import { useInvokeSnap } from './useInvokeSnap';

export const useSignMessage = () => {
  const [lastSignature, setLastSignature] = useState<string | undefined>();
  const invokeSnap = useInvokeSnap();

  const signMessage = async (data: FormData) => {
    const message = data.get('message');
    const response = await invokeSnap({
      method: 'klv_signMessage',
      params: {
        message,
      },
    });
    setLastSignature(response as string);
  };

  return { signMessage, lastSignature };
};
