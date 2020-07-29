import {IFuelPriceModel} from './fuel-price.model';
import {IBaseModel} from './base.model';
export interface IPurchaseModel extends IBaseModel {
  fuelPrice: IFuelPriceModel;
  litres: number;
  stamp: Date;
  preferenceId: string;
  preferenceUrl: string;
  authorization: {
    id: number;
  };
}
