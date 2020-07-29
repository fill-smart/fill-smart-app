import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import Button from '../../components/button.component';
import PaymentMethodChangeCard from '../../components/payment-method-change-card.component';
import { getRoutePath, HOME_ROUTE } from '../../routing/routes';
import ShowStatusBarLayout from '../../layouts/show-status-bar.layout';
import ExchangeConfirmCard from './exchange-confirm-card.component';
import { ExchangeWalletContext } from '../../contexts/exchange-wallets.context';
import useExchange from '../../hooks/use-exchange.hook';
import THEME_COLORS from '../../styles/theme.styles';
import ErrorPage from '../error-page';
import styled from 'styled-components/native';
import InfoIcon from '../../assets/icons/ic_info.svg'
import crashlytics from '@react-native-firebase/crashlytics';
import Loader from '../../components/loader.component';
import { NavigationActions } from 'react-navigation';
import { StackNavigationProp } from 'react-navigation-stack/lib/typescript/src/vendor/types';

const styles = StyleSheet.create({
    container: {
        padding: 25,
        flex: 1,
        justifyContent: "space-between",
    },
});

const InfoCard = styled.View`
  flex-direction: row;
  height: 60px;
  align-items: center;
  background-color: ${THEME_COLORS.WHITE};
  border-radius: 5px;
  padding-left: 10px;
  padding-right: 10px;
  margin-bottom: 10px;
  elevation: 2;
`;

const IconTextContainer = styled.View` 
  flex-direction: row;
`;

const InfoText = styled.Text`
  font-family: LibreFranklin-Thin;
  font-size: 14px;
  color: ${THEME_COLORS.FONT_NORMAL};
  margin-left: 10px;
  flex: 1;
`;

const ExchangeConfirmSelectionPage = () => {
    const navigation = useNavigation() as StackNavigationProp;
    const availabilityDate = useNavigationParam('availabilityDate');
    const { receiptId, loading, error, executeExchange } = useExchange();
    const [exchangeContext, _] = useContext(ExchangeWalletContext);
    const title = exchangeContext.sourceFuelType?.name! + " a " + exchangeContext.targetFuelType?.name!;
    const [waitExecute, setWaiExecute] = useState(false);


    useEffect(() => {
        if (receiptId) {
            navigation.reset([
                NavigationActions.navigate({ routeName: getRoutePath(HOME_ROUTE.Home, HOME_ROUTE) }),
                NavigationActions.navigate({ routeName: getRoutePath(HOME_ROUTE.ExchangeOperationComplete, HOME_ROUTE), params: { receiptId: receiptId.toString(), title: title } })
            ], 1);
            //navigation.navigate(getRoutePath(HOME_ROUTE.ExchangeOperationComplete, HOME_ROUTE), { receiptId: receiptId.toString(), title: title });
        }
    }, [receiptId])


    if (loading || waitExecute) {
        return <Loader />;
    }

    const goBack = () => {
        navigation.navigate(getRoutePath(HOME_ROUTE.ExchangeWalletSelection, HOME_ROUTE));
    };

    const completeExchange = () => {
        setWaiExecute(true);
        executeExchange();
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
                    <InfoCard>
                        <IconTextContainer>
                            <InfoIcon />
                            <InfoText>Los litros de esta compra estarán disponibles a partir del {availabilityDate}</InfoText>
                        </IconTextContainer>
                    </InfoCard>
                    <ExchangeConfirmCard />
                    <View style={{ marginBottom: 25 }} />
                    <PaymentMethodChangeCard title={title} label="Cambiar billeteras" onPress={goBack} />
                </View>
                <Button label="Canjear" onPress={completeExchange} loading={loading} />
            </View>
        </ShowStatusBarLayout>
    );
};

ExchangeConfirmSelectionPage.navigationOptions = {
    title: 'Canjear',
};

export default ExchangeConfirmSelectionPage;