import React, { useContext, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { useNavigationParam, useNavigation } from 'react-navigation-hooks';

import OperationCompleteCard from '../../components/operation-complete-card.component';
import ShowStatusBarLayout from '../../layouts/show-status-bar.layout';
import OperationType from '../../models/operation-type.enum';
import { RefuelContext, REFUEL_ACTIONS } from '../../contexts/refuel.context';
import { getRoutePath, HOME_ROUTE, APP_ROUTES } from '../../routing/routes';
import useWallets from '../../hooks/use-wallets';
import useOperations from '../../hooks/use-operations';
import Button from '../../components/button.component';
import CheckIcon from '../../assets/icons/ic_check.svg';
import THEME_COLORS from '../../styles/theme.styles';
import moment from 'moment';
import { operationsRefetch } from '../home/home';


const styles = StyleSheet.create({
    container: {
        padding: 25,
    },
    cardConfirm: {
        backgroundColor: THEME_COLORS.WHITE,
        borderRadius: 10,
        elevation: 2,
        paddingTop: 30,
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
    dateLabel: {
        color: THEME_COLORS.FONT_REGULAR,
        fontFamily: 'LibreFranklin-Light',
        fontSize: 20,
        alignSelf: 'center',
        textAlign: 'center',
    },
    operationLabel: {
        color: THEME_COLORS.PRIMARY,
        fontFamily: 'LibreFranklin-Medium',
        fontSize: 16,
        alignSelf: 'center',
        textAlign: 'center',
        marginVertical: 20,
    },
});

const RefuelOperationCompletePage = () => {
    const navigation = useNavigation();
    const [refuelContext, dispatch] = useContext(RefuelContext);
    const walletsHook = useWallets();    

    const operationId: string = useNavigationParam("operationId");
    const pumpId: string = useNavigationParam("pumpId");

    useEffect(() => {
        walletsHook.refetch();
        operationsRefetch();    
    }, []);

    const finish = () => {
        dispatch({ type: REFUEL_ACTIONS.CLEAN_STORE });
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

    if (!operationId || !pumpId) {
        return null;
    }

    return (
        <ShowStatusBarLayout>
                <ScrollView>
                <View style={styles.container}>
                    <View style={styles.cardConfirm}>
                        <CheckIcon style={styles.icon} width={102.16} height={100} />
                        <View style={styles.separatorLine} />
                        <Text style={styles.titleLabel}>Recargaste</Text>

                        <Text style={styles.valueLabel}>
                            {refuelContext.operation?.lastExternalOperation.litres.toLocaleString(
                                "es-ar",
                                { maximumFractionDigits: 2 },
                            ) + " lt"}{' '}
                        </Text>

                        <Text style={styles.productLabel}>
                            Desde la billetera de {refuelContext.wallet?.fuelType?.name}
                        </Text>

                        <Text style={styles.productLabel}>Precio del litro</Text>
                        <Text style={styles.valueLabel}>
                            {'$' + refuelContext.wallet?.fuelType?.currentPrice?.price.toLocaleString(
                                "es-ar",
                                { maximumFractionDigits: 2 },
                            )}{' '}
                        </Text>

                        <Text style={styles.productLabel}>Monto pagado</Text>
                        <Text style={styles.valueLabel}>
                            {"$ " + (refuelContext.operation?.lastExternalOperation.litres! 
                                * refuelContext.wallet?.fuelType.currentPrice.price!)
                                .toLocaleString("es-ar", {
                                    maximumFractionDigits: 2,
                                    minimumFractionDigits: 2
                                })
                            }
                        </Text>

                        <Text style={styles.productLabel}>Fecha</Text>
                        <Text style={styles.dateLabel}>
                            {moment(refuelContext.operation?.lastExternalOperation.stamp).format("DD/MM/YYYY HH:mm")}
                        </Text>

                        <Text style={styles.operationLabel}>Nro. Operación {pumpId.padStart(4, "0") + "-" + operationId.padStart(8, "0")}</Text>

                        <Button label="Aceptar" onPress={finish} />
                    </View>
                </View>
            </ScrollView>
        </ShowStatusBarLayout>
    );
};

RefuelOperationCompletePage.navigationOptions = {
    title: 'Cargar',
};


export default RefuelOperationCompletePage;