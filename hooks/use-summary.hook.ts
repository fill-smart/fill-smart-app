import useWallets, {WalletRecord} from './use-wallets';
import { ApolloError } from 'apollo-boost';

//Wrapper form object to touple
const getInfoFromWallets = (): [WalletRecord[] | undefined, boolean, ApolloError | undefined] => {
  const {wallets, loading, error} = useWallets();
  return [wallets, loading, error];
};

const useSummary = () => {
  const [walletsInfo, loadingWallets, error] = getInfoFromWallets();

  const litres =
    walletsInfo?.map(wallet => wallet.litres).reduce((p, n) => p + n, 0) ?? 0;
  const availableLitres =
    walletsInfo
      ?.map(wallet => wallet.availableLitres)
      .reduce((p, n) => p + n, 0) ?? 0;
  const money =
    walletsInfo
      ?.map(wallet => wallet.litres * wallet.fuelType.currentPrice.price)
      .reduce((p, n) => p + n, 0) ?? 0;
  const availableMoney =
    walletsInfo
      ?.map(
        wallet => wallet.availableLitres * wallet.fuelType.currentPrice.price,
      )
      .reduce((p, n) => p + n, 0) ?? 0;
  const annualProfitability = 17;
  const monthlyProfitability = 2;
  const loading = loadingWallets;
  return {
    loading,
    error,
    litres,
    availableLitres,
    money,
    availableMoney,
    annualProfitability,
    monthlyProfitability,
  };
};

export default useSummary;
