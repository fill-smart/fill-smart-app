import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ShowStatusBarLayout from '../../layouts/show-status-bar.layout';
import { useNavigationParam, useNavigation } from 'react-navigation-hooks';
import useWallets from '../../hooks/use-wallets';
import { StackActions, NavigationActions } from 'react-navigation';
import { getRoutePath, HOME_ROUTE, APP_ROUTES } from '../../routing/routes';
import useOperations from '../../hooks/use-operations';
import THEME_COLORS from '../../styles/theme.styles';
import CheckIcon from '../../assets/icons/ic_check.svg';
import Button from '../../components/button.component';
import { operationsRefetch } from '../home/home';
import { TransferContext, TRANSFER_ACTIONS } from '../../contexts/transfer.context';


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
        marginTop: 7,
        marginBottom: 10,
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
        marginVertical: 16,
    },
});

const TransferOperationCompletePage = () => {
    const navigation = useNavigation();
    const [transferCtx, dispatch] = useContext(TransferContext);
    const walletsHook = useWallets();
    const operationId = useNavigationParam("operationId");

    useEffect(() => {
        walletsHook.refetch();
        operationsRefetch();
    }, []);

    const finish = () => {
        dispatch({ type: TRANSFER_ACTIONS.CLEAN_STORE });
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

    if (!transferCtx || !transferCtx.litres) {
        return null;
    }

    return (
        <ShowStatusBarLayout>
            <ScrollView>
                <View style={styles.container}>

                    <View style={styles.cardConfirm}>
                        <CheckIcon style={styles.icon} width={102.16} height={100} />
                        <View style={styles.separatorLine} />
                            <Text style={styles.titleLabel}>Transferiste a</Text>

                            <Text style={styles.valueLabel}>
                                {transferCtx.selectedCustomer?.firstName + ' ' + transferCtx.selectedCustomer?.lastName}
                            </Text>

                            <Text style={styles.titleLabel}>Cantidad</Text>

                            <Text style={styles.valueLabel}>
                                {transferCtx.litres.toLocaleString(
                                    "es-ar",
                                    { maximumFractionDigits: 2 },
                                ) + " lt"}{' '}
                            </Text>

                            <Text style={styles.titleLabel}>
                                De la billetera de {transferCtx.fuelType?.name}
                            </Text>
                        
                            <Text style={styles.operationLabel}>Operación {operationId.padStart(8, "0")}</Text>
                        <Button label="Aceptar" onPress={finish} />
                    </View>
                </View>
            </ScrollView>

        </ShowStatusBarLayout>
    );
};

TransferOperationCompletePage.navigationOptions = {
    title: 'Retirar fondos',
};


export default TransferOperationCompletePage;