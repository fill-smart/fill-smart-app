import Env from 'react-native-config';

export interface IEnvironmentVariables {
  apiUrl: string;
  name: string;
  isProduction: boolean;
  purchaseMaxLitres: number;
  withdrawalAmountMultiple: number;
  withdrawalMaxAmount: number;
  paymentInStoreLimit: number;
  apiVersion: string;
  appStoreLink: string;
  playStoreLink: string;
}

let Environment: IEnvironmentVariables = <IEnvironmentVariables>Env;

//Set isProduction boolean property
Environment.isProduction = Environment.name === 'production';

export default Environment;
