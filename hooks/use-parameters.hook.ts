import { gql } from 'apollo-boost';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { useEffect } from 'react';
import useLogin from './use-login.hook';
import crashlytics from '@react-native-firebase/crashlytics';

const GET_PARAMETERS_QUERY = gql`
  query getParameters {
    gracePeriod
    exchangeGracePeriod
    purchaseMaxLitres
    withdrawalMaxAmount
    withdrawalAmountMultiple
    paymentInStoreLimit
    walletLitresLimit
    accountLitresLimit
  }
`;

const useParameters = () => {
  const { isAuthenticated } = useLogin();
  const [execute, { data, loading, error, refetch }] = useLazyQuery<{
    gracePeriod: number;
    exchangeGracePeriod: number;
    purchaseMaxLitres: number;
    withdrawalMaxAmount: number;
    withdrawalAmountMultiple: number;
    paymentInStoreLimit: number;
    walletLitresLimit: number;
    accountLitresLimit: number;
  }>(GET_PARAMETERS_QUERY);

  useEffect(() => {
    if (isAuthenticated) {
      execute();
    }
  }, [isAuthenticated]);

  if (error) {
    crashlytics().recordError(error);
    throw error;
  }
  const gracePeriod = data?.gracePeriod;
  const exchangeGracePeriod = data?.exchangeGracePeriod;
  const purchaseMaxLitres = data?.purchaseMaxLitres;
  const withdrawalMaxAmount = data?.withdrawalMaxAmount;
  const withdrawalAmountMultiple = data?.withdrawalAmountMultiple;
  const paymentInStoreLimit = data?.paymentInStoreLimit;
  const walletLitresLimit = data?.walletLitresLimit;
  const accountLitresLimit = data?.accountLitresLimit;
  return {
    gracePeriod,
    exchangeGracePeriod,
    purchaseMaxLitres,
    withdrawalMaxAmount,
    withdrawalAmountMultiple,
    paymentInStoreLimit,
    walletLitresLimit,
    accountLitresLimit,
    loading, refetch
  };
};

export default useParameters;
