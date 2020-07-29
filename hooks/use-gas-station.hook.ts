import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { IGasStationModel } from '../models/gas-station.model';


export interface IGasStationsResult {
  gasStations: {
    result: IGasStationModel[];
  };
}

const GAS_STATIONS_QUERY = gql`
  query getGasStations($filter: String!) {
      gasStations(criteria: { filter: $filter }) {
          result {
              id
              name
              purchaseRequireAuthorization
          }
      }
  }
`;

const useGasStation = (id: number) => {
  const { data, loading, error } = useQuery<IGasStationsResult>(
    GAS_STATIONS_QUERY,
    {
      variables: {
        filter: JSON.stringify({
          type: 'eq',
          property: 'id',
          value: id,
        }),
      },
    },
  );

  const gasStation = data?.gasStations.result[0] ?? null;
  return { loading, error, gasStation };
};

export default useGasStation;
