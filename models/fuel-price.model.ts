import {IBaseModel} from './base.model';

export interface IFuelPriceModel extends IBaseModel {
  price: number;
  from: string;
  to: string;
}
