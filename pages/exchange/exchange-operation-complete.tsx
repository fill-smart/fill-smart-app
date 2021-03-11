import React, { useContext, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import OperationCompleteCard from '../../components/operation-complete-card.component';
import ShowStatusBarLayout from '../../layouts/show-status-bar.layout';
import OperationType from '../../models/operation-type.enum';
import { ExchangeWalletContext, EXCHANGE_WALLET_ACTIONS } from '../../contexts/exchange-wallets.context';
import { useNavigationParam, useNavigation } from 'react-navigation-hooks';
import useWallets from '../../hooks/use-wallets';
import { StackActions, NavigationActions } from 'react-navigation';
import { getRoutePath, HOME_ROUTE, APP_ROUTES } from '../../routing/routes';


const styles = StyleSheet.create({
    container: {
        padding: 25,
    },
});

const ExchangeOperationCompletePage = () => {
    const navigation = useNavigation();
    const [_, dispatch] = useContext(ExchangeWalletContext);
    const receiptId:string = useNavigationParam("receiptId");
    const title:string =  useNavigationParam("title");

    const finish = () => {
        dispatch({ type: EXCHANGE_WALLET_ACTIONS.CLEAN_STORE });
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

    return (
        <ShowStatusBarLayout>
            <View style={styles.container}>
                <OperationCompleteCard exchange={title} operation={receiptId.padStart(8,"0")} type={OperationType.Exchange} onPress={finish}/>
            </View>
        </ShowStatusBarLayout>
    );
};

ExchangeOperationCompletePage.navigationOptions = {              
    title: 'Canjear',    
  };

export default ExchangeOperationCompletePage;