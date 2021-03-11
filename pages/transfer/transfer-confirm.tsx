import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import Button from '../../components/button.component';
import PaymentMethodChangeCard from '../../components/payment-method-change-card.component';
import { getRoutePath, HOME_ROUTE } from '../../routing/routes';
import ShowStatusBarLayout from '../../layouts/show-status-bar.layout';
import styled from 'styled-components/native';
import moment from 'moment';
import ErrorPage from '../error-page';
import { NavigationActions } from 'react-navigation';
import { StackNavigationProp } from 'react-navigation-stack/lib/typescript/src/vendor/types';
import crashlytics from '@react-native-firebase/crashlytics';
import Loader from '../../components/loader.component';
import { TransferContext } from '../../contexts/transfer.context';
import useTransfer from '../../hooks/use-transfer.hook';
import TransferConfirmCard from './transfer-confirm-card.component';
import OperationTimeExceededModal from '../../components/operation-time-exceeded.modal.component';
import { ApolloError } from 'apollo-boost';


const Container = styled.View`
    padding: 25px;
    flex: 1;
    justify-content: space-between;
`;

const TransferConfirmPage = () => {
    const navigation = useNavigation() as StackNavigationProp;
    const [transferCtx, _] = useContext(TransferContext);
    const {operationId, loading, error, executeTransfer} = useTransfer();
    const [waitExecute, setWaitExecute] = useState(false);

    useEffect(() => {
        if (operationId) {
            navigation.reset([
                NavigationActions.navigate({ routeName: getRoutePath(HOME_ROUTE.Home, HOME_ROUTE) }),
                NavigationActions.navigate({ routeName: getRoutePath(HOME_ROUTE.TransferOperationComplete, HOME_ROUTE), params: { operationId: operationId } })
            ], 1);
        }
    }, [operationId]);

    const goBack = () => {
        navigation.navigate(getRoutePath(HOME_ROUTE.TransferAmountSelection, HOME_ROUTE));
    };

    const goOperationComplete = () => {
        setWaitExecute(true);
        executeTransfer();
    };

    if (error) {
        crashlytics().recordError(error);
        return (<ErrorPage
            buttonLabel="Aceptar"
            errorMsg="Ocurrió un error inesperado"
            descriptionMsg="Es posible que se hayan superado los límites de litros permitidos. Por favor intente nuevamente."
            onPress={goBack} />);
    }

    if (loading || waitExecute) {
        return <Loader />;
    }

    return (
        <ShowStatusBarLayout>
            <Container>
                <View>
                    <TransferConfirmCard
                        amount={transferCtx.litres!}
                        selectedCustomer={transferCtx.selectedCustomer!}
                        stamp={moment().toDate()}
                        walletName={transferCtx.fuelType?.name!}
                    />
                    <View style={{ marginBottom: 25 }} />
                    <PaymentMethodChangeCard title={transferCtx.fuelType?.name!} onPress={goBack} label="Cambiar billetera"/>
                </View>
                <Button label="Finalizar" onPress={goOperationComplete} loading={loading} />
            </Container>
        </ShowStatusBarLayout>
    );
};

TransferConfirmPage.navigationOptions = {
    title: 'Transferir litros',
};

export default TransferConfirmPage;