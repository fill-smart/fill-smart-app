import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import FuelCard from '../../components/fuel-card.component';
import OperationType from '../../models/operation-type.enum';
import { FlatList } from 'react-native';
import Button from '../../components/button.component';
import PaymentMethodPreviewCard from '../../components/payment-method-preview-card.component';
import { useNavigation } from 'react-navigation-hooks';
import { getRoutePath, HOME_ROUTE } from '../../routing/routes';
import ShowStatusBarLayout from '../../layouts/show-status-bar.layout';
import { PaymentInStoreContext, PAYMENT_IN_STORE_ACTIONS } from '../../contexts/payment-in-store.context';
import useWallets, { WalletRecord } from '../../hooks/use-wallets';
import Loader from '../../components/loader.component';
import THEME_COLORS from '../../styles/theme.styles';
import styled from 'styled-components/native';
import InfoIcon from '../../assets/icons/ic_info.svg'
import { NavigationActions, StackActions } from 'react-navigation';
import { StackNavigationProp } from 'react-navigation-stack/lib/typescript/src/vendor/types';

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        marginBottom: 25,
        marginLeft: 20,
        marginRight: 20,
        flex: 1,
    },
    listSeparator: {
        marginBottom: 10,
    },
    listDescription: {
        alignSelf: "center",
        fontFamily: "LibreFranklin-Thin",
        fontSize: 14,
        marginLeft: 80,
        marginRight: 80,
        marginBottom: 15,
        textAlign: "center",
    },
    icon: {
        alignSelf: 'center',
        marginBottom: 30,
    }
});

const FuelSelectionListSeparator = () => {
    return (
        <View style={styles.listSeparator} />
    );
};


const PaymentInStoreFuelSelectionPage = () => {
    const navigation = useNavigation() as StackNavigationProp;;
    const [paymentCtx, dispatch] = useContext(PaymentInStoreContext);
    const { wallets, loading } = useWallets();
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const itemList = useRef<FlatList<any>>(null);

    useEffect(() => {
        if (paymentCtx.wallet && paymentCtx.amount && selectedIndex) {
            itemList?.current?.scrollToIndex({ index: selectedIndex! });
        }
    }, [selectedIndex]);



    if (loading) {
        return <Loader />;
    }

    const goConfirmPaymentMethod = () => {
        navigation.navigate(getRoutePath(HOME_ROUTE.PaymentInStoreConfirmPaymentMethod, HOME_ROUTE));
    };

    const onItemPressed = (wallet: WalletRecord, index: number) => {
        if (wallet.availableLitres >= (paymentCtx.amount! / wallet.fuelType.currentPrice.price)) {
            dispatch({
                type: PAYMENT_IN_STORE_ACTIONS.SET_WALLET,
                payload: { wallet: wallet },
            });
            setSelectedIndex(index);
        };
    };

    const PaymentMethod = () => {
        if (paymentCtx.wallet && paymentCtx.amount) {
            return (
                <PaymentMethodPreviewCard
                    type={OperationType.PaymentInStore}
                    operationValue={paymentCtx.amount!}
                    selectedWallet={paymentCtx.wallet?.fuelType.name!}
                    selectedWalletLitres={paymentCtx.amount / paymentCtx.wallet.fuelType.currentPrice.price}
                />
            );
        };
        return null;
    }

    return (
        <ShowStatusBarLayout>
            <View style={styles.container}>
                <Text style={styles.listDescription}>Seleccione con qué billetera desea pagar</Text>
                <FlatList
                    ref={itemList}
                    data={wallets}
                    keyExtractor={wallet => wallet.id.toString()}
                    renderItem={({ item, index }: { item: WalletRecord; index: number }) => (
                        <FuelCard
                            walletId={item.id}
                            title={item.fuelType.name}
                            litres={item.availableLitres}
                            money={item.availableLitres * item.fuelType.currentPrice.price}
                            type={OperationType.PaymentInStore}
                            enabled={item.availableLitres >= (paymentCtx.amount! / item.fuelType.currentPrice.price)}
                            selectedWalletId={paymentCtx.wallet?.id}
                            onPress={() => onItemPressed(item, index)}
                        />
                    )}
                    ItemSeparatorComponent={FuelSelectionListSeparator}
                    showsVerticalScrollIndicator={false}
                    onScrollToIndexFailed={()=>{}}
                />
                <PaymentMethod />
                <Button label="Continuar" colors={{ background: paymentCtx.wallet ? THEME_COLORS.PRIMARY : THEME_COLORS.FONT_LIGHT }} onPress={paymentCtx.wallet ? goConfirmPaymentMethod : undefined} />
            </View>

        </ShowStatusBarLayout>
    );
};

PaymentInStoreFuelSelectionPage.navigationOptions = {
    title: 'Pagar en tienda',
};

export default PaymentInStoreFuelSelectionPage;