import { IFuelPriceModel } from './../models/fuel-price.model';
import { gql } from 'apollo-boost';
import { IPageInfoModel } from '../models/page-info.model';
import { IFuelTypeModel } from '../models/fuel-type.model';
import { useContext } from 'react';
import { SecurityContext } from '../contexts/security.context';
import { useQuery } from '@apollo/react-hooks';
import { IGasStationModel } from '../models/gas-station.model';
import crashlytics from '@react-native-firebase/crashlytics';

export type LastPumpOperationRecord = {
  id: string;
  gasStation: Pick<IGasStationModel, 'id' | 'name' | 'purchaseRequireAuthorization'>;
  externalId: string;
  lastExternalOperation: {
    fuelType: Pick<IFuelTypeModel, 'id' | 'name'> & {
      currentPrice: Pick<IFuelPriceModel, 'id' | 'price'>;
    };
    litres: number;
    stamp: Date;
  };
};

export interface ILastOperationResult {
  pumps: {
    result: LastPumpOperationRecord[];
  };
}

const PUMP_LAST_OPERATION_QUERY = gql`
  query getPumpWithLastOperation($filter: String!) {
    pumps(criteria: {filter: $filter}) {
      result {
        id
        gasStation {
          id
          name
          purchaseRequireAuthorization
        }
        externalId
        lastExternalOperation {
          fuelType {
            name
            id
            currentPrice {
              id
              price
            }
          }
          litres
          stamp
        }
      }
    }
  }
`;

const usePumpWithLastOperation = (pumpId: number) => {
  const { data, loading, error } = useQuery<ILastOperationResult>(
    PUMP_LAST_OPERATION_QUERY,
    {
      variables: {
        filter: JSON.stringify({
          type: 'eq',
          property: 'id',
          value: pumpId,
        }),
      },
      fetchPolicy: "no-cache"
    },
  );
  if (error) {
    crashlytics().recordError(error);
    throw error;
  }
  const pump = data?.pumps.result[0] ?? null;
  return { loading, pump };
};

export default usePumpWithLastOperation;
