import React, { useState } from 'react';
import { useNavigation } from 'react-navigation-hooks';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import THEME_COLORS from '../../styles/theme.styles';
import ShowStatusBarLayout from '../../layouts/show-status-bar.layout';
import Button from '../../components/button.component';
import MercadoPagoIcon from '../../assets/icons/ic_mercadopago.svg'
import ArrowRightIcon from '../../assets/icons/ic_arrow_simple_right_blue.svg'
import MoneyIcon from '../../assets/icons/ic_money.svg'
import CreditCardIcon from '../../assets/icons/ic_creditcard.svg'
import PumpBuyIcon from '../../assets/icons/ic_pump_buy_white.svg'
import { getRoutePath, HOME_ROUTE } from '../../routing/routes';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 25,
        paddingTop: 0,
    },
    paymentMethodsContainer: {
        flex: 1,
        justifyContent: "flex-start",
    },

    actionContainer: {
        paddingTop: 25,
        justifyContent: "flex-end",
    },

    paymentTypeCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: THEME_COLORS.WHITE,
        borderRadius: 5,
        elevation: 2,
        marginTop: 25,
        height: 50,
        paddingHorizontal: 10,
    },

    iconTextContainer: {
        flexDirection: "row",
    },

    paymentTypeText: {
        fontFamily: "LibreFranklin-Light",
        fontSize: 16,
        color: THEME_COLORS.FONT_REGULAR,
        marginLeft: 10
    },


    //Preview purchase card
    purchaseDetailCard: {
        backgroundColor: THEME_COLORS.WHITE,
        borderRadius: 5,
        elevation: 2,
        paddingVertical: 12,
        paddingHorizontal: 10,
        marginVertical: 25,
        marginBottom: 10,
        height: 60,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

    },

    iconBox: {
        borderRadius: 3,
        height: 35,
        width: 35,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: THEME_COLORS.PRIMARY
    },

    PurchaseDetailTextContainer:{
        flex:1,
        justifyContent: "flex-start",
        alignContent:"center",
        paddingLeft:12,
    },
    purchaseDetailText:{
        fontFamily: "LibreFranklin-Light",
        fontSize: 16,
        color: THEME_COLORS.FONT_NORMAL,
    },
    purchaseDetailTextSubtitle:{
        fontFamily: "LibreFranklin-Thin",
        fontSize: 14,
        color: THEME_COLORS.FONT_NORMAL,
    },
    purchaseDetailValueContainer:{                       
        justifyContent: "flex-end",
        alignContent:"flex-end",
    },
    purchaseDetailValue:{
        fontFamily: "LibreFranklin-Light",
        fontSize: 16,
        color: THEME_COLORS.PRIMARY,
    },
    purchaseDetailEqValue:{
        fontFamily: "LibreFranklin-Thin",
        fontSize: 14,
        color: THEME_COLORS.FONT_NORMAL,
    },

});


const PurchasePaymentMethod = () => {
    const navigation = useNavigation();

    const goToConfirmPurchase = () => {
        navigation.navigate(getRoutePath(HOME_ROUTE.PurchaseConfirm, HOME_ROUTE));
    }

    return (
        <ShowStatusBarLayout>
            <View style={styles.container}>
                <View style={styles.paymentMethodsContainer}>
                    <View style={styles.paymentTypeCard}>
                        <MercadoPagoIcon />
                        <ArrowRightIcon />
                    </View>

                    <View style={styles.paymentTypeCard}>
                        <View style={styles.iconTextContainer}>
                            <CreditCardIcon />
                            <Text style={styles.paymentTypeText}>Tarjeta Débito / Crédito</Text>
                        </View>
                        <ArrowRightIcon />
                    </View>

                    <View style={styles.paymentTypeCard}>
                        <View style={styles.iconTextContainer}>
                            <MoneyIcon />
                            <Text style={styles.paymentTypeText}>Efectivo</Text>
                        </View>
                        <ArrowRightIcon />
                    </View>
                </View>

                <View style={styles.actionContainer}>
                    <View style={styles.purchaseDetailCard}>
                        <View style={styles.iconBox}>
                            <PumpBuyIcon width={16} height={16} />
                        </View>
                        <View style={styles.PurchaseDetailTextContainer}>
                            <Text style={styles.purchaseDetailText}>Inifinia</Text>
                            <Text  style={styles.purchaseDetailTextSubtitle}>Equivale a</Text>
                        </View>
                        <View  style={styles.purchaseDetailValueContainer}>
                            <Text style={styles.purchaseDetailValue}>+150 lt</Text>
                            <Text style={styles.purchaseDetailEqValue}>$8691</Text>
                        </View>
                    </View>

                    <Button label={"Continuar"} onPress={goToConfirmPurchase} />
                </View>
            </View>

        </ShowStatusBarLayout>
    );
}

PurchasePaymentMethod.navigationOptions = {              
    title: 'Comprar',    
  };


export default PurchasePaymentMethod;