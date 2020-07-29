import React, { createContext, useReducer, Reducer } from 'react';
import { WalletRecord } from '../hooks/use-wallets';
import { IGasStationModel } from '../models/gas-station.model';
import { WithdrawalType, TransferAccountType } from '../models/withdrawal-enums';

export interface IWithdrawalContext {
  gasStation: IGasStationModel | null,
  amount: number | null,
  wallet: WalletRecord | null,
  type: WithdrawalType | null,
  transferAccount: TransferAccountType | null
}

export enum  WITHDRAWAL_ACTIONS{
  SET_GAS_STATION = '[Set Gas Station]',
  SET_AMOUNT = '[Set Amount]',  
  SET_WALLET = '[Set Wallet]',
  SET_TYPE = '[Set Type]',  
  SET_TRANSFER_ACCOUNT = '[Set Transfer Account]', 
  CLEAN_STORE = '[Clean Store]'
}

export interface IAction {
  type: WITHDRAWAL_ACTIONS;
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

export interface ISetTypeAction extends IAction { 
  payload: {
     type: WithdrawalType;
  }
}

export interface ISetTransferAccountAction extends IAction { 
  payload: {
     transferAccount: TransferAccountType;
  }
}

export interface ICleanStore extends IAction{}

export type IWithdrawalActions =
  ISetGasStationAction
  | ISetAmountAction
  | ISetWalletAction
  | ISetTypeAction
  | ISetTransferAccountAction
  | ICleanStore;

export const defaulWithdrawalContextValue: IWithdrawalContext = {  
  gasStation: null,
  amount: null,
  wallet: null,
  type: null,
  transferAccount: null,
};

export const WithdrawalContext = createContext
    <[IWithdrawalContext, React.Dispatch<IWithdrawalActions>]>((null as unknown) as [IWithdrawalContext, React.Dispatch<IWithdrawalActions>]);

export const WithdrawalContextProvider = ({ children }: { children: Element }) => {
  const [state, dispatch] = useReducer<Reducer<IWithdrawalContext, IWithdrawalActions>>((state, action) => {
    switch (action.type) {
      case WITHDRAWAL_ACTIONS.SET_GAS_STATION:
        return {
          ...state,
          ...(action as ISetGasStationAction).payload
        };
      case WITHDRAWAL_ACTIONS.SET_AMOUNT:    
        return {
          ...state,
          ...(action as ISetAmountAction).payload
        };
      case WITHDRAWAL_ACTIONS.SET_WALLET:    
        return {
          ...state,
          ...(action as ISetWalletAction).payload
        };
      case WITHDRAWAL_ACTIONS.SET_TYPE:    
        return {
          ...state,
          ...(action as ISetTypeAction).payload
        };
      case WITHDRAWAL_ACTIONS.SET_TRANSFER_ACCOUNT:    
        return {
          ...state,
          ...(action as ISetTransferAccountAction).payload
        };
      case WITHDRAWAL_ACTIONS.CLEAN_STORE:
        return defaulWithdrawalContextValue;
      default:
        return state;
    }
  }, defaulWithdrawalContextValue);

  return (
    <WithdrawalContext.Provider value={[state, dispatch]}>
      {children}
    </WithdrawalContext.Provider>
  );
};