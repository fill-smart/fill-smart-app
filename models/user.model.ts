
export interface IUserModel {
    id: number;
    username: string;
    
    roles: Array<ISimpleRole>;
}

export interface ISimpleRole {
    name: string;
}