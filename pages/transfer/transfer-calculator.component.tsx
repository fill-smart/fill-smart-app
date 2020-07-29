import React, {useState, useEffect, useContext} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import CalcDeleteIcon from '../../assets/icons/ic_calc_delete.svg';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import THEME_COLORS from '../../styles/theme.styles';
import useWallets, { WalletRecord } from '../../hooks/use-wallets';
import { FuelTypeWithCurrentPriceRecord } from '../../hooks/use-fuel-types-with-current-price.hook';
import useParameters from '../../hooks/use-parameters.hook';
import Loader from '../../components/loader.component';


const styles = StyleSheet.create({
  //CALC STYLES
  calcContainer: {
    flex: 1,
    marginHorizontal: 25,
    borderRadius: 5,
    backgroundColor: THEME_COLORS.WHITE,
    elevation: 2,
    justifyContent: 'space-evenly',
    paddingBottom: 12,
    paddingTop: 12,
  },

  calcInputValueContainer: {
    borderRadius: 5,
    borderWidth: 2,
    borderColor: THEME_COLORS.TRANSFER_LITRES,
    borderStyle: 'solid',
    backgroundColor: THEME_COLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    marginHorizontal: 12,
    marginBottom: 25
  },

  calcInputValue: {
    fontFamily: 'LibreFranklin-Regular',
    fontSize: 30,
    color: THEME_COLORS.FONT_REGULAR,
  },

  calcResultContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 10
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

  amountLitresMsg: {
    fontFamily: 'LibreFranklin-Regular',
    fontSize: 12,
    color: THEME_COLORS.PRIMARY,
    marginHorizontal: 12,
    textAlign: "left",
  },

  notAmountMessage: {
    fontFamily: 'LibreFranklin-Regular',
    fontSize: 12,
    color: THEME_COLORS.DANGER,
    marginHorizontal: 12,
    textAlign: "left",
  },

  calcTabContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    marginBottom: 18,
    height: 35,
  },

  calcTab: {
    flex: 1,
    borderBottomColor: THEME_COLORS.TRANSFER_LITRES,
    borderBottomWidth: 2,
    borderStyle: 'solid',
  },

  calcTabText: {
    fontFamily: 'LibreFranklin-Regular',
    fontSize: 14,
    color: THEME_COLORS.FONT_NORMAL,
    textAlign: 'center',
    marginTop: 5
  },

  tabTouchable: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
  },
});

const TransferCalculator = ({
  selectedFuelType,
  onLitresCalculated,
}: {
  selectedFuelType: WalletRecord;
  onLitresCalculated: (e: number) => void;
}) => {
  const [displayValue, setDisplayValue] = useState("0");
  const { wallets } = useWallets();

  useEffect(() => {
    onLitresCalculated(+displayValue.replace(",","."));
  }, [displayValue]);

  const onNumberButtonPressed = (value: string) => {
    const newDisplayValue = displayValue !== '0' 
    ? displayValue.slice(-3,-2) === ","
    ? displayValue : displayValue + value 
    : value;
    setDisplayValue(newDisplayValue);
  };

  const onDeleteButtonPressed = () => {
    const newDisplayValue = displayValue.slice(0, -1);
    if (displayValue === '0' || newDisplayValue === '') {
      setDisplayValue("0");
    } else {
      setDisplayValue(newDisplayValue);
    }
  };

  const onPointButtonPressed = () => {
    if (displayValue.indexOf(',') === -1) {
    setDisplayValue(displayValue + ",");
    }
  };

  return (
    <View style={styles.calcContainer}>
      <View style={styles.calcTabContainer}>
        <View style={styles.calcTab}>
            <Text style={styles.calcTabText}>Litros</Text>
        </View>
      </View>

      <View style={styles.calcInputValueContainer}>
        <Text style={styles.calcInputValue} numberOfLines={1} ellipsizeMode="head">
          {displayValue + ' lt'}
        </Text>
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
              onPress={() => onPointButtonPressed()}
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
              <CalcDeleteIcon style={{alignSelf: 'center'}} />
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TransferCalculator;
