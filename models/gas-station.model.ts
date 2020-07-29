import { IBaseModel } from "./base.model";
import { IFuelPriceModel } from "./fuel-price.model";

export interface IGasStationModel extends IBaseModel {
    name: string;
    purchaseRequireAuthorization: boolean;
}