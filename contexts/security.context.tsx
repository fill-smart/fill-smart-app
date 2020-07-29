import React, { createContext, useReducer, Reducer, useEffect } from 'react';
import { IUserModel } from '../models/user.model';
import AsyncStorage from '@react-native-community/async-storage';
import Environment from '../environment/environment';

export interface ISecurityCustomer {
  firstName: string;
  lastName: string;
  status: 'ACTIVE' | 'INACTIVE';
  profileImage: string | null;
  cbu: string;
  cbuAlias: string;
  mercadopagoAccount: string;
}

export interface ISecurityContext {
  token: string;
  user: (IUserModel & {
    customer: ISecurityCustomer;
  })
  | null;
  loading: boolean;
  hasAvailableLitres: boolean;
}

export enum SECURITY_ACTIONS {
  SET_AUTHENTICATION = '[Set Authentication]',
  SET_INITIAL_AUTHENTICATION = '[Set Initial Authentication]',
  SET_LOADING = '[Set Loading]',
  SET_ACTIVE = '[Set Active]',
  SET_HAS_AVAILABLE_LITRES = '[Set Has Available Litres]',
  CLEAR_AUTHENTICATION = '[Clear Authentication]',
  UPDATE_CUSTOMER = '[Update Customer]',
}

export enum RolesEnum {
  Admin = 'ADMIN',
  Customer = 'CUSTOMER',
  Seller = 'SELLER',
}

export interface IAction {
  type: SECURITY_ACTIONS;
}

export interface ISetAuthenticationAction extends IAction {
  payload: {
    token: string;
    user: IUserModel & {
      customer: ISecurityCustomer;
    };
  };
}

export interface IUpdateCustomerAction extends IAction {
  payload: ISecurityCustomer;
};


export interface ISetLoadingAction extends IAction {
  payload: boolean
}

export interface ISetActiveAction extends IAction { }

export const retrieveFromStorage = async (): Promise<ISecurityContext | null> => {
  const token = await AsyncStorage.getItem('jwt-token');
  const userJson = await AsyncStorage.getItem('user');
  if (token && token !== '' && userJson && userJson !== '') {
    return {
      token: token,
      user: JSON.parse(userJson) as IUserModel & {
        customer: {
          firstName: string;
          lastName: string;
          status: 'ACTIVE' | 'INACTIVE';
          profileImage: null;
          cbu: string;
          cbuAlias: string;
          mercadopagoAccount: string;
        };
      },
      loading: false,
      hasAvailableLitres: false,
    };

  } else {
    return null;
  }
};

export interface ISetHasAvailableLitresAction extends IAction {
  payload: boolean
}

export interface IClearAuthenticationAction extends IAction { }

export type ISecurityActions =
  | ISetAuthenticationAction
  | ISetActiveAction
  | IClearAuthenticationAction
  | ISetLoadingAction
  | ISetHasAvailableLitresAction
  | IUpdateCustomerAction;

export const defaultSecurityContextValue: ISecurityContext = {
  token: '',
  user: null,
  loading: true,
  hasAvailableLitres: false,
};

export const SecurityContext = createContext<
  [ISecurityContext, React.Dispatch<ISecurityActions>]
>((null as unknown) as [ISecurityContext, React.Dispatch<ISecurityActions>]);

export const SecurityContextProvider = ({ children }: { children: Element }) => {
  const [state, dispatch] = useReducer<
    Reducer<ISecurityContext, ISecurityActions>
  >((state, action) => {
    switch (action.type) {
      case SECURITY_ACTIONS.SET_AUTHENTICATION:
      case SECURITY_ACTIONS.SET_INITIAL_AUTHENTICATION:
        const load = (action as ISetAuthenticationAction).payload;
        AsyncStorage.setItem('jwt-token', load.token);
        AsyncStorage.setItem('user', JSON.stringify(load.user));
        return {
          ...state,
          ...(action as ISetAuthenticationAction).payload,
        };
      case SECURITY_ACTIONS.SET_ACTIVE:
        const setActivePatch = { ...state, user: { ...state.user, customer: { ...state.user?.customer, status: 'ACTIVE' } } } as ISecurityContext;
        AsyncStorage.setItem('user', JSON.stringify(setActivePatch.user));
        return setActivePatch;
      case SECURITY_ACTIONS.CLEAR_AUTHENTICATION:
        AsyncStorage.removeItem('jwt-token');
        AsyncStorage.removeItem('user');
        return defaultSecurityContextValue;
      case SECURITY_ACTIONS.UPDATE_CUSTOMER:
        const updateCustomerPatch = { ...state, user: { ...state.user, customer: (action as IUpdateCustomerAction).payload } } as ISecurityContext;
        AsyncStorage.setItem('user', JSON.stringify(updateCustomerPatch.user));
        return updateCustomerPatch;
      case SECURITY_ACTIONS.SET_LOADING:
        return {
          ...state,
          loading: (action as ISetLoadingAction).payload
        }
      case SECURITY_ACTIONS.SET_HAS_AVAILABLE_LITRES:
        return {
          ...state,
          hasAvailableLitres: (action as ISetHasAvailableLitresAction).payload
        }
      default:
        return state;
    }
  }, defaultSecurityContextValue);

  useEffect(() => {
    retrieveFromStorage().then(savedContext => {
      if (savedContext) {
        dispatch({
          type: SECURITY_ACTIONS.SET_INITIAL_AUTHENTICATION,
          payload: {
            token: savedContext.token,
            user: savedContext.user as any,
          },
        });
      }

      dispatch({
        type: SECURITY_ACTIONS.SET_LOADING,
        payload: false
      });

    });
  }, []);

  return (
    <SecurityContext.Provider value={[state, dispatch]}>
      {children}
    </SecurityContext.Provider>
  );
};
