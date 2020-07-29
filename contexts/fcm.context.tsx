import React, {
  createContext,
  useReducer,
  Reducer,
  useEffect,
  useState,
  useContext,
} from 'react';
import useFcmToken from '../hooks/use-fcm-token.hook';
import useLogin from '../hooks/use-login.hook';
import { SecurityContext } from './security.context';

export enum PushNotificationTypesEnum {
  PurchaseSuccess = 'purchase_success',
  PurchaseRejected = 'purchase_rejected',
  CashWithdrawalPaymentRequest = 'cash_withdrawal_payment_request',
  ShopPurchasePaymentRequest = 'shop_purchase_payment_request',
  AuthorizationGranted = 'authorization_granted',
  AuthorizationRejected = 'authorization_rejected',
  GracePeriodChanged = 'grace_period_changed',
  ExchangeGracePeriodChanged = 'exchange_grace_period_changed',
  FuelTypeNameChanged = 'fuel_type_name_changed',
  GlobalMessage = 'global_message',
  TransferRecieved = "transfer_recieved",
  TransferWithdrawalAuthorized = "transfer_withdrawal_authorized"
}

export interface IPushNotification {
  type: PushNotificationTypesEnum;
  [key: string]: any;
}
export interface IFCMContext {
  token: string;
  notification: IPushNotification | null;
}

export enum FCM_ACTIONS {
  SET_NOTIFICATION = '[Set Notification]',
  CLEAR_NOTIFICATION = '[Clear Notification]',
  SET_TOKEN = '[Set Token]',
}

export interface IAction {
  type: FCM_ACTIONS;
}

export interface ISetTokenAction extends IAction {
  payload: {
    token: string;
  };
}
export interface ISetNotificationAction extends IAction {
  payload: {
    notification: IPushNotification;
  };
}
export interface IClearMessagesAction extends IAction { }

export type IFcmActions =
  | ISetTokenAction
  | ISetNotificationAction
  | IClearMessagesAction;

export const defaultFcmContextValue: IFCMContext = {
  token: '',
  notification: null,
};

export const FcmContext = createContext<
  [IFCMContext, React.Dispatch<IFcmActions>]
>((null as unknown) as [IFCMContext, React.Dispatch<IFcmActions>]);

export const FcmContextProvider = ({ children }: { children: Element }) => {
  const [state, dispatch] = useReducer<Reducer<IFCMContext, IFcmActions>>(
    (state, action) => {
      switch (action.type) {
        case FCM_ACTIONS.SET_TOKEN:
          const token = (action as ISetTokenAction).payload;
          return {
            ...state,
            ...token,
          } as IFCMContext;
        case FCM_ACTIONS.CLEAR_NOTIFICATION:
          return {
            ...state,
            notification: null,
          } as IFCMContext;
        case FCM_ACTIONS.SET_NOTIFICATION:
          const notification = (action as ISetNotificationAction).payload
            .notification;
          return {
            ...state,
            notification,
          };
        default:
          return state;
      }
    },
    defaultFcmContextValue,
  );

  //Send Token if Token Changes
  const { isAuthenticated, jwt } = useLogin();
  const { registerToken, unregisterToken } = useFcmToken();
  useEffect(() => {
    if (isAuthenticated && state.token !== '') {
      registerToken(state.token);
    }
  }, [state.token, isAuthenticated]);

  //Send Token if Logout
  const [security] = useContext(SecurityContext);
  const [previousJwt, setPreviousJwt] = useState('');
  useEffect(() => {
    if (security.token !== '') {
      setPreviousJwt(security.token);
    }
  }, [security.token]);
  useEffect(() => {
    if (!isAuthenticated && state.token !== '' && previousJwt !== '') {
      console.log('unregister: ', state.token);
      unregisterToken(state.token);
    }
  }, [state.token, isAuthenticated]);

  useEffect(() => { }, [state.notification]);

  return (
    <FcmContext.Provider value={[state, dispatch]}>
      {children}
    </FcmContext.Provider>
  );
};
