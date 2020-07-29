import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import OperationType, { OperationStyles } from '../models/operation-type.enum';
import THEME_COLORS from '../styles/theme.styles';
import { assertNonNullType } from 'graphql';


const styles = StyleSheet.create({
    container: {
        backgroundColor: THEME_COLORS.WHITE,
        borderRadius: 10,
        elevation: 2,
        padding: 10,
        marginTop: 15,
        marginBottom: 15
    },
    firstRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10
    },
    secondRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginTop: 10
    },
    iconBox: {
        borderRadius: 10,
        height: 35,
        width: 35,
        alignItems: "center",
        justifyContent: "center",
    },
    separator: {
        backgroundColor: THEME_COLORS.LINES,
        width: "100%",
        height: 1
    },
    iconTitleContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1
    },
    titleSubtitleContainer: {
        marginLeft: 10,
        marginRight: 10,
        flex: 1,
    },
    title: {
        fontFamily: "LibreFranklin-Regular",
        fontSize: 16,
        color: THEME_COLORS.FONT_NORMAL,
        flex: 1,
        textAlignVertical: "center",
    },
    leftSubtitle: {
        fontFamily: "LibreFranklin-Thin",
        fontSize: 14,
        color: THEME_COLORS.FONT_NORMAL,
        textAlignVertical: "center",
    },
    rightSubtitle: {
        fontFamily: "LibreFranklin-Thin",
        fontSize: 14,
        color: THEME_COLORS.FONT_NORMAL,
    },
    rightSubtitleRegularFont: {
        fontFamily: "LibreFranklin-Thin",
        fontSize: 14,
        color: THEME_COLORS.FONT_REGULAR,
    },
    valueContainer: {
        alignItems: "flex-end",
    },
    value: {
        fontFamily: "LibreFranklin-Regular",
        fontSize: 16,
    },
    paymentMethod: {
        fontFamily: "LibreFranklin-Regular",
        fontSize: 14,
        color: THEME_COLORS.FONT_REGULAR,
    },
});

const PaymentMethodPreviewCard = ({
    type,
    title,
    operationValue,
    operationValueEquivalent,
    selectedWallet,
    selectedWalletLitres,
}: {
    type: OperationType,
    title?: string,
    operationValue: number,
    operationValueEquivalent?: number,
    selectedWallet: string,
    selectedWalletLitres: number,
}) => {
    const IconRender = () => {
        const backgroundColor = OperationStyles.get(type.toString())?.iconBackgroundColor;
        const icon = OperationStyles.get(type.toString())?.iconComponent;
        return (
            <View style={[styles.iconBox, { backgroundColor: backgroundColor }]}>
                {icon}
            </View>
        )
    };

    const TitleLabel = () => {
        const formattedTitle = title ? title : type === OperationType.Withdrawal ? "Retirar fondos" : type === OperationType.PaymentInStore ? "Pago en tienda" : null;
        return (<Text style={styles.title} numberOfLines={1}>{formattedTitle}</Text>)
    };

    const OperationValueLabel = () => {
        let formattedValue = "";
        const textColor = OperationStyles.get(type.toString())?.fontColor;
        switch (type) {
            case OperationType.Refuel:
                formattedValue = operationValue.toLocaleString("es-ar", {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                }) + " lt";
                break;
            case OperationType.Withdrawal:
                formattedValue = "-$" + operationValue.toLocaleString("es-ar", {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                });
                break;
            case OperationType.PaymentInStore:
                formattedValue = "-$" + operationValue.toLocaleString("es-ar", {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                });
                break;
            default:
                break;
        }
        return (
            <Text style={[styles.value, { color: textColor }]}>{formattedValue}</Text>
        )
    };

    const EquivalentLabel = () => {
        return (<Text style={styles.leftSubtitle}>Equivale a</Text>);
    };

    const OperationValueEquivalentLabel = () => {
        if (type === OperationType.Refuel) {
            const formattedMoneyEquivalent = "$" + operationValueEquivalent?.toLocaleString("es-ar", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
            });
            return (<Text style={styles.rightSubtitle}>{formattedMoneyEquivalent}</Text>);
        }
        return null;
    };

    const SelectedWalletLitresLabel = () => {
        const formattedLitreEquivalent = selectedWalletLitres.toLocaleString("es-ar", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 0,
        }) + " lt";
        return (<Text style={styles.rightSubtitleRegularFont}>{formattedLitreEquivalent}</Text>);
    };

    return (
        <View style={styles.container}>
            <View style={styles.firstRow}>
                <View style={styles.iconTitleContainer}>
                    <IconRender />
                    <View style={styles.titleSubtitleContainer}>
                        <TitleLabel />
                        {type === OperationType.Refuel ? <EquivalentLabel /> : null}
                    </View>
                </View>
                <View style={styles.valueContainer}>
                    <OperationValueLabel />
                    <OperationValueEquivalentLabel />
                </View>
            </View>
            <View style={styles.separator} />
            <View style={styles.secondRow}>
                <View>
                    <Text style={[styles.title, { fontSize: 14 }]}>Método de pago:</Text>
                    <Text style={styles.leftSubtitle}>Equivale a</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.paymentMethod}>{selectedWallet}</Text>
                    <SelectedWalletLitresLabel />
                </View>
            </View>
        </View>
    );
};

export default PaymentMethodPreviewCard;
