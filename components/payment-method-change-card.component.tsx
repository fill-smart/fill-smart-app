import React from 'react';
import { View, StyleSheet, Text, TouchableWithoutFeedback, GestureResponderEvent } from 'react-native';
import THEME_COLORS from '../styles/theme.styles';
import PumpPrimaryIcon from '../assets/icons/ic_pump_primary.svg';
import TextButton from './text-button.component';
import GestureRecognizer from 'react-native-swipe-gestures';

const PaymentMethodChangeCard = ({
    title,
    label,
    onPress,
}: {
    title: string,
    label?: string,
    onPress?: (event: GestureResponderEvent) => void,
}) => {
    const styles = StyleSheet.create({
        container: {
            backgroundColor: THEME_COLORS.WHITE,
            borderRadius: 10,
            elevation: 2,
            padding: 10,
            paddingLeft: 15,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        button: {
            justifyContent: "flex-end",
            color: THEME_COLORS.PRIMARY,
            fontFamily: "LibreFranklin-Light",
            fontSize: 12,
        },
        title: {
            fontFamily: "LibreFranklin-Thin",
            fontSize: 16,
            color: THEME_COLORS.FONT_REGULAR,
            marginLeft: 15,
            marginRight: 15,
            flex: 1,
        },
    });

    return (
        <View style={styles.container}>
            <PumpPrimaryIcon/>
            <Text style={styles.title}>{title}</Text>
            <TextButton label={label ?? "Cambiar medio de pago"} colors={{text: THEME_COLORS.PRIMARY}} onPress={onPress}/>
        </View>
    );
};

export default PaymentMethodChangeCard;