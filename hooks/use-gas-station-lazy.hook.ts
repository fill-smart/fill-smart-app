import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { IGasStationModel } from '../models/gas-station.model';
import { useState, useEffect } from 'react';


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

const useGasStationLazy = () => {
  const [gasStationId, setGasStationId] = useState<string>();
  const [execute, { data, loading, error, refetch }] = useLazyQuery<IGasStationsResult>(
    GAS_STATIONS_QUERY,
    {
      variables: {
        filter: JSON.stringify({
          type: 'eq',
          property: 'id',
          value: gasStationId,
        }),
      },
    },
  );

  useEffect(() => {
    if (gasStationId) {
      execute();
    }
  }, [gasStationId])


  const gasStation = data?.gasStations.result[0] ?? null;
  return { loading, error, gasStation, setGasStationId };
};

export default useGasStationLazy;
