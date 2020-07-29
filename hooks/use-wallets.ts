import { gql } from 'apollo-boost';
import { IPageInfoModel } from '../models/page-info.model';
import { IFuelTypeModel } from '../models/fuel-type.model';
import { useContext, useEffect } from 'react';
import { SecurityContext, SECURITY_ACTIONS } from '../contexts/security.context';
import { useQuery } from '@apollo/react-hooks';

export type WalletRecord = {
  id: string;
  fuelType: Pick<IFuelTypeModel, 'id' | 'name' | 'currentPrice'>;
  litres: number;
  availableLitres: number;
};

export interface IWalletsResult {
  wallets: {
    pageInfo: Pick<IPageInfoModel, 'total'>;
    result: WalletRecord[];
  };
}

const WALLETS_QUERY = gql`
  query getWallets($maxRecords: Int!, $filter: String!) {
    wallets(criteria: {max: $maxRecords, filter: $filter}) {
      pageInfo {
        total
      }
      result {
        id
        litres
        availableLitres
        fuelType {
          id
          name
          currentPrice {
            id
            price
          }
        }
      }
    }
  }
`;

const useWallets = (pageSize: number = 10) => {
  const [state, dispatch] = useContext(SecurityContext);

  const { data, loading, error, refetch } = useQuery<IWalletsResult>(
    WALLETS_QUERY,
    {
      variables: {
        maxRecords: pageSize,
        filter: JSON.stringify({
          type: 'eq',
          property: 'customer.user.id',
          value: state.user?.id,
        }),
      },
      fetchPolicy: 'cache-and-network'
    },
  );

  useEffect(() => {
    if (data) {
      dispatch({
        type: SECURITY_ACTIONS.SET_HAS_AVAILABLE_LITRES,
        payload: data.wallets.result.filter(x => x.availableLitres > 0).length > 0
      });
    }
  }, [data]);

  const total = data?.wallets.pageInfo.total;
  const wallets = data?.wallets.result;
  return { wallets, total, loading, error, refetch };
};

export default useWallets;
