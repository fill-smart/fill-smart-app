import React, { createContext, useReducer, Reducer } from 'react';
import { FuelTypeWithCurrentPriceRecord } from '../hooks/use-fuel-types-with-current-price.hook';

export interface IExchangeWalletContext {
  sourceFuelType: FuelTypeWithCurrentPriceRecord | null,
  targetFuelType: FuelTypeWithCurrentPriceRecord | null,
  sourceLitres: number | null,
  targetLitres: number | null
}

export enum EXCHANGE_WALLET_ACTIONS {
  SET_SOURCE_FUEL_TYPE = '[Set Source Fuel Type]',
  SET_TARGET_FUEL_TYPE = '[Set Target Fuel Type]',
  SET_SOURCE_LITRES = '[Set Target Litres]',
  CLEAN_STORE = '[Clean Store]'
}

export interface IAction {
  type: EXCHANGE_WALLET_ACTIONS;
}

export interface ISetSourceFuelTypeAction extends IAction {
  payload: {
    sourceFuelType: FuelTypeWithCurrentPriceRecord | null
  }
}

export interface ISetTargetFuelTypeAction extends IAction {
  payload: {
    targetFuelType: FuelTypeWithCurrentPriceRecord | null
  }
}

export interface ISetSourceLItresAndTargetLitresAction extends IAction {
  payload: {
    sourceLitres: number | null,
    targetLitres: number | null
  }
}

export interface ICleanStore extends IAction { }

export type IExchangeWalletActions =
  ISetSourceFuelTypeAction
  | ISetTargetFuelTypeAction
  | ISetSourceLItresAndTargetLitresAction
  | ICleanStore;

export const defaultExchangeWalletContextValue: IExchangeWalletContext = {
  sourceFuelType: null,
  targetFuelType: null,
  sourceLitres: null,
  targetLitres: null,
};

export const ExchangeWalletContext = createContext
  <[IExchangeWalletContext, React.Dispatch<IExchangeWalletActions>]>((null as unknown) as [IExchangeWalletContext, React.Dispatch<IExchangeWalletActions>]);

export const ExchangeWalletContextProvider = ({ children }: { children: Element }) => {
  const [state, dispatch] = useReducer<Reducer<IExchangeWalletContext, IExchangeWalletActions>>((state, action) => {
    switch (action.type) {
      case EXCHANGE_WALLET_ACTIONS.SET_SOURCE_FUEL_TYPE:
        return {
          ...state,
          ...(action as ISetSourceFuelTypeAction).payload,
        }
      case EXCHANGE_WALLET_ACTIONS.SET_TARGET_FUEL_TYPE:
        return {
          ...state,
          ...(action as ISetTargetFuelTypeAction).payload,
        }
      case EXCHANGE_WALLET_ACTIONS.SET_SOURCE_LITRES:
        return {
          ...state,
          ...(action as ISetSourceLItresAndTargetLitresAction).payload,
        }
      case EXCHANGE_WALLET_ACTIONS.CLEAN_STORE:
        return defaultExchangeWalletContextValue;
      default:
        return state;
    }
  }, defaultExchangeWalletContextValue);

  return (
    <ExchangeWalletContext.Provider value={[state, dispatch]}>
      {children}
    </ExchangeWalletContext.Provider>
  );
};