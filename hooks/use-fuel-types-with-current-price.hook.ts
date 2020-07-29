import {IFuelPriceModel} from './../models/fuel-price.model';
import {useQuery} from '@apollo/react-hooks';
import {gql} from 'apollo-boost';
import {IPageInfoModel} from './../models/page-info.model';
import {IFuelTypeModel} from './../models/fuel-type.model';
import moment from 'moment';

export type FuelTypeWithCurrentPriceRecord = Pick<IFuelTypeModel, 'id' | 'name'> & {
  currentPrice: Pick<IFuelPriceModel, 'id' | 'price'>;
};

export interface IFuelTypeWithPricesResult {
  fuelTypes: {
    result: FuelTypeWithCurrentPriceRecord[];
  };
}

const FUEL_TYPE_WITH_CURRENT_PRICE_QUERY = gql`
  query getFuelTypeWithCurrentPrice {
    fuelTypes {
      result {
        id
        name
        currentPrice {
          id
          price
        }
      }
    }
  }
`;

const useFuelTypesWithCurrentPrice = () => {
  const {data, loading, error, refetch} = useQuery<IFuelTypeWithPricesResult>(
    FUEL_TYPE_WITH_CURRENT_PRICE_QUERY,
  );
  const fuelTypes = data?.fuelTypes.result;
  return {loading, fuelTypes, refetch};
};

export default useFuelTypesWithCurrentPrice;
