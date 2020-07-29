import React, { createContext, useReducer, Reducer } from 'react';
import { LastPumpOperationRecord } from '../hooks/use-pump-last-operation.hook';
import { WalletRecord } from '../hooks/use-wallets';

export interface IRefuelContext {
  operation: LastPumpOperationRecord | null,
  wallet: WalletRecord | null
}

export enum REFUEL_ACTIONS {
  SET_OPERATION = '[Set Operation]',
  SET_WALLET = '[Set Wallet]',
  CLEAN_STORE = '[Clean store]'
}

export interface IAction {
  type: REFUEL_ACTIONS;
}

export interface ISetOperationAction extends IAction {
  payload: {
    operation: LastPumpOperationRecord | null
  }
}

export interface ISetWalletAction extends IAction {
  payload: {
    wallet: WalletRecord | null
  }
}

export interface ICleanStore extends IAction{}

export type IRefuelActions = ISetOperationAction | ISetWalletAction | ICleanStore;

export const defaultRefuelContextValue: IRefuelContext = {
  operation: null,
  wallet: null
};

export const RefuelContext = createContext
  <[IRefuelContext, React.Dispatch<IRefuelActions>]>((null as unknown) as [IRefuelContext, React.Dispatch<IRefuelActions>]);

export const RefueluelContextProvider = ({ children }: { children: Element }) => {
  const [state, dispatch] = useReducer<Reducer<IRefuelContext, IRefuelActions>>((state, action) => {
    switch (action.type) {
      case REFUEL_ACTIONS.SET_OPERATION:
        return {
          ...state,
          ...(action as ISetOperationAction).payload,
        };
      case REFUEL_ACTIONS.SET_WALLET:        
        return {
          ...state,
          ...(action as ISetWalletAction).payload,
        };
      case REFUEL_ACTIONS.CLEAN_STORE:
        return defaultRefuelContextValue;
      default:
        return state;
    }
  }, defaultRefuelContextValue);

  return (
    <RefuelContext.Provider value={[state, dispatch]}>
      {children}
    </RefuelContext.Provider>
  );
};