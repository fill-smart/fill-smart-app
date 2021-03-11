import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ShowStatusBarLayout from '../../layouts/show-status-bar.layout';
import { useNavigationParam, useNavigation } from 'react-navigation-hooks';
import useWallets from '../../hooks/use-wallets';
import { WithdrawalContext, WITHDRAWAL_ACTIONS } from '../../contexts/withdrawal.context';
import { StackActions, NavigationActions } from 'react-navigation';
import { getRoutePath, HOME_ROUTE, APP_ROUTES } from '../../routing/routes';
import useOperations from '../../hooks/use-operations';
import THEME_COLORS from '../../styles/theme.styles';
import CheckIcon from '../../assets/icons/ic_check.svg';
import Button from '../../components/button.component';
import { WithdrawalType } from '../../models/withdrawal-enums';


const styles = StyleSheet.create({
    container: {
        padding: 25,
    },
    cardConfirm: {
        backgroundColor: THEME_COLORS.WHITE,
        borderRadius: 10,
        elevation: 2,
        paddingTop: 50,
        paddingBottom: 30,
        paddingLeft: 50,
        paddingRight: 50,
        alignItems: 'stretch',
    },
    icon: {
        alignSelf: 'center',
        marginBottom: 30,
    },
    separatorLine: {
        backgroundColor: THEME_COLORS.FONT_LIGHT,
        width: '100%',
        height: 1,
        marginBottom: 25,
    },
    titleLabel: {
        color: THEME_COLORS.FONT_NORMAL,
        fontFamily: 'LibreFranklin-Medium',
        fontSize: 18,
        alignSelf: 'center',
        textAlign: 'center',
        marginVertical: 7,
    },
    productLabel: {
        color: THEME_COLORS.FONT_NORMAL,
        fontFamily: 'LibreFranklin-Thin',
        fontSize: 18,
        alignSelf: 'center',
        textAlign: 'center',
        marginVertical: 7,
    },
    valueLabel: {
        color: THEME_COLORS.FONT_REGULAR,
        fontFamily: 'LibreFranklin-Light',
        fontSize: 30,
        alignSelf: 'center',
        textAlign: 'center',
    },
    operationLabel: {
        color: THEME_COLORS.PRIMARY,
        fontFamily: 'LibreFranklin-Medium',
        fontSize: 16,
        alignSelf: 'center',
        textAlign: 'center',
        marginVertical: 30,
    },
});

const WithdrawalOperationCompletePage = () => {
    const navigation = useNavigation();
    const [withdrawalContext, dispatch] = useContext(WithdrawalContext);
    const operationId = useNavigationParam("operationId");

    const finish = () => {
        dispatch({ type: WITHDRAWAL_ACTIONS.CLEAN_STORE });
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

    if (!withdrawalContext || !withdrawalContext.amount) {
        return null;
    }

    return (
        <ShowStatusBarLayout>
            <ScrollView>
                <View style={styles.container}>

                    <View style={styles.cardConfirm}>
                        <CheckIcon style={styles.icon} width={102.16} height={100} />
                        <View style={styles.separatorLine} />

                        {withdrawalContext.type === WithdrawalType.Cash ?
                            <>
                            <Text style={styles.titleLabel}>Retiraste</Text>

                            <Text style={styles.valueLabel}>
                                {'$' + withdrawalContext.amount.toLocaleString(
                                    "es-ar",
                                    { maximumFractionDigits: 2 },
                                )}{' '}
                            </Text>

                            <Text style={styles.productLabel}>
                                Desde la billetera de {withdrawalContext.wallet?.fuelType?.name}
                            </Text>

                            <Text style={styles.productLabel}>Que equivale a </Text>
                            <Text style={styles.valueLabel}>
                                {(withdrawalContext.amount / withdrawalContext.wallet?.fuelType.currentPrice.price!)
                                    .toLocaleString("es-ar", {
                                        maximumFractionDigits: 2,
                                        minimumFractionDigits: 2
                                    })
                                } lt.
                            </Text>

                            <Text style={styles.productLabel}>Precio del litro</Text>
                            <Text style={styles.valueLabel}>
                                {'$' + withdrawalContext.wallet?.fuelType?.currentPrice?.price.toLocaleString(
                                    "es-ar",
                                    { maximumFractionDigits: 2 },
                                )}{' '}
                            </Text>

                            <Text style={styles.operationLabel}>Nro. Operación {operationId.padStart(8, "0")}</Text>
                            </>
                        :                             
                            <Text style={[styles.titleLabel, {marginBottom: 30}]}>Su solicitud fue recibida, procesaremos su pedido pronto.</Text>
                        }

                        <Button label="Aceptar" onPress={finish} />
                    </View>
                </View>
            </ScrollView>

        </ShowStatusBarLayout>
    );
};

WithdrawalOperationCompletePage.navigationOptions = {
    title: 'Retirar fondos',
};


export default WithdrawalOperationCompletePage;