import { IBaseModel } from "./base.model";
import { IFuelPriceModel } from "./fuel-price.model";

export interface IFuelTypeModel extends IBaseModel{
    name: string;
    currentPrice: IFuelPriceModel;
    previousPrice: IFuelPriceModel;
}