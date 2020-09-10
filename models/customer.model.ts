import { IBaseModel } from "./base.model";

export enum AccountStatusEnum {
    Active = "active",
    Inactive = "inactive"
}

export interface ICustomerModel extends IBaseModel{
    firstName: string;
    lastName: string;
    documentNumber: string;
    born: string;
    phone: string;
    profileImage: string;
    cbu: string;
    cbuAlias: string;
    mercadopagoAccount: string;    
}