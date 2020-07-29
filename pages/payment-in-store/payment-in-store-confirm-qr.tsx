import React from 'react';
import { View, StyleSheet } from 'react-native';
import ShowStatusBarLayout from '../../layouts/show-status-bar.layout';
import ConfirmQrCard from '../../components/confirm-qr-card.component';
import OperationType from '../../models/operation-type.enum';
import { useNavigation } from 'react-navigation-hooks';
import { getRoutePath, HOME_ROUTE } from '../../routing/routes';

const styles = StyleSheet.create({
    container: {
        padding: 25,
    },
});

const PaymentInStoreConfirmQrPage = () => {

    //TODO use query to get operation from backend

    const navigation = useNavigation();

    const goFuelSelection = () => {
        navigation.navigate(getRoutePath(HOME_ROUTE.PaymentInStoreFuelSelection,HOME_ROUTE));
    };

    const goBack = () => {        
        navigation.goBack();
    };
    
    return (
        <ShowStatusBarLayout>
            <View style={styles.container}>
                <ConfirmQrCard type={OperationType.PaymentInStore} money={500} location="Estación Chango - YPF" sublocation="Full - Caja 01" onAccept={goFuelSelection} onCancel={goBack}/>
            </View>
        </ShowStatusBarLayout>
    );
};

PaymentInStoreConfirmQrPage.navigationOptions = {              
    title: 'Pagar',    
  }

export default PaymentInStoreConfirmQrPage;