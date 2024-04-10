import React from 'react';
import styled from 'styled-components';

import {
  ConnectButton,
  InstallFlaskButton,
  ReconnectButton,
  Card,
} from '../components';
import { defaultSnapOrigin } from '../config';
import { useMetaMask, useMetaMaskContext, useRequestSnap } from '../hooks';
import { useAddress } from '../hooks/useAddress';
import { useSendKLV } from '../hooks/useSendKLV';
import { useSignMessage } from '../hooks/useSignMessage';
import { isLocalSnap, shouldDisplayReconnectButton } from '../utils';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 7.6rem;
  margin-bottom: 7.6rem;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

const Heading = styled.h1`
  margin-top: 0;
  margin-bottom: 2.4rem;
  text-align: center;
`;

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary?.default};
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 64.8rem;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error?.muted};
  border: 1px solid ${({ theme }) => theme.colors.error?.default};
  color: ${({ theme }) => theme.colors.error?.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

const Index = () => {
  const { error } = useMetaMaskContext();
  const { isFlask, snapsDetected, installedSnap } = useMetaMask();
  const requestSnap = useRequestSnap();
  const isMetaMaskReady = isLocalSnap(defaultSnapOrigin)
    ? isFlask
    : snapsDetected;

  const isSnapInstalled = Boolean(installedSnap);
  const { address } = useAddress(isSnapInstalled);

  const {
    error: txError,
    isLoading: isTxLoading,
    lastTxId,
    sendKLV,
  } = useSendKLV();

  const handleSendKLV: React.FormEventHandler<HTMLFormElement> = async (
    ev,
  ): Promise<void> => {
    ev.preventDefault();
    const form = ev.currentTarget;
    const formData = new FormData(form);
    await sendKLV(formData);
  };

  const { signMessage, lastSignature } = useSignMessage();

  const handleSignMessage: React.FormEventHandler<HTMLFormElement> = async (
    ev,
  ): Promise<void> => {
    ev.preventDefault();
    const form = ev.currentTarget;
    const formData = new FormData(form);
    await signMessage(formData);
  };

  return (
    <Container>
      <Heading>
        Welcome to <Span>Kleverchain</Span>
      </Heading>
      <CardContainer>
        {error && (
          <ErrorMessage>
            <b>An error happened:</b> {error.message}
          </ErrorMessage>
        )}
        {!isMetaMaskReady && (
          <Card
            content={{
              title: 'Install',
              description:
                'Snaps is pre-release software only available in MetaMask Flask, a canary distribution for developers with access to upcoming features.',
              button: <InstallFlaskButton />,
            }}
            fullWidth
          />
        )}
        {!installedSnap && (
          <Card
            content={{
              title: 'Connect',
              description:
                'Get started by connecting to and installing the example snap.',
              button: (
                <ConnectButton
                  onClick={requestSnap}
                  disabled={!isMetaMaskReady}
                />
              ),
            }}
            disabled={!isMetaMaskReady}
          />
        )}
        {shouldDisplayReconnectButton(installedSnap) && (
          <Card
            content={{
              title: 'Reconnect',
              description:
                'While connected to a local running snap this button will always be displayed in order to update the snap if a change is made.',
              button: (
                <ReconnectButton
                  onClick={requestSnap}
                  disabled={!installedSnap}
                />
              ),
            }}
            disabled={!installedSnap}
          />
        )}
        {address && (
          <Card
            fullWidth
            content={{
              title: 'Your Kleverchain Address',
              description: address,
            }}
          />
        )}
        {installedSnap && (
          <Card
            fullWidth
            content={{
              title: 'Send KLV',
              description: (
                <>
                  <form onSubmit={handleSendKLV}>
                    <p>
                      <input
                        type="text"
                        name="toAddress"
                        placeholder="Address"
                      />
                    </p>
                    <p>
                      <input
                        type="number"
                        name="amountInKLV"
                        placeholder="Amount in KLV"
                      />
                    </p>
                    <button type="submit" disabled={isTxLoading}>
                      Send KLV
                    </button>
                  </form>
                  {lastTxId && (
                    <p>
                      Latest transaction:{' '}
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://kleverscan.org/transaction/${lastTxId}`}
                      >
                        {lastTxId}
                      </a>
                    </p>
                  )}
                  {txError && <ErrorMessage>{txError}</ErrorMessage>}
                </>
              ),
            }}
          />
        )}
        {installedSnap && (
          <Card
            fullWidth
            content={{
              title: 'Sign Message',
              description: (
                <>
                  <form onSubmit={handleSignMessage}>
                    <p>
                      <input type="text" name="message" placeholder="Message" />
                    </p>
                    <button type="submit">Sign Message</button>
                  </form>
                  {lastSignature && (
                    <p
                      style={{
                        maxWidth: '300px',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                      }}
                    >
                      Latest Signature:{` ${lastSignature}`}
                    </p>
                  )}
                </>
              ),
            }}
          />
        )}
      </CardContainer>
    </Container>
  );
};

export default Index;
