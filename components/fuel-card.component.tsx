import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableWithoutFeedback, GestureResponderEvent } from 'react-native';
import THEME_COLORS from '../styles/theme.styles';
import PumpBackgroundIcon from '../assets/icons/ic_pump_background.svg';
import PumpBackgroundBigIcon from '../assets/icons/ic_pump_background_big.svg';
import OperationType from '../models/operation-type.enum';

const selectedBackgroundColorList = [
    THEME_COLORS.WARNING,
    THEME_COLORS.PRIMARY,
    THEME_COLORS.VIOLET,
    THEME_COLORS.SUCCESS,
    THEME_COLORS.SECONDARY,
];

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        elevation: 2,
        padding: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 5,
    },
    secondColumn: {
        justifyContent: "flex-end",
    },
    title: {
        fontFamily: "LibreFranklin-Regular",
        fontSize: 20,
        marginBottom: 30
    },
    insufficientLitresLabel: {
        fontFamily: "LibreFranklin-Regular",
        fontSize: 14,
        color: THEME_COLORS.DANGER,
        marginBottom: 20
    },
    availableLitresDescription: {
        fontFamily: "LibreFranklin-Regular",
        fontSize: 14,
    },
    equivalentToDescription: {
        fontFamily: "LibreFranklin-Thin",
        fontSize: 14,
        marginTop: 5,
    },
    availableLitresAmount: {
        fontFamily: "LibreFranklin-Regular",
        fontSize: 20,
        textAlign: "right"
    },
    equivalentToAmount: {
        fontFamily: "LibreFranklin-Regular",
        fontSize: 14,
        marginTop: 5,
        textAlign: "right"
    },
    pumpBackgroundSmall: {
        position: "absolute",
        bottom: 0,
        marginBottom: -5,
    },
    pumpBackgroundBig: {
        position: "absolute",                        
        right: 0,
        top: 0,
    },
});

const PumpIconSmall = ({isSelected}: {isSelected: boolean}) => {
    if (isSelected) {
        return null;
    }
    return (
        <PumpBackgroundIcon style={styles.pumpBackgroundSmall} />
    );
};

const PumpIconBig = ({isSelected}: {isSelected: boolean}) => {
    if (isSelected) {
        return (
            <PumpBackgroundBigIcon style={styles.pumpBackgroundBig}/>
        );
    }
    return null;
};

const LitresLabel = ({isSelected, isDisabled = false, litres}: {isSelected: boolean, isDisabled?: boolean, litres: number}) => {
    const formattedLitres = litres.toLocaleString("es-ar", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
      }) + " lt";
    return (
        <Text style={[styles.availableLitresAmount, {color: isDisabled ? THEME_COLORS.DANGER : isSelected ? THEME_COLORS.WHITE : THEME_COLORS.SUCCESS}]}>{formattedLitres}</Text>
    );
};

const MoneyLabel = ({isSelected, money}: {isSelected: boolean, money: number}) => {
    const formattedMoney = "$" + money.toLocaleString("es-ar", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      });
    return (
        <Text style={[styles.equivalentToAmount, {color: isSelected ? THEME_COLORS.WHITE : THEME_COLORS.FONT_NORMAL}]}>{formattedMoney}</Text>
    );
};

const FuelCard = ({
    walletId,
    title,
    litres,
    money,
    type,
    enabled,
    selectedWalletId,
    onPress,
}: {
    walletId: string,
    title: string,
    litres: number,
    money: number,
    type: OperationType,
    enabled: boolean,
    selectedWalletId?: string,
    onPress?: (event: GestureResponderEvent) => void,
}) => {
    const isSelected = walletId === selectedWalletId;
    const selectedBackgroundColor = selectedBackgroundColorList[parseInt(type)-1];

    if (!enabled) {
        return (
            <View style={[styles.container, {backgroundColor: THEME_COLORS.WHITE}]}>
                <View>
                    <Text style={[styles.title, {color: THEME_COLORS.FONT_REGULAR, marginBottom: 0}]}>{title}</Text>
                    <Text style={styles.insufficientLitresLabel}>Litros insuficientes</Text>
                    <View>
                        <PumpIconSmall isSelected={false}/>
                        <Text style={[styles.availableLitresDescription, {color: THEME_COLORS.FONT_NORMAL}]}>Litros disponibles</Text>
                        <Text style={[styles.equivalentToDescription, {color: THEME_COLORS.FONT_NORMAL}]}>Equivale a</Text>
                    </View>
                </View>
                <View style={styles.secondColumn}>
                    <PumpIconBig isSelected={false}/>
                    <View>
                        <LitresLabel isDisabled={true} isSelected={false} litres={litres}/>
                        <MoneyLabel isSelected={isSelected} money={money}/>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <TouchableWithoutFeedback onPress={onPress ?? undefined}>
            <View style={[styles.container, {backgroundColor: isSelected ? selectedBackgroundColor : THEME_COLORS.WHITE}]}>
                <View>
                    <Text style={[styles.title, {color: isSelected ? THEME_COLORS.WHITE : THEME_COLORS.FONT_REGULAR}]}>{title}</Text>
                    <View>
                        <PumpIconSmall isSelected={isSelected}/>
                        <Text style={[styles.availableLitresDescription, {color: isSelected ? THEME_COLORS.WHITE : THEME_COLORS.FONT_NORMAL}]}>Litros disponibles</Text>
                        <Text style={[styles.equivalentToDescription, {color: isSelected ? THEME_COLORS.WHITE : THEME_COLORS.FONT_NORMAL}]}>Equivale a</Text>
                    </View>
                </View>
                <View style={styles.secondColumn}>
                    <PumpIconBig isSelected={isSelected}/>
                    <View>
                        <LitresLabel isSelected={isSelected} litres={litres}/>
                        <MoneyLabel isSelected={isSelected} money={money}/>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default FuelCard;