import React, {useState, useEffect, useContext} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import THEME_COLORS from '../styles/theme.styles';
import CalcDeleteIcon from '../assets/icons/ic_calc_delete.svg';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import Environment from '../environment/environment';
import useParameters from '../hooks/use-parameters.hook';
import Loader from './loader.component';
import useWallets from '../hooks/use-wallets';
import { FuelTypeWithCurrentPriceRecord } from '../hooks/use-fuel-types-with-current-price.hook';

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
  },

  calcTabContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    marginBottom: 18,
    height: 50,
  },

  calcTab: {
    flex: 1,
    borderBottomColor: THEME_COLORS.LINES,
    borderBottomWidth: 2,
    borderStyle: 'solid',
  },

  calcTabActive: {
    flex: 1,
    paddingHorizontal: 12,
    borderBottomColor: THEME_COLORS.PRIMARY,
    borderBottomWidth: 2,
    borderStyle: 'solid',
    height: '100%',
  },

  tabTouchable: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
  },

  calcTabText: {
    fontFamily: 'LibreFranklin-Regular',
    fontSize: 14,
    color: THEME_COLORS.FONT_NORMAL,
    textAlign: 'center',
  },

  calcInputValueContainer: {
    borderRadius: 5,
    borderWidth: 2,
    borderColor: THEME_COLORS.PRIMARY,
    borderStyle: 'solid',
    backgroundColor: THEME_COLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    marginHorizontal: 12,
  },

  calcInputValue: {
    fontFamily: 'LibreFranklin-Regular',
    fontSize: 30,
    color: THEME_COLORS.FONT_REGULAR,
  },

  calcResultContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 5,
    flex: 1, 
    flexWrap: 'wrap'
  },

  equivalencyContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    flex: 1, 
    flexWrap: 'wrap'
  },

  calcResultLabel: {
    fontFamily: 'LibreFranklin-Regular',
    fontSize: 16,
    color: THEME_COLORS.FONT_BOLD,
    marginRight: 5,
  },

  calcResultValue: {
    fontFamily: 'LibreFranklin-Thin',
    fontSize: 30,
    color: THEME_COLORS.PRIMARY,
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
});

let equivalency = 0;

const PurchaseCalculator = ({
  selectedFuelType,
  onLitresCalculated,
}: {
  selectedFuelType: FuelTypeWithCurrentPriceRecord;
  onLitresCalculated: (e: number) => void;
}) => {
  const conversionRate = selectedFuelType.currentPrice.price;
  const [displayValue, setDisplayValue] = useState("0");
  const [isLitreTabSelected, setIsLitreTabSelected] = useState(true);
  const { purchaseMaxLitres, walletLitresLimit, accountLitresLimit, loading } = useParameters();
  const { wallets } = useWallets();
  const litresInWallet = wallets?.find(wallet => wallet.fuelType.name === selectedFuelType.name)?.litres;
  const litresInAccount = wallets?.reduce((acc, cur) => acc + cur.litres, 0);
  const [walletLimitExceededMessage, setWalletLitresExceededMessage] = useState(false);
  const [accountLimitExceededMessage, setAccountLimitExceededMessage] = useState(false);

  if (loading) {
    return (<Loader />);
  }

  const infoText = "Cantidad máxima permitida: " + purchaseMaxLitres?.toLocaleString("es-ar", { maximumFractionDigits: 2 }) + " lt";
  const litreSuffixUpper = isLitreTabSelected ? ' lt' : '';
  const dollarSignUpper = isLitreTabSelected ? '' : '$';
  const litreSuffixLower = isLitreTabSelected ? '' : ' lt';
  const dollarSignLower = isLitreTabSelected ? '$' : '';
  const litreTabStyle = isLitreTabSelected
    ? styles.calcTabActive
    : styles.calcTab;
  const moneyTabStyle = isLitreTabSelected
    ? styles.calcTab
    : styles.calcTabActive;

  const checkWalletLimitExceeded = (inputAmount: number): boolean => {
    if (isLitreTabSelected) {
      return (inputAmount + litresInWallet!) > walletLitresLimit!;
    } else {
      return (inputAmount / conversionRate + litresInWallet!) > walletLitresLimit!;
    }
  }

  const checkAccountLimitExceeded = (inputAmount: number): boolean => {
    if (isLitreTabSelected) {
      return (inputAmount + litresInAccount!) > accountLitresLimit!;
    } else {
      return (inputAmount / conversionRate + litresInAccount!) > accountLitresLimit!;
    }
  }

  useEffect(() => {
    calculateEquivalency(displayValue);
  }, [conversionRate]);

  const changeTabs = (toLitreTab: boolean) => {
    const prevDisplayValue = +displayValue.replace(",",".");
    const newDisplayValue = equivalency.toString().replace(".",",");
    equivalency = prevDisplayValue;
    setDisplayValue(newDisplayValue);
    setIsLitreTabSelected(toLitreTab);
  };

  const calculateEquivalency = (displayValue: string) => {
    const displayValueNumber = +displayValue.replace(",",".");
    const litres = isLitreTabSelected
      ? displayValueNumber
      : displayValueNumber / conversionRate;
    onLitresCalculated(litres);
    equivalency =
      isLitreTabSelected
        ? +(displayValueNumber * conversionRate).toFixed(2)
        : +(displayValueNumber / conversionRate).toFixed(2);
  };

  const onNumberButtonPressed = (value: string) => {
    if (!checkMaxLitresReached(value)) {
      const newDisplayValue = displayValue !== '0' 
      ? displayValue.slice(-3,-2) === ","
      ? displayValue : displayValue + value 
      : value;

      const walletLimitExceeded = checkWalletLimitExceeded(+newDisplayValue.replace(",", "."));
      setWalletLitresExceededMessage(walletLimitExceeded);
      if (walletLimitExceeded) {
        return;
      }

      const accountLimitExceeded = checkAccountLimitExceeded(+newDisplayValue.replace(",", "."));
      setAccountLimitExceededMessage(accountLimitExceeded);
      if (accountLimitExceeded) {
        return;
      }

      calculateEquivalency(newDisplayValue);
      setDisplayValue(newDisplayValue);
    }
  };

  const onDeleteButtonPressed = () => {
    const newDisplayValue = displayValue.slice(0, -1);
    if (displayValue === '0' || newDisplayValue === '') {
      calculateEquivalency("0");
      setDisplayValue("0");
    } else {

      const walletLimitExceeded = checkWalletLimitExceeded(+newDisplayValue.replace(",", "."));
      setWalletLitresExceededMessage(walletLimitExceeded);

      const accountLimitExceeded = checkAccountLimitExceeded(+newDisplayValue.replace(",", "."));
      setAccountLimitExceededMessage(accountLimitExceeded);

      calculateEquivalency(newDisplayValue);
      setDisplayValue(newDisplayValue);
    }
  };

  const onPointButtonPressed = () => {
    if (!checkMaxLitresReached("")) {
      if (displayValue.indexOf(',') === -1) {
        setDisplayValue(displayValue + ",");
      }
    }
  };

  const checkMaxLitresReached = (value: string): boolean => {
    return isLitreTabSelected ?
      +(displayValue + value) > purchaseMaxLitres!
    : +(displayValue + value) / conversionRate > purchaseMaxLitres!;
  };

  return (
    <View style={styles.calcContainer}>
      <View style={styles.calcTabContainer}>
        <View style={litreTabStyle}>
          <TouchableWithoutFeedback
            onPress={() => changeTabs(true)}
            style={styles.tabTouchable}>
            <Text style={styles.calcTabText}>Litros</Text>
          </TouchableWithoutFeedback>
        </View>
        <View style={moneyTabStyle}>
          <TouchableWithoutFeedback
            onPress={() => changeTabs(false)}
            style={styles.tabTouchable}>
            <Text style={styles.calcTabText}>Pesos</Text>
          </TouchableWithoutFeedback>
        </View>
      </View>

      <View style={styles.calcInputValueContainer}>
        <Text style={styles.calcInputValue} numberOfLines={1} ellipsizeMode="head">
          {dollarSignUpper}
          {displayValue}
          {litreSuffixUpper}
        </Text>
      </View>

      <View style={styles.equivalencyContainer}>
        <Text style={styles.calcResultLabel}>Equivale a </Text>
        <Text style={styles.calcResultValue}>
          {dollarSignLower}
          {equivalency.toLocaleString("es-ar")}
          {litreSuffixLower}
        </Text>
      </View>

      <View style={styles.calcResultContainer}>
          <Text style={styles.amountLitresMsg}>{infoText}</Text>
      </View>  

      <View style={styles.calcResultContainer}>
        <Text style={styles.amountLitresMsg}>Máximo permitido por billetera: {walletLitresLimit?.toLocaleString("es-ar", { maximumFractionDigits: 2 })} lt 
        ({litresInWallet?.toLocaleString("es-ar", { maximumFractionDigits: 2 })} lt en la billetera seleccionada)</Text>
      </View>

      <View style={styles.calcResultContainer}>
        <Text style={styles.amountLitresMsg}>Máximo permitido en la cuenta: {accountLitresLimit?.toLocaleString("es-ar", { maximumFractionDigits: 2 })} lt 
        ({litresInAccount?.toLocaleString("es-ar", { maximumFractionDigits: 2 })} lt actualmente en cuenta)</Text>
      </View>
      {walletLimitExceededMessage ?
        <View style={styles.calcResultContainer}>
          <Text style={styles.notAmountMessage}>No puede exceder el máximo permitido para la billetera</Text>
        </View> : null
      }
      {accountLimitExceededMessage ?
        <View style={styles.calcResultContainer}>
          <Text style={styles.notAmountMessage}>No puede exceder el máximo permitido para la cuenta</Text>
        </View> : null
      }

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

export default PurchaseCalculator;
