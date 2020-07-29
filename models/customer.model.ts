import { IBaseModel } from "./base.model";

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