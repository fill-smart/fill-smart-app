import React, { useContext } from 'react';
import { View, StyleSheet, Text, GestureResponderEvent, TouchableOpacity } from 'react-native';
import OperationType, { OperationStyles } from '../models/operation-type.enum';
import THEME_COLORS from '../styles/theme.styles';
import { useNavigation } from 'react-navigation-hooks';
import { DateUtils } from '@silentium-apps/fill-smart-common';
import { getRoutePath, MY_ACCOUNT_ROUTES } from '../routing/routes';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { IOperation } from '../hooks/use-operations';
import { SecurityContext } from '../contexts/security.context';

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 15,
        paddingBottom: 10,
    },
    iconBox: {
        borderRadius: 10,
        height: 35,
        width: 35,
        alignItems: "center",
        justifyContent: "center",
    },
    pendingBadge: {
        borderStyle: "solid",
        borderColor: THEME_COLORS.WARNING_STRONG,
        borderRadius: 10,
        borderWidth: 1,
        marginLeft: 10,
        marginRight: 10,
        width: 100,
        height: 20,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "flex-start",
    },
    paddingBadgeText: {
        color: THEME_COLORS.WARNING_STRONG,
        fontFamily: "LibreFranklin-Light",
        fontSize: 12,
    },
    leftSubcontainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    titleSubtitleContainer: {
        marginLeft: 10,
        marginRight: 0,
        flex: 1,
    },
    title: {
        fontFamily: "LibreFranklin-Regular",
        fontSize: 14,
        flex: 1,
    },
    subtitle: {
        fontFamily: "LibreFranklin-Thin",
        fontSize: 12,
    },
    valueDateContainer: {
        alignItems: "flex-end",
        justifyContent: "center",
    },
    value: {
        fontFamily: "LibreFranklin-Regular",
        fontSize: 14,
    },
    date: {
        fontFamily: "LibreFranklin-Thin",
        fontSize: 12,
    },
});

const MovementListItem = ({
    item,
    isTouchable = true,
}: {
    item: IOperation,
    isTouchable?: boolean,
}) => {
    const navigation = useNavigation();
    const goMovementDetail = () => {
        navigation.navigate(getRoutePath(MY_ACCOUNT_ROUTES.MovementDetail, MY_ACCOUNT_ROUTES), { item: item });
    };
    const [state] = useContext(SecurityContext);

    const type = item.operationTypeId;
    const isPending = item.transferWithdrawalAuthorized === null && item.transferWithdrawalId !== null;
    const title = item.operationTypeName === "Canje de Combustible" ? item.exchangeSourceFuelType + " a " + item.fuelTypeName : item.fuelTypeName;
    const date = DateUtils.format(item.stamp, "DD/MM/YYYY");
    const subtitle = item.operationTypeName;
    const litres = item.litres;
    const moneyEquivalency = litres * item.fuelPrice;

    const PendingBadgeRender = () => {
        if (isPending) {
            return (
                <View style={styles.pendingBadge}>
                    <Text style={styles.paddingBadgeText}>Pendiente</Text>
                </View>
            )
        };
        return null;
    };

    const IconRender = () => {
        const backgroundColor = OperationStyles.get(type.toString())?.iconBackgroundColor;
        const icon = OperationStyles.get(type.toString())?.iconComponent;
        return (
            <View style={[styles.iconBox, { backgroundColor: backgroundColor }]}>
                {icon}
            </View>
        )
    };

    const SubtitleLabel = () => {
        if (subtitle) {
            return (
                <Text style={styles.subtitle}>{subtitle}</Text>
            );
        };
        return null;

    };

    const ValueLabel = () => {
        const textColor = OperationStyles.get(type.toString())?.fontColor;
        let formattedValue = "";
        switch (item.operationTypeId.toString()) {
            case OperationType.Refuel:
                formattedValue = litres.toLocaleString("es-ar", {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 0,
                }) + " lt";
                break;
            case OperationType.Purchase:
                formattedValue = "+" + litres.toLocaleString("es-ar", {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 0,
                }) + " lt";
                break;
            case OperationType.Withdrawal:
                formattedValue = "-$" + moneyEquivalency.toLocaleString("es-ar", {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                });
                break;
            case OperationType.PaymentInStore:
                formattedValue = "-$" + moneyEquivalency.toLocaleString("es-ar", {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                });
                break;
            case OperationType.Exchange:
                formattedValue = "+" + litres.toLocaleString("es-ar", {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 0,
                }) + " lt";
            case OperationType.Transfer:
                formattedValue = state?.user?.id == item.userId ?
                "-" + litres.toLocaleString("es-ar", {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 0,
                }) + " lt"
                :
                "+" + litres.toLocaleString("es-ar", {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 0,
                }) + " lt";
                break;
            default:
                break;
        }
        return (
            <Text style={[styles.value, { color: state?.user?.id == item.userId ? textColor : THEME_COLORS.SUCCESS }]}>{formattedValue}</Text>
        )
    };

    return (
        <TouchableWithoutFeedback onPress={isTouchable ? goMovementDetail : undefined}>
            <View style={styles.container}>
                <View style={styles.leftSubcontainer}>
                    <IconRender />
                    <View style={styles.titleSubtitleContainer}>
                        <Text numberOfLines={1} style={styles.title}>{title}</Text>
                        <SubtitleLabel />
                    </View>
                    <PendingBadgeRender/>
                </View>
                <View style={styles.valueDateContainer}>
                    <ValueLabel />
                    <Text style={styles.date}>{date}</Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default MovementListItem;
