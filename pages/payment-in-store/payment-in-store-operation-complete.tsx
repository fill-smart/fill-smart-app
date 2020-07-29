import React, { useContext, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import OperationCompleteCard from '../../components/operation-complete-card.component';
import ShowStatusBarLayout from '../../layouts/show-status-bar.layout';
import OperationType from '../../models/operation-type.enum';
import { useNavigationParam, useNavigation } from 'react-navigation-hooks';
import { StackActions, NavigationActions } from 'react-navigation';
import { getRoutePath, HOME_ROUTE, APP_ROUTES } from '../../routing/routes';
import useOperations from '../../hooks/use-operations';
import { PaymentInStoreContext, PAYMENT_IN_STORE_ACTIONS } from '../../contexts/payment-in-store.context';
import useWallets from '../../hooks/use-wallets';
import { operationsRefetch } from '../home/home';

const styles = StyleSheet.create({
    container: {
        padding: 25,
    },
});

const PaymentInStoreOperationCompletePage = () => {
    const navigation = useNavigation();
    const [paymentCtx, dispatch] = useContext(PaymentInStoreContext);
    const walletsHook = useWallets();
    const operationId = useNavigationParam("operationId");

    useEffect(() => {
        walletsHook.refetch();
        operationsRefetch();
    }, []);

    const finish = () => {
        dispatch({ type: PAYMENT_IN_STORE_ACTIONS.CLEAN_STORE });
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({
                    routeName: getRoutePath(APP_ROUTES.Main, APP_ROUTES),
                }),
            ],
        });
        navigation.dispatch(resetAction);        
    }

    if(!paymentCtx || !paymentCtx.amount) {
        return null;
    }

    return (
        <ShowStatusBarLayout>
            <View style={styles.container}>
                <OperationCompleteCard operation={operationId.padStart(8, "0")} value={paymentCtx.amount!} type={OperationType.PaymentInStore} onPress={finish}/>             
            </View>
        </ShowStatusBarLayout>
    );
};

PaymentInStoreOperationCompletePage.navigationOptions = {              
    title: 'Pagar en tienda',    
  };


export default PaymentInStoreOperationCompletePage;





