import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import THEME_COLORS from '../../styles/theme.styles';
import CalcDeleteIcon from '../../assets/icons/ic_calc_delete.svg';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Environment from '../../environment/environment';
import useParameters from '../../hooks/use-parameters.hook';
import Loader from '../../components/loader.component';
import { NumberUtils } from '@silentium-apps/fill-smart-common';

const styles = StyleSheet.create({
    //CALC STYLES
    calcContainer: {
        flex: 1,
        borderRadius: 5,
        backgroundColor: THEME_COLORS.WHITE,
        elevation: 2,
        justifyContent: 'space-evenly',
        paddingBottom: 12,
        paddingTop: 18,
    },

    calcInputValueContainer: {
        borderRadius: 5,
        borderWidth: 2,
        borderColor: THEME_COLORS.VIOLET,
        borderStyle: 'solid',
        backgroundColor: THEME_COLORS.WHITE,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        marginHorizontal: 12,
        marginBottom: 10
    },

    calcInputValue: {
        fontFamily: 'LibreFranklin-Regular',
        fontSize: 30,
        color: THEME_COLORS.FONT_REGULAR,
    },

    calcResultContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        marginTop: 0
    },

    calcResultLabel: {
        fontFamily: 'LibreFranklin-Regular',
        fontSize: 16,
        color: THEME_COLORS.DANGER,
        textAlign: "center",
    },

    calcPadContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },

    calcRow: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        padding: 5,
    },

    calcButton: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: THEME_COLORS.FONT_LIGHT,
        borderStyle: 'solid',
        backgroundColor: THEME_COLORS.WHITE,
        justifyContent: 'center',
        alignItems: 'stretch',
        flex: 1,
        margin: 5,
        minHeight: 50,
        height: '100%',
    },

    buttonTouchable: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        borderRadius: 10,
    },

    cardButtonText: {
        fontFamily: 'LibreFranklin-ExtraLight',
        fontSize: 30,
        color: THEME_COLORS.FONT_NORMAL,
        textAlign: 'center',
    },
});

const NUMERIC_DISPLAY_REGEXP = /[\d]*[,]{0,1}[\d]{0,2}/g;

const PaymentInStoreCalculator = ({
    OnAmountInput,
}: {
    OnAmountInput: (e: number) => void;
}) => {
    const [displayValue, setDisplayValue] = useState('0');
    const { paymentInStoreLimit, loading } = useParameters();

    if (loading) {
        return (<Loader />);
    }

    const infoText = "Cantidad máxima permitida: $" + paymentInStoreLimit?.toLocaleString("es-ar", { maximumFractionDigits: 2 });

    useEffect(() => {
        const inputValue = +(displayValue.replace(",", "."));
        OnAmountInput(inputValue);
    }, [displayValue]);

    const onNumberButtonPressed = (value: string) => {
        let newValue = displayValue === "0" && value !== "," ? value : displayValue + value;
        const displayValidValue = newValue.match(NUMERIC_DISPLAY_REGEXP);
        if (displayValidValue && displayValidValue[0]) {
            setDisplayValue(displayValidValue[0]);
        }
    };

    const onDeleteButtonPressed = () => {
        const newDisplayValue = displayValue.slice(0, -1);
        if (displayValue === '0' || newDisplayValue === '') {
            setDisplayValue('0');
        } else {
            setDisplayValue(newDisplayValue);
        }
    };

    return (
        <View style={styles.calcContainer}>
            <View style={styles.calcInputValueContainer}>
                <Text style={styles.calcInputValue} numberOfLines={1}>
                    ${displayValue}
                </Text>
            </View>

            <View style={styles.calcResultContainer}>
                <Text style={[styles.calcResultLabel, { color: THEME_COLORS.VIOLET }]}>{infoText}</Text>
            </View>

            <View style={styles.calcPadContainer}>
                <View style={styles.calcRow}>
                    <View style={styles.calcButton}>
                        <TouchableWithoutFeedback
                            onPress={() => onNumberButtonPressed('1')}
                            style={styles.buttonTouchable}>
                            <Text style={styles.cardButtonText}>1</Text>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={styles.calcButton}>
                        <TouchableWithoutFeedback
                            onPress={() => onNumberButtonPressed('2')}
                            style={styles.buttonTouchable}>
                            <Text style={styles.cardButtonText}>2</Text>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={styles.calcButton}>
                        <TouchableWithoutFeedback
                            onPress={() => onNumberButtonPressed('3')}
                            style={styles.buttonTouchable}>
                            <Text style={styles.cardButtonText}>3</Text>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
                <View style={styles.calcRow}>
                    <View style={styles.calcButton}>
                        <TouchableWithoutFeedback
                            onPress={() => onNumberButtonPressed('4')}
                            style={styles.buttonTouchable}>
                            <Text style={styles.cardButtonText}>4</Text>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={styles.calcButton}>
                        <TouchableWithoutFeedback
                            onPress={() => onNumberButtonPressed('5')}
                            style={styles.buttonTouchable}>
                            <Text style={styles.cardButtonText}>5</Text>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={styles.calcButton}>
                        <TouchableWithoutFeedback
                            onPress={() => onNumberButtonPressed('6')}
                            style={styles.buttonTouchable}>
                            <Text style={styles.cardButtonText}>6</Text>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
                <View style={styles.calcRow}>
                    <View style={styles.calcButton}>
                        <TouchableWithoutFeedback
                            onPress={() => onNumberButtonPressed('7')}
                            style={styles.buttonTouchable}>
                            <Text style={styles.cardButtonText}>7</Text>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={styles.calcButton}>
                        <TouchableWithoutFeedback
                            onPress={() => onNumberButtonPressed('8')}
                            style={styles.buttonTouchable}>
                            <Text style={styles.cardButtonText}>8</Text>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={styles.calcButton}>
                        <TouchableWithoutFeedback
                            onPress={() => onNumberButtonPressed('9')}
                            style={styles.buttonTouchable}>
                            <Text style={styles.cardButtonText}>9</Text>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
                <View style={styles.calcRow}>
                    <View style={styles.calcButton}>
                        <TouchableWithoutFeedback
                            onPress={() => onNumberButtonPressed(',')}
                            style={styles.buttonTouchable}>
                            <Text style={styles.cardButtonText}>,</Text>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={styles.calcButton}>
                        <TouchableWithoutFeedback
                            onPress={() => onNumberButtonPressed('0')}
                            style={styles.buttonTouchable}>
                            <Text style={styles.cardButtonText}>0</Text>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={styles.calcButton}>
                        <TouchableWithoutFeedback
                            onPress={() => onDeleteButtonPressed()}
                            style={styles.buttonTouchable}>
                            <CalcDeleteIcon style={{ alignSelf: 'center' }} />
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default PaymentInStoreCalculator;
