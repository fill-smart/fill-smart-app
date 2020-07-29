import {gql} from 'apollo-boost';
import {useMutation} from '@apollo/react-hooks';
import {useContext} from 'react';
import { WithdrawalContext } from '../contexts/withdrawal.context';
import { TransferAccountType } from '../models/withdrawal-enums';

export interface IWithdrawalByTransferRequest {
    fuelTypeId: number;
    amount: number;
    accountType: string;
}

export interface IWithdrawalByTransferResult {
  transferWithdrawal: {
    withdrawal: {
      id: string;
    };
  };
}

const WITHDRAWAL_BY_TRANSFER_MUTATION = gql`
  mutation withdrawal($fuelTypeId: ID!, $amount: Int!, $accountType: String!) {
    transferWithdrawal(data: {fuelTypeId: $fuelTypeId, amount: $amount, accountType: $accountType}) {
      withdrawal{
        id
      }
    }
  }
`;

const useWithdrawalByTransfer = () => {
  const [execute, {loading, data, error}] = useMutation<IWithdrawalByTransferResult>(
    WITHDRAWAL_BY_TRANSFER_MUTATION,
  );
  const [withdrawalContext, _] = useContext(WithdrawalContext);

  const executeWithdrawalByTransfer = () => {
    execute({
      variables: {
          fuelTypeId: withdrawalContext.wallet?.fuelType.id,
          amount: withdrawalContext.amount!,
          accountType: withdrawalContext.transferAccount!
      },
    });
  };

  const operationId = data?.transferWithdrawal.withdrawal.id;
  return {operationId, loading, error, executeWithdrawalByTransfer};
};

export default useWithdrawalByTransfer;
