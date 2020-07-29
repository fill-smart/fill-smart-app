import {IFuelPriceModel} from './../models/fuel-price.model';
import {useQuery} from '@apollo/react-hooks';
import {gql} from 'apollo-boost';
import {IPageInfoModel} from './../models/page-info.model';
import {IFuelTypeModel} from './../models/fuel-type.model';
import moment from 'moment';

export type FuelTypeWithPricesRecord = Pick<
  IFuelTypeModel,
  'id' | 'name' | 'currentPrice' | 'previousPrice'
>;

export type FuelPriceVariationType = 'equals' | 'increase' | 'decrease';

export interface IFuelTypePriceWithVariation {
  id: string;
  name: string;
  price: number;
  priceVariationType: FuelPriceVariationType;
}

export interface IFuelTypeWithPricesResult {
  fuelTypes: {
    result: FuelTypeWithPricesRecord[];
  };
}

const FUEL_TYPE_WITH_PRICES_QUERY = gql`
  query getFuelTypeWithPrices {
    fuelTypes {
      result {
        id
        name
        currentPrice {
          id
          price
          from
          to
        }
        previousPrice {
          id
          price
          from
          to
        }
      }
    }
  }
`;

export const analyzeVariation = (
  current: IFuelPriceModel,
  previous: IFuelPriceModel,
): FuelPriceVariationType => {
  const previousHasChangedSinceLastWeek =
    moment(previous.to) >
    moment()
      .subtract(7, 'days')
      .endOf('day');
  if (!previousHasChangedSinceLastWeek) {
    return 'equals';
  } else if (previous.price > current.price) {
    return 'decrease';
  } else if (previous.price < current.price) {
    return 'increase';
  } else {
    return 'equals';
  }
};

const useFuelPriceVariations = () => {
  const {data, loading, error, refetch} = useQuery<IFuelTypeWithPricesResult>(
    FUEL_TYPE_WITH_PRICES_QUERY, {
      fetchPolicy: 'cache-and-network'
    }
  );
  const fuelTypesWithPrices = data?.fuelTypes.result?.map(
    type =>
      <IFuelTypePriceWithVariation>{
        id: type.id,
        price: type.currentPrice.price,
        name: type.name,
        priceVariationType: analyzeVariation(
          type.currentPrice,
          type.previousPrice,
        ),
      },
  );
  return {loading, fuelTypesWithPrices, error, refetch};
};

export default useFuelPriceVariations;
