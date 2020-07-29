import React from 'react';
import { SecurityContextProvider } from './contexts/security.context';
import { ExchangeWalletContextProvider } from './contexts/exchange-wallets.context';
import { PaymentInStoreContextProvider } from './contexts/payment-in-store.context';
import { PruchaseFuelContextProvider } from './contexts/purchase-fuel.context';
import { RefueluelContextProvider } from './contexts/refuel.context';
import { WithdrawalContextProvider } from './contexts/withdrawal.context';
import { FcmContextProvider } from './contexts/fcm.context';
import { RegisterContextProvider } from './contexts/register-user.context';
import { ConnectionContextProvider } from './contexts/connection-context';
import { TransferContextProvider } from './contexts/transfer.context';

const ContextsContainer = ({ children }: { children: Element }) => (
  <ConnectionContextProvider>
    <SecurityContextProvider>
      <RegisterContextProvider>
        <ExchangeWalletContextProvider>
          <PaymentInStoreContextProvider>
            <PruchaseFuelContextProvider>
              <RefueluelContextProvider>
                <WithdrawalContextProvider>
                  <TransferContextProvider>
                    <FcmContextProvider>{children}</FcmContextProvider>
                  </TransferContextProvider>
                </WithdrawalContextProvider>
              </RefueluelContextProvider>
            </PruchaseFuelContextProvider>
          </PaymentInStoreContextProvider>
        </ExchangeWalletContextProvider>
      </RegisterContextProvider>
    </SecurityContextProvider>
  </ConnectionContextProvider>
);
export default ContextsContainer;
