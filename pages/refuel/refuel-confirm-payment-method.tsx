import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigationParam, useNavigation } from 'react-navigation-hooks';
import Button from '../../components/button.component';
import PaymentMethodChangeCard from '../../components/payment-method-change-card.component';
import { getRoutePath, HOME_ROUTE } from '../../routing/routes';
import ShowStatusBarLayout from '../../layouts/show-status-bar.layout';
import { RefuelContext } from '../../contexts/refuel.context';
import RefuelConfirmCard from './refuel-confirm-card.component';
import useRefuel from '../../hooks/use-refuel.hooks';
import ErrorPage from '../error-page';
import { NavigationActions, StackActions, NavigationSetParamsAction } from 'react-navigation';
import { StackNavigationProp } from 'react-navigation-stack/lib/typescript/src/vendor/types';
import useGasStationLazy from '../../hooks/use-gas-station-lazy.hook';
import Loader from '../../components/loader.component';
import crashlytics from '@react-native-firebase/crashlytics';

const styles = StyleSheet.create({
    container: {
        padding: 25,
        flex: 1,
        justifyContent: "space-between",
    },
});

const RefuelConfirmPaymentMethodPage = () => {
    const navigation = useNavigation() as StackNavigationProp;
    const [refuelState, _] = useContext(RefuelContext);
    const { operationId, authorizationId, loading, error, executeRefuel } = useRefuel();
    const [waitExecute, setWaiExecute] = useState(false);

    useEffect(() => {
        if (operationId) {
            if (refuelState.operation?.gasStation.purchaseRequireAuthorization) {
                navigation.reset([
                    NavigationActions.navigate({ routeName: getRoutePath(HOME_ROUTE.Home, HOME_ROUTE) }),
                    NavigationActions.navigate({ routeName: getRoutePath(HOME_ROUTE.RefuelVerifyDni, HOME_ROUTE), params: { operationId: operationId, pumpId: refuelState.operation?.id!, authorizationId: authorizationId } })
                ], 1);
            }
            else {
                navigation.reset([
                    NavigationActions.navigate({ routeName: getRoutePath(HOME_ROUTE.Home, HOME_ROUTE) }),
                    NavigationActions.navigate({ routeName: getRoutePath(HOME_ROUTE.RefuelOperationComplete, HOME_ROUTE), params: { operationId: operationId, pumpId: refuelState.operation?.id!, authorizationId: authorizationId } })
                ], 1);
            }
        }
    }, [operationId])

    const goBack = () => {
        navigation.goBack();
    };

    const goWaitVerifyDni = () => {
        setWaiExecute(true);
        executeRefuel();
    };

    if (loading || waitExecute) {
        return (<Loader />);
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
            <View style={styles.container}>
                <View>
                    {refuelState.operation && refuelState.wallet && <RefuelConfirmCard operation={refuelState.operation} wallet={refuelState.wallet} />}
                    <View style={{ marginBottom: 25 }} />
                    {refuelState.wallet && <PaymentMethodChangeCard title={refuelState.wallet?.fuelType.name} onPress={goBack} />}
                </View>
                <Button label="Finalizar" onPress={goWaitVerifyDni} loading={loading} />
            </View>
        </ShowStatusBarLayout>
    );
};

RefuelConfirmPaymentMethodPage.navigationOptions = {
    title: 'Cargar',
};

export default RefuelConfirmPaymentMethodPage;