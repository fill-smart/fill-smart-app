import {gql} from 'apollo-boost';
import {useMutation} from '@apollo/react-hooks';
import {useContext} from 'react';
import { TransferContext } from '../contexts/transfer.context';

export interface ITransferRequest {
  fuelTypeId: number;
  targetCustomerId: number;
  targetLitres: number;
}

export interface ITransferResult {
  transfer: {
    transfer: {
      id: string;
    }
  };
}

const TRANSFER_MUTATION = gql`
  mutation transfer($fuelTypeId: ID!, $targetLitres: Float!, $targetCustomerId: ID!) {
    transfer(data: {fuelTypeId: $fuelTypeId, targetLitres: $targetLitres, targetCustomerId: $targetCustomerId}) {
      transfer {
        id
      }
    }
  }
`;

const useTransfer = () => {
  const [execute, {loading, data, error}] = useMutation<ITransferResult>(
    TRANSFER_MUTATION,
  );
  const [transferCtx, _] = useContext(TransferContext);

  const executeTransfer = () => {
    execute({
      variables: {
          fuelTypeId: transferCtx.fuelType?.id,
          targetLitres: transferCtx.litres,
          targetCustomerId: transferCtx.selectedCustomer?.id,
      },
    });
  };

  const operationId = data?.transfer.transfer.id;
  return {operationId, loading, error, executeTransfer};
};

export default useTransfer;
