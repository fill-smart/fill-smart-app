import React, { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import MovementDetail from '../../components/movement-detail.component';
import { useNavigationParam, useNavigation } from 'react-navigation-hooks';
import Button from '../../components/button.component';
import PaymentMethodChangeCard from '../../components/payment-method-change-card.component';
import { getRoutePath, HOME_ROUTE } from '../../routing/routes';
import ShowStatusBarLayout from '../../layouts/show-status-bar.layout';
import OperationType from '../../models/operation-type.enum';
import { PaymentInStoreContext } from '../../contexts/payment-in-store.context';
import usePaymentInStore from '../../hooks/use-payment-in-store.hook';
import styled from 'styled-components/native';
import PaymentInStoreConfirmCard from './payment-in-store-confirm-card.component';
import moment from 'moment';
import { StackNavigationProp } from 'react-navigation-stack/lib/typescript/src/vendor/types';
import { NavigationActions } from 'react-navigation';
import ErrorPage from '../error-page';
import crashlytics from '@react-native-firebase/crashlytics';
import Loader from '../../components/loader.component';

const Container = styled.View`
    padding: 25px;
    flex: 1;
    justify-content: space-between;
`;

const PaymentInStoreConfirmPaymentMethodPage = () => {
    const navigation = useNavigation() as StackNavigationProp;
    const [paymentCtx, _] = useContext(PaymentInStoreContext);
    const { loading, executePaymentInStore, operationId, authorizationId, error } = usePaymentInStore();
    const [waitExecute, setWaiExecute] = useState(false);

    useEffect(() => {
        if (operationId) {
            navigation.reset([
                NavigationActions.navigate({ routeName: getRoutePath(HOME_ROUTE.Home, HOME_ROUTE) }),
                NavigationActions.navigate({ routeName: getRoutePath(HOME_ROUTE.PaymentInStoreVerifyDni, HOME_ROUTE), params: { operationId: operationId, authorizationId: authorizationId } })
            ], 1);
            // navigation.navigate(
            //     getRoutePath(HOME_ROUTE.PaymentInStoreVerifyDni, HOME_ROUTE),
            //     { operationId: operationId, authorizationId: authorizationId }
            // );
        }
    }, [operationId]);

    const goBack = () => {
        navigation.goBack();
    };

    const goWaitVerifyDni = () => {
        setWaiExecute(true);
        executePaymentInStore();
    };

    if (!paymentCtx || !paymentCtx.amount) {
        return null;
    }

    if (loading || waitExecute) {
        return <Loader />;
    }

    if (error) {
        crashlytics().recordError(error);
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
                    <PaymentInStoreConfirmCard
                        amount={paymentCtx.amount!}
                        gasStation={paymentCtx.gasStation?.name!}
                        stamp={moment().toDate()}
                    />
                    <View style={{ marginBottom: 25 }} />
                    <PaymentMethodChangeCard title={paymentCtx.wallet?.fuelType.name!} onPress={goBack} />
                </View>
                <Button label="Finalizar" onPress={goWaitVerifyDni} loading={loading} />
            </Container>
        </ShowStatusBarLayout>
    );


};

PaymentInStoreConfirmPaymentMethodPage.navigationOptions = {
    title: 'Pagar',
};

export default PaymentInStoreConfirmPaymentMethodPage;