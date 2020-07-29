import React, {createContext, useReducer, Reducer} from 'react';
import {LastPumpOperationRecord} from '../hooks/use-pump-last-operation.hook';
import {WalletRecord} from '../hooks/use-wallets';

export interface IRegisterContext {
  firstName: string | null;
  lastName: string | null;
  documentNumber: string | null;
  born: Date | null;
  phone: string | null;
  username: string | null;
  password: string | null;
  documentImageFrontPath: string | null;
  documentImageBackPath: string | null;
}

export enum REGISTER_ACTIONS {
  SET_REGISTER_DATA = '[Set Operation]',
  SET_DOCUMENT_IMAGE = '[Set Document Image]',
  CLEAN_STORE = '[Clean store]',
}

export interface IAction {
  type: REGISTER_ACTIONS;
}

export interface ISetRegisterDataAction extends IAction {
  payload: {
    registerData: Partial<IRegisterContext> | null;
  };
}

export interface ISetDocumentImagePath extends IAction {
  payload: {
    type: 'FRONT' | 'BACK';
    documentImage: string;
  };
}

export interface ICleanStore extends IAction {}

export type IRegisterActions =
  | ISetRegisterDataAction
  | ISetDocumentImagePath
  | ICleanStore;

export const defaultRefuelContextValue: IRegisterContext = {
  firstName: null,
  lastName: null,
  documentNumber: null,
  born: null,
  phone: null,
  username: null,
  password: null,
  documentImageFrontPath: null,
  documentImageBackPath: null,
};

export const RegisterContext = createContext<
  [IRegisterContext, React.Dispatch<IRegisterActions>]
>((null as unknown) as [IRegisterContext, React.Dispatch<IRegisterActions>]);

export const RegisterContextProvider = ({children}: {children: Element}) => {
  const [state, dispatch] = useReducer<
    Reducer<IRegisterContext, IRegisterActions>
  >((state, action) => {
    switch (action.type) {
      case REGISTER_ACTIONS.SET_REGISTER_DATA:
        return {
          ...state,
          ...(action as ISetRegisterDataAction).payload.registerData,
        };
      case REGISTER_ACTIONS.SET_DOCUMENT_IMAGE:
        let prop =
          (action as ISetDocumentImagePath).payload.type === 'FRONT'
            ? 'documentImageFrontPath'
            : 'documentImageBackPath';
        return {
          ...state,
          ...{[prop]: (action as ISetDocumentImagePath).payload.documentImage},
        };
      case REGISTER_ACTIONS.CLEAN_STORE:
        return defaultRefuelContextValue;
      default:
        return state;
    }
  }, defaultRefuelContextValue);

  return (
    <RegisterContext.Provider value={[state, dispatch]}>
      {children}
    </RegisterContext.Provider>
  );
};
