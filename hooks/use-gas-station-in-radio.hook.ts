import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { IGasStationModel } from '../models/gas-station.model';
import { useState, useEffect } from 'react';


export interface IGasStationInRadioResult {
    isGasStationInRadio: boolean;
}

const IS_GAS_STATION_IN_RADIO_QUERY = gql`
  query isGasStationInRadio($lat: Float!, $lng: Float!, $distance: Int!,) {
    isGasStationInRadio(lat:$lat, lng:$lng, distance: $distance )
  }
`;

const useGasStationInRadio = () => {
    const [execute, { data, loading, error, refetch }] = useLazyQuery<IGasStationInRadioResult>(
        IS_GAS_STATION_IN_RADIO_QUERY
    );

    const executeQuery = (lat: number, lng: number, distance: number) => {
        execute(
            {
                variables: {
                    lat: lat,
                    lng: lng,
                    distance: distance
                },
            });
    }

    return { loading, error, data, executeQuery };
};

export default useGasStationInRadio;
