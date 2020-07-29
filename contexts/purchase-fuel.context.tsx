import React, {createContext, useReducer, Reducer} from 'react';
import {IFuelTypePriceWithVariation} from 'hooks/use-fuel-price-variations.hook';
import {IFuelTypeModel} from 'models/fuel-type.model';
import {IFuelPriceModel} from 'models/fuel-price.model';
import PaymentMethod from '../models/payment-method.enum';

export interface IPurchaseFuelContext {
  mpPreferenceUrl: string;
  purchaseFuelAndQuantity: {
    litres: number;
    fuelType: Pick<IFuelTypeModel, 'name' | 'id'>;
    fuelPrice: Pick<IFuelPriceModel, 'id' | 'price'>;
  } | null;
  paymentMethod: PaymentMethod | null;
  gasStationId: number | null;
  availabilityDate: string | null;
}

export enum PURCHASE_FUEL_ACTIONS {
  SET_PREFERENCE_URL = '[Set Preference Url]',
  SET_PURCHASE_FUEL_AND_QUANTITY = '[Set Purchase Fuel And Quantity]',
  SET_PAYMENT_METHOD = '[Set Payment Method]',
  SET_GAS_STATION_ID = '[Set Gas Station Id]',
  SET_AVAILABILITY_DATE = '[Set Availability Date]',
  CLEAR_PURCHASE = '[Clear Purchase]',
}

export interface IAction {
  type: PURCHASE_FUEL_ACTIONS;
}

export interface ISetPreferenceUrlAction extends IAction {
  payload: Pick<IPurchaseFuelContext, 'mpPreferenceUrl'>;
}

export interface ISetPurchaseFuelAndQuantityAction extends IAction {
  payload: Pick<IPurchaseFuelContext, 'purchaseFuelAndQuantity'>;
}

export interface ISetPaymentMethodAction extends IAction {
  payload: Pick<IPurchaseFuelContext, 'paymentMethod'>;
}

export interface ISetGasStationIdAction extends IAction {
  payload: Pick<IPurchaseFuelContext, 'gasStationId'>;
}

export interface ISetAvailabilityDateAction extends IAction {
  payload: Pick<IPurchaseFuelContext, 'availabilityDate'>;
}

export interface IClearPurchaseAction extends IAction {}

export type IPurchaseFuelActions =
  | IAction
  | ISetPreferenceUrlAction
  | ISetPaymentMethodAction
  | ISetGasStationIdAction
  | ISetAvailabilityDateAction
  | ISetPurchaseFuelAndQuantityAction;

export const defaultPurchaseFuelContextValue: IPurchaseFuelContext = {
  mpPreferenceUrl: '',
  purchaseFuelAndQuantity: null,
  paymentMethod: null,
  gasStationId: null,
  availabilityDate: null,
};

export const PurchaseFuelContext = createContext<
  [IPurchaseFuelContext, React.Dispatch<IPurchaseFuelActions>]
>(
  (null as unknown) as [
    IPurchaseFuelContext,
    React.Dispatch<IPurchaseFuelActions>,
  ],
);

export const PruchaseFuelContextProvider = ({
  children,
}: {
  children: Element;
}) => {
  const [state, dispatch] = useReducer<
    Reducer<IPurchaseFuelContext, IPurchaseFuelActions>
  >((state, action) => {
    switch (action.type) {
      case PURCHASE_FUEL_ACTIONS.SET_PREFERENCE_URL: {
        const payload = (action as ISetPreferenceUrlAction).payload;
        return {
          ...state,
          mpPreferenceUrl: payload.mpPreferenceUrl,
        };
      }
      case PURCHASE_FUEL_ACTIONS.SET_PURCHASE_FUEL_AND_QUANTITY: {
        const payload = (action as ISetPurchaseFuelAndQuantityAction).payload;
        return {
          ...state,
          purchaseFuelAndQuantity: payload.purchaseFuelAndQuantity,
        };
      }
      case PURCHASE_FUEL_ACTIONS.SET_PAYMENT_METHOD: {
        const payload = (action as ISetPaymentMethodAction).payload;
        return {
          ...state,
          paymentMethod: payload.paymentMethod,
        };
      }
      case PURCHASE_FUEL_ACTIONS.SET_GAS_STATION_ID: {
        const payload = (action as ISetGasStationIdAction).payload;
        return {
          ...state,
          gasStationId: payload.gasStationId,
        };
      }
      case PURCHASE_FUEL_ACTIONS.SET_AVAILABILITY_DATE: {
        const payload = (action as ISetAvailabilityDateAction).payload;
        return {
          ...state,
          availabilityDate: payload.availabilityDate,
        };
      }
      case PURCHASE_FUEL_ACTIONS.CLEAR_PURCHASE: {
        return defaultPurchaseFuelContextValue;
      }
      default:
        return state;
    }
  }, defaultPurchaseFuelContextValue);

  return (
    <PurchaseFuelContext.Provider value={[state, dispatch]}>
      {children}
    </PurchaseFuelContext.Provider>
  );
};
