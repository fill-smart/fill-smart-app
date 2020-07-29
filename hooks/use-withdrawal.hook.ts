import {gql} from 'apollo-boost';
import {useMutation} from '@apollo/react-hooks';
import {useContext} from 'react';
import { WithdrawalContext } from '../contexts/withdrawal.context';

export interface IWithdrawalRequest {
    fuelTypeId: number;
    amount: number;
    gasStationId: number;
}

export interface IWithdrawalResult {
  withdrawal: {
    withdrawal: {
      id: string;
      authorization: {
        id: string;
      };
    };
  };
}

const WITHDRAWAL_MUTATION = gql`
  mutation withdrawal($fuelTypeId: ID!, $amount: Int!, $gasStationId: ID!) {
    withdrawal(data: {fuelTypeId: $fuelTypeId, amount: $amount, gasStationId: $gasStationId}) {
      withdrawal{
        id
        authorization {
          id
        }
      }
    }
  }
`;

const useWithdrawal = () => {
  const [execute, {loading, data, error}] = useMutation<IWithdrawalResult>(
    WITHDRAWAL_MUTATION,
  );
  const [withdrawalContext, _] = useContext(WithdrawalContext);

  const executeWithdrawal = () => {
    execute({
      variables: {
          fuelTypeId: withdrawalContext.wallet?.fuelType.id,
          amount: withdrawalContext.amount!,
          gasStationId: withdrawalContext.gasStation?.id,
      },
    });
  };

  const operationId = data?.withdrawal.withdrawal.id;
  const authorizationId = data?.withdrawal.withdrawal.authorization.id;
  return {operationId, authorizationId, loading, error, executeWithdrawal};
};

export default useWithdrawal;
