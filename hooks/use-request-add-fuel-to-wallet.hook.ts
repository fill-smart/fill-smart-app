import {PurchaseFuelContext} from './../contexts/purchase-fuel.context';
import {useMutation} from '@apollo/react-hooks';
import {gql} from 'apollo-boost';
import {IPurchaseModel} from 'models/purchase.model';
import {useContext} from 'react';

export interface IRequestAddFuelToWalletRecord {
  purchase: Pick<IPurchaseModel, 'id' | 'preferenceId' | 'preferenceUrl' | 'authorization'>;
}

export interface IRequestAddFuelToWalletResult {
  requestAddFuelToWallet: IRequestAddFuelToWalletRecord;
}

const REQUEST_ADD_FUEL_MUTATION = gql`
  mutation requestAddFuelToWallet(
    $fuelTypeId: ID!
    $litres: Float!
    $paymentMethod: PaymentMethods!
    $gasStationId: ID
  ) {
    requestAddFuelToWallet(
      data: {
        fuelTypeId: $fuelTypeId
        litres: $litres
        paymentMethod: $paymentMethod
        gasStationId: $gasStationId
      }
    ) {
      purchase {
        id
        preferenceId
        preferenceUrl
        authorization {
          id
        }
      }
    }
  }
`;

const useRequestAddFuelToWallet = () => {
  const [execute, {loading, data, error}] = useMutation<
    IRequestAddFuelToWalletResult
  >(REQUEST_ADD_FUEL_MUTATION);

  const [requestData, _] = useContext(PurchaseFuelContext);
  const paymentMethod = requestData.paymentMethod;
  const sendRequest = (gasStationId: string | null = null) => {
    execute({
      variables: {
        fuelTypeId: requestData.purchaseFuelAndQuantity?.fuelType.id!,
        litres: requestData.purchaseFuelAndQuantity?.litres!,
        paymentMethod,
        gasStationId
      },
    });
  };

  const purchase = data?.requestAddFuelToWallet.purchase;
  return {purchase, loading, sendRequest, error};
};

export default useRequestAddFuelToWallet;
