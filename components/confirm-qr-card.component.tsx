import React from 'react';
import { View, StyleSheet, Text, GestureResponderEvent } from 'react-native';
import THEME_COLORS from '../styles/theme.styles';
import Button from './button.component';
import OperationType from '../models/operation-type.enum';
import WithdrawalWhiteIcon from '../assets/icons/ic_topup_white.svg';
import PayInStoreWhiteIcon from '../assets/icons/ic_pay_in_store_white.svg';

const styles = StyleSheet.create({
    container: {
        backgroundColor: THEME_COLORS.WHITE,
        borderRadius: 10,
        elevation: 2,
        paddingTop: 25,
        paddingBottom: 20,
        paddingLeft: 50,
        paddingRight: 50,
        alignItems: "stretch",
    },
    iconBox: {
        borderRadius: 10,
        height: 90,
        width: 90,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        elevation: 2,
    },
    separatorLine: {
        backgroundColor: THEME_COLORS.FONT_LIGHT,
        width: "100%",
        height: 1,
        marginBottom: 15,
    },
    titleLabel: {
        color: THEME_COLORS.FONT_NORMAL,
        fontFamily: "LibreFranklin-Medium",
        fontSize: 18,
        marginBottom: 32,
        alignSelf: "center",
        textAlign: "center"
    },
    amountLabel: {
        fontFamily: "LibreFranklin-Light",
        fontSize: 30,
        marginBottom: 32,
        alignSelf: "center",
    },
    locationLabel: {
        color: THEME_COLORS.FONT_REGULAR,
        fontFamily: "LibreFranklin-Medium",
        fontSize: 18,
        alignSelf: "center",
    },
    button: {
        elevation: 2,
    },
});

const ConfirmQrCard = ({
    type,
    money,
    location,
    sublocation,
    onAccept,
    onCancel,
}: {
    type: OperationType,
    money: number,
    location: string,
    sublocation: string,
    onAccept: (event: GestureResponderEvent) => void,
    onCancel: (event: GestureResponderEvent) => void,
}) => {
    const Icon = () => {
        return (
            <View style={[styles.iconBox, {backgroundColor: type === OperationType.Withdrawal ? THEME_COLORS.SUCCESS : THEME_COLORS.VIOLET }]}>
                {type === OperationType.Withdrawal ? <WithdrawalWhiteIcon width={39.37} height={47.84}/> : <PayInStoreWhiteIcon width={33.27} height={53.55}/>}
            </View>
        );
    };

    const TitleLabel = () => {
        const title = type === OperationType.Withdrawal ? "Usted está por retirar efectivo" : "Usted está por pagar en tienda";
        return (<Text style={styles.titleLabel}>{title}</Text>);
    };

    const MoneyAmountLabel = () => {
        const formattedMoney = "$ " + money.toLocaleString("es-ar", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          });;
        return (<Text style={[styles.amountLabel, { color: type === OperationType.Withdrawal ? THEME_COLORS.SUCCESS : THEME_COLORS.FONT_REGULAR }]}>{formattedMoney}</Text>);
    };

    return (
        <View style={styles.container}>
            <Icon/>
            <View style={styles.separatorLine} />
            <TitleLabel/>
            <MoneyAmountLabel/>
            <Text style={[styles.locationLabel, { marginBottom: 5 }]}>{location}</Text>
            <Text style={[styles.locationLabel, { marginBottom: 20 }]}>{sublocation}</Text>
            <Button style={styles.button} label="Aceptar" onPress={onAccept}/>
            <View style={{marginBottom: 15}}/>
            <Button style={styles.button} label="Cancelar" colors={{ background: THEME_COLORS.DANGER }} onPress={onCancel}/>
        </View>
    );
};

export default ConfirmQrCard;