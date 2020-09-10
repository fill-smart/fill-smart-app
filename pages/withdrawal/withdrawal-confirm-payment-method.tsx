import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import Button from '../../components/button.component';
import PaymentMethodChangeCard from '../../components/payment-method-change-card.component';
import { getRoutePath, HOME_ROUTE } from '../../routing/routes';
import ShowStatusBarLayout from '../../layouts/show-status-bar.layout';
import styled from 'styled-components/native';
import WithdrawalConfirmCard from './withdrawal-confirm-card.component';
import { WithdrawalContext } from '../../contexts/withdrawal.context';
import moment from 'moment';
import useWithdrawal from '../../hooks/use-withdrawal.hook';
import ErrorPage from '../error-page';
import { NavigationActions } from 'react-navigation';
import { StackNavigationProp } from 'react-navigation-stack/lib/typescript/src/vendor/types';
import crashlytics from '@react-native-firebase/crashlytics';
import Loader from '../../components/loader.component';
import { WithdrawalType } from '../../models/withdrawal-enums';
import useWithdrawalByTransfer from '../../hooks/use-withdrawal-by-transfer.hook';


const Container = styled.View`
    padding: 25px;
    flex: 1;
    justify-content: space-between;
`;

const WithdrawalConfirmPaymentMethodPage = () => {
    const navigation = useNavigation() as StackNavigationProp;
    const [withdrawalContext, _] = useContext(WithdrawalContext);
    const { loading: loadingCash, executeWithdrawal, operationId: operationIdCash, authorizationId, error: errorCash } = useWithdrawal();
    const { loading: loadingTransfer, executeWithdrawalByTransfer, operationId: operationIdTransfer, error: errorTransfer } = useWithdrawalByTransfer();
    const [waitExecute, setWaitExecute] = useState(false);

    useEffect(() => {
        if (operationIdCash) {
            navigation.reset([
                NavigationActions.navigate({ routeName: getRoutePath(HOME_ROUTE.Home, HOME_ROUTE) }),
                NavigationActions.navigate({ routeName: getRoutePath(HOME_ROUTE.WithdrawalVerifyDni, HOME_ROUTE), params: { operationId: operationIdCash, authorizationId: authorizationId } })
            ], 1);
        }
    }, [operationIdCash]);

    useEffect(() => {
        if (operationIdTransfer) {
            navigation.reset([
                NavigationActions.navigate({ routeName: getRoutePath(HOME_ROUTE.Home, HOME_ROUTE) }),
                NavigationActions.navigate({ routeName: getRoutePath(HOME_ROUTE.WithdrawalOperationComplete, HOME_ROUTE), params: { operationId: operationIdTransfer } })
            ], 1);
        }
    }, [operationIdTransfer]);

    const goBack = () => {
        navigation.navigate(getRoutePath(HOME_ROUTE.WithdrawalFuelSelection, HOME_ROUTE));
    };

    const goWaitVerifyDni = () => {
        setWaitExecute(true);
        executeWithdrawal();
    };

    const goOperationComplete = () => {
        setWaitExecute(true);
        executeWithdrawalByTransfer();
    };

    if (!withdrawalContext || !withdrawalContext.amount) {
        return null;
    }

    if (loadingCash || loadingTransfer || waitExecute) {
        return <Loader />;
    }

    if (errorCash) {
        crashlytics().recordError(errorCash);
        return (<ErrorPage
            buttonLabel="Aceptar"
            errorMsg="Ocurrió un error inesperado"
            descriptionMsg="Por favor intente nuevamente"
            onPress={goBack} />);
    }

    if (errorTransfer) {
        crashlytics().recordError(errorTransfer);
        return (<ErrorPage
            buttonLabel="Aceptar"
            errorMsg="Ocurrió un error inesperado"
            descriptionMsg="Por favor intente nuevamente"
            onPress={goBack} />);
    }

    return (
        <ShowStatusBarLayout>
            <Container>
                <View>
                    <WithdrawalConfirmCard
                        amount={withdrawalContext.amount!}
                        gasStation={withdrawalContext.gasStation?.name!}
                        stamp={moment().toDate()}
                        accountType={withdrawalContext.transferAccount}
                    />
                    <View style={{ marginBottom: 25 }} />
                    <PaymentMethodChangeCard title={withdrawalContext.wallet?.fuelType.name!} onPress={goBack} />
                </View>
                <Button label="Finalizar" onPress={withdrawalContext.type === WithdrawalType.Cash ? goWaitVerifyDni : goOperationComplete} loading={loadingCash || loadingTransfer} />
            </Container>
        </ShowStatusBarLayout>
    );
};

WithdrawalConfirmPaymentMethodPage.navigationOptions = {
    title: 'Retirar fondos',
};

export default WithdrawalConfirmPaymentMethodPage;