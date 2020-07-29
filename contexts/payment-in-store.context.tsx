import React, { createContext, useReducer, Reducer } from 'react';
import { IGasStationModel } from '../models/gas-station.model';
import { WalletRecord } from '../hooks/use-wallets';

export interface IPaymentInStoreContext {
  gasStation: IGasStationModel | null,
  amount: number | null,
  wallet: WalletRecord | null,
}

export enum PAYMENT_IN_STORE_ACTIONS {
  SET_GAS_STATION = '[Set Gas Station]',
  SET_AMOUNT = '[Set Amount]',
  SET_WALLET = '[Set Wallet]',
  CLEAN_STORE = '[Clean Store]'
}

export interface IAction {
  type: PAYMENT_IN_STORE_ACTIONS;
}

export interface ISetGasStationAction extends IAction {
  payload: {
    gasStation: IGasStationModel;
  }
}

export interface ISetAmountAction extends IAction {
  payload: {
    amount: number;
  }
}

export interface ISetWalletAction extends IAction {
  payload: {
    wallet: WalletRecord;
  }
}

export interface ICleanStore extends IAction { }

export type IPaymentInSotreActions =
  ISetGasStationAction
  | ISetAmountAction
  | ISetWalletAction
  | ICleanStore;

export const defaultPaymentInStoreContextValue: IPaymentInStoreContext = {
  gasStation: null,
  amount: null,
  wallet: null,
};

export const PaymentInStoreContext = createContext
  <[IPaymentInStoreContext, React.Dispatch<IPaymentInSotreActions>]>((null as unknown) as [IPaymentInStoreContext, React.Dispatch<IPaymentInSotreActions>]);

export const PaymentInStoreContextProvider = ({ children }: { children: Element }) => {
  const [state, dispatch] = useReducer<Reducer<IPaymentInStoreContext, IPaymentInSotreActions>>((state, action) => {
    switch (action.type) {
      case PAYMENT_IN_STORE_ACTIONS.SET_GAS_STATION:
        return {
          ...state,
          ...(action as ISetGasStationAction).payload
        };
      case PAYMENT_IN_STORE_ACTIONS.SET_AMOUNT:    
        return {
          ...state,
          ...(action as ISetAmountAction).payload
        };
      case PAYMENT_IN_STORE_ACTIONS.SET_WALLET:    
        return {
          ...state,
          ...(action as ISetWalletAction).payload
        };
      case PAYMENT_IN_STORE_ACTIONS.CLEAN_STORE:
        return defaultPaymentInStoreContextValue;
      default:
        return state;
    }
  }, defaultPaymentInStoreContextValue);

  return (
    <PaymentInStoreContext.Provider value={[state, dispatch]}>
      {children}
    </PaymentInStoreContext.Provider>
  );
};