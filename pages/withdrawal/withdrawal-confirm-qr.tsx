import React, { useContext, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import ShowStatusBarLayout from '../../layouts/show-status-bar.layout';
import ConfirmQrCard from '../../components/confirm-qr-card.component';
import OperationType from '../../models/operation-type.enum';
import { useNavigation } from 'react-navigation-hooks';
import { getRoutePath, HOME_ROUTE } from '../../routing/routes';
import { WithdrawalContext, WITHDRAWAL_ACTIONS } from '../../contexts/withdrawal.context';

const styles = StyleSheet.create({
    container: {
        padding: 25,
    },
});

const WithdrawalConfirmQrPage = () => {
    const navigation = useNavigation();
    const [_, dispatch] = useContext(WithdrawalContext);

    //TODO Retrieve the real data
    const amount = 1500;
    const location = "Estación Chango - YPF";
    const sublocation = "Surtidor 03";

    useEffect(() => {
        dispatch({
          type: WITHDRAWAL_ACTIONS.SET_AMOUNT, 
          payload: { amount: amount }
        }
        );
      }, [amount]);
      
    const goFuelSelection = () => {
        navigation.navigate(getRoutePath(HOME_ROUTE.WithdrawalFuelSelection, HOME_ROUTE));
    };

    const goBack = () => {
        //TODO: Implement
    };
    
    return (
        <ShowStatusBarLayout>
            <View style={styles.container}>
                <ConfirmQrCard type={OperationType.Withdrawal} money={amount} location={location} sublocation={sublocation} onAccept={goFuelSelection} onCancel={goBack}/>
            </View>
        </ShowStatusBarLayout>
    );
};

WithdrawalConfirmQrPage.navigationOptions = {              
    title: 'Retirar',    
  };

export default WithdrawalConfirmQrPage;