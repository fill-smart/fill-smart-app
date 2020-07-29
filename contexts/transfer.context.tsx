import React, { createContext, useReducer, Reducer } from 'react';
import { WalletRecord } from '../hooks/use-wallets';
import { IGasStationModel } from '../models/gas-station.model';
import { ICustomerModel } from '../models/customer.model';
import { IFuelTypeModel } from '../models/fuel-type.model';


export interface ITransferContext {
  selectedCustomer: Pick<ICustomerModel, "id" | "firstName" | "lastName" | "documentNumber"> | null,
  litres: number | null,
  fuelType: Pick<IFuelTypeModel, "id" | "name"> | null
}

export enum  TRANSFER_ACTIONS{
  SET_SELECTED_CUSTOMER = '[Set Selected Customer]',
  SET_LITRES = '[Set Litres]',  
  SET_FUEL_TYPE = '[Set Fuel Type]',
  CLEAN_STORE = '[Clean Store]'
}

export interface IAction {
  type: TRANSFER_ACTIONS;
}

export interface ISetSelectedCustomerAction extends IAction { 
  payload: {
      selectedCustomer: Pick<ICustomerModel, "id" | "firstName" | "lastName" | "documentNumber">
  }
}

export interface ISetLitresAction extends IAction { 
  payload: {
      litres: number;
  }
}

export interface ISetFuelTypeAction extends IAction { 
  payload: {
     fuelType: Pick<IFuelTypeModel, "id" | "name">;
  }
}

export interface ICleanStore extends IAction{}

export type ITransferActions =
  ISetSelectedCustomerAction
  | ISetLitresAction
  | ISetFuelTypeAction
  | ICleanStore;

export const defaulTransferContextValue: ITransferContext = {  
  selectedCustomer: null,
  litres: null,
  fuelType: null,
};

export const TransferContext = createContext
    <[ITransferContext, React.Dispatch<ITransferActions>]>((null as unknown) as [ITransferContext, React.Dispatch<ITransferActions>]);

export const TransferContextProvider = ({ children }: { children: Element }) => {
  const [state, dispatch] = useReducer<Reducer<ITransferContext, ITransferActions>>((state, action) => {
    switch (action.type) {
      case TRANSFER_ACTIONS.SET_SELECTED_CUSTOMER:
        return {
          ...state,
          ...(action as ISetSelectedCustomerAction).payload
        };
      case TRANSFER_ACTIONS.SET_LITRES:    
        return {
          ...state,
          ...(action as ISetLitresAction).payload
        };
      case TRANSFER_ACTIONS.SET_FUEL_TYPE:    
        return {
          ...state,
          ...(action as ISetFuelTypeAction).payload
        };
      case TRANSFER_ACTIONS.CLEAN_STORE:
        return defaulTransferContextValue;
      default:
        return state;
    }
  }, defaulTransferContextValue);

  return (
    <TransferContext.Provider value={[state, dispatch]}>
      {children}
    </TransferContext.Provider>
  );
};