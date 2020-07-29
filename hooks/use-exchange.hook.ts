import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { useContext } from 'react';
import { ExchangeWalletContext } from '../contexts/exchange-wallets.context';

export interface IExchangeFuelRequest {
    sourceFuelTypeId: number;
    targetFuelTypeId: number;
    sourceLitres: number;
}

export interface IExchangeFuelResult {
    exchangeFuel: {
        ok: boolean;
        receiptId: number;
    }
}

const EXCHANGE_FUEL_MUTATION = gql`
    mutation exchange(
        $sourceFuelTypeId: ID!
        $targetFuelTypeId: ID!
        $sourceLitres: Float!
        ) {
        exchangeFuel(
            data: {
            sourceFuelTypeId: $sourceFuelTypeId
            targetFuelTypeId: $targetFuelTypeId
            sourceLitres: $sourceLitres
            }
        ) {
            ok
            receiptId
        }
    }
`;

const useExchange = () => {
    const [execute, { loading, data, error }] = useMutation<IExchangeFuelResult>(
        EXCHANGE_FUEL_MUTATION,
    );
    const [exchange, _] = useContext(ExchangeWalletContext);

    const executeExchange = () => {
        execute({
            variables: {
                sourceFuelTypeId: exchange.sourceFuelType?.id,
                targetFuelTypeId: exchange.targetFuelType?.id,
                sourceLitres: exchange.sourceLitres
            },
        });
    };

    const receiptId = data?.exchangeFuel.receiptId;

    return { receiptId, loading, error, executeExchange };
};

export default useExchange;
