import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { RefuelContext } from '../contexts/refuel.context';
import { useContext } from 'react';

export interface IConsumeFuelRequest {
  fuelTypeId: number;
  pumpId: number;
}

export interface IConsumeFuelResult {
  refuel: {
    refuel: {
      id: string;
      authorization: {
        id: string;
      };
    };
  };
}

const CONSUME_FUEL_MUTATION = gql`
  mutation refuel($fuelTypeId: ID!, $pumpId: ID!) {
    refuel(data: {fuelTypeId: $fuelTypeId, pumpId: $pumpId}) {
      refuel {
        id
        authorization {
          id
        }
      }
    }
  }
`;

const useRefuel = () => {
  const [execute, { loading, data, error }] = useMutation<IConsumeFuelResult>(
    CONSUME_FUEL_MUTATION,
  );
  const [refuel, _] = useContext(RefuelContext);

  const executeRefuel = () => {
    execute({
      variables: {
        fuelTypeId: refuel.wallet?.fuelType.id,
        pumpId: refuel.operation?.id,
      },
    });
  };

  const operationId = data?.refuel.refuel.id;
  const authorizationId = data?.refuel.refuel.authorization.id;
  return { operationId, authorizationId, loading, error, executeRefuel };
};

export default useRefuel;
