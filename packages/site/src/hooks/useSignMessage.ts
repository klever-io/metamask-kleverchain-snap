import { useState } from 'react';
import { useInvokeSnap } from './useInvokeSnap';

export const useSignMessage = () => {
  const [lastSignature, setLastSignature] = useState<string | undefined>();
  const invokeSnap = useInvokeSnap();

  const signMessage = async (data: FormData) => {
    console.log('signMessage');
    const message = data.get('message');
    console.log('message', message);
    const response = await invokeSnap({
      method: 'klv_signMessage',
      params: {
        message,
      },
    });
    // @ts-ignore
    setLastSignature(response);
  };

  return { signMessage, lastSignature };
};
