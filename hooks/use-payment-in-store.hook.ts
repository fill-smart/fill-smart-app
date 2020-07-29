import {gql} from 'apollo-boost';
import {useMutation} from '@apollo/react-hooks';
import {useContext} from 'react';
import {WithdrawalContext} from '../contexts/withdrawal.context';
import {PaymentInStoreContext} from '../contexts/payment-in-store.context';

export interface IShopPurchaseRequest {
  fuelTypeId: number;
  amount: number;
  gasStationId: number;
}

export interface IShopPurchaseResult {
  shopPurchase: {
    shopPurchase: {
      id: string;
      authorization: {
        id: string;
      };
    };
  };
}

const PAYMENT_IN_STORE_MUTATION = gql`
  mutation shopPurchase($fuelTypeId: ID!, $amount: Int!, $gasStationId: ID!) {
    shopPurchase(
      data: {
        fuelTypeId: $fuelTypeId
        amount: $amount
        gasStationId: $gasStationId
      }
    ) {
      shopPurchase {
        id
        authorization {
          id
        }
      }
    }
  }
`;

const usePaymentInStore = () => {
  const [execute, {loading, data, error}] = useMutation<IShopPurchaseResult>(
    PAYMENT_IN_STORE_MUTATION,
  );
  const [paymentCtx, _] = useContext(PaymentInStoreContext);

  const executePaymentInStore = () => {
    const variables = {
      fuelTypeId: paymentCtx.wallet?.fuelType.id,
      amount: paymentCtx.amount!,
      gasStationId: paymentCtx.gasStation?.id,
    };

    execute({
      variables: variables,
    });
  };

  const operationId = data?.shopPurchase.shopPurchase.id;
  const authorizationId = data?.shopPurchase.shopPurchase.authorization.id;
  return {operationId, authorizationId, loading, error, executePaymentInStore};
};

export default usePaymentInStore;
