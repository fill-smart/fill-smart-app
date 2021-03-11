import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import THEME_COLORS from '../../styles/theme.styles';
import CalcDeleteIcon from '../../assets/icons/ic_calc_delete.svg';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
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
    borderBottomColor: THEME_COLORS.SECONDARY,
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
    borderColor: THEME_COLORS.SECONDARY,
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
    justifyContent: 'center',
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
    color: THEME_COLORS.SECONDARY,
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

  notAmountMessage: {
    fontFamily: 'LibreFranklin-Regular',
    fontSize: 12,
    color: THEME_COLORS.DANGER,
    marginHorizontal: 12,
    textAlign: "left",
  },

  amountLitresMsg: {
    fontFamily: 'LibreFranklin-Regular',
    fontSize: 12,
    color: THEME_COLORS.SECONDARY,
    marginHorizontal: 12,
    textAlign: "left",
  }
});

function showWalletAmountExceededMessage(
  inputAmount: number,
  availableLitres: number,
  litresPrice: number,
  selectedMode: "litresMode" | "priceMode"
): boolean {
  let result = false;
  if (selectedMode === "litresMode") {
    return availableLitres < inputAmount;
  }
  if (selectedMode === "priceMode") {
    return (availableLitres * litresPrice) < inputAmount;
  }
  return result;
}

const ExchangeCalculator = ({
  sourceWalletLitrePrice,
  targetWalletLitrePrice,
  sourceWalletAvailableLitres,
  targetWalletTotalLitres,
  onLitresCalculated,
}: {
  sourceWalletLitrePrice: number;
  targetWalletLitrePrice: number;
  sourceWalletAvailableLitres: number;
  targetWalletTotalLitres: number;
  onLitresCalculated: (sourceLitres: number, targetLitres: number) => void;
}) => {
  const [displayValue, setDisplayValue] = useState("0");
  const [equivalency, setEquivalency] = useState(0);
  const [isLitreTabSelected, setIsLitreTabSelected] = useState(true);
  const [walletAmountInsufficientMessage, setWalletAmountInsufficientMessage] = useState(false);
  const [walletLimitExceededMessage, setWalletLimitExceededMessage] = useState(false);
  const { walletLitresLimit } = useParameters();

  const litreSuffix = isLitreTabSelected ? ' lt' : '';
  const dollarSign = isLitreTabSelected ? '' : '$';
  const litreTabStyle = isLitreTabSelected
    ? styles.calcTabActive
    : styles.calcTab;
  const moneyTabStyle = isLitreTabSelected
    ? styles.calcTab
    : styles.calcTabActive;

  const checkWalletLimitExceeded = (litreEquivalency: number): boolean => {
      return (litreEquivalency  + targetWalletTotalLitres!) > walletLitresLimit!;
  };

  useEffect(() => {
    setEquivalency(calculateEquivalency(displayValue));
  }, [sourceWalletLitrePrice, targetWalletLitrePrice]);

  useEffect(() => {
    onLitresCalculated(isLitreTabSelected ? +displayValue.replace(",", ".") : (+displayValue.replace(",", ".") / sourceWalletLitrePrice), equivalency);
  }, [displayValue]);

  const changeTabs = (toLitreTab: boolean) => {
    if (sourceWalletLitrePrice && targetWalletLitrePrice) {
      if (displayValue !== "0" && toLitreTab !== isLitreTabSelected) {
        setDisplayValue(!toLitreTab
          ? (+displayValue.replace(",", ".") * sourceWalletLitrePrice).toFixed(2).replace(".", ",")
          : (+displayValue.replace(",", ".") / sourceWalletLitrePrice).toFixed(2).replace(".", ","));
      }
      setIsLitreTabSelected(toLitreTab);
    }
  };

  const calculateEquivalency = (displayValue: string) => {
    let result = 0;
    if (sourceWalletLitrePrice && targetWalletLitrePrice) {
      result =
        isLitreTabSelected
          ? (+displayValue.replace(",", ".") * sourceWalletLitrePrice / targetWalletLitrePrice)
          : (+displayValue.replace(",", ".") / targetWalletLitrePrice);
    };
    return result;
  };

  const onNumberButtonPressed = (value: string) => {
    let newDisplayValue = displayValue !== '0'
      ? displayValue.slice(-3, -2) === ","
        ? displayValue : displayValue + value
      : value;

    const amountExceededMessage = showWalletAmountExceededMessage(
      +newDisplayValue.replace(",", "."),
      sourceWalletAvailableLitres,
      sourceWalletLitrePrice,
      isLitreTabSelected ? "litresMode" : "priceMode");
    setWalletAmountInsufficientMessage(amountExceededMessage);
    if (amountExceededMessage) {
      return;
    }

    if (!isLitreTabSelected && (sourceWalletAvailableLitres * sourceWalletLitrePrice) < +newDisplayValue.replace(",", ".")) {
      setWalletAmountInsufficientMessage(true);
      return;
    } else {
      setWalletAmountInsufficientMessage(false);
    }

    const nextEquivalency = calculateEquivalency(newDisplayValue);
    const walletLimitExceeded = checkWalletLimitExceeded(nextEquivalency);
    setWalletLimitExceededMessage(walletLimitExceeded);
    if (walletLimitExceeded) {
      return;
    }
    setEquivalency(nextEquivalency);
    setDisplayValue(newDisplayValue);
  };

  const onDeleteButtonPressed = () => {
    const newDisplayValue = displayValue.slice(0, -1);
    if (displayValue === '0' || newDisplayValue === '') {
      setEquivalency(calculateEquivalency("0"));
      setDisplayValue("0");
    } else {
      setEquivalency(calculateEquivalency(newDisplayValue));
      setDisplayValue(newDisplayValue);
    }

    const amountExceededMessage = showWalletAmountExceededMessage(
      +newDisplayValue.replace(",", "."),
      sourceWalletAvailableLitres,
      sourceWalletLitrePrice,
      isLitreTabSelected ? "litresMode" : "priceMode");
    setWalletAmountInsufficientMessage(amountExceededMessage);

    const walletLimitExceeded = checkWalletLimitExceeded(equivalency);
    setWalletLimitExceededMessage(walletLimitExceeded);
  };

  const onPointButtonPressed = () => {
    if (displayValue.indexOf(',') === -1) {
      setDisplayValue(displayValue + ",");
    };
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
          {dollarSign}
          {displayValue}
          {litreSuffix}
        </Text>
      </View>
      <View style={styles.equivalencyContainer}>
        <Text style={styles.calcResultLabel}>Equivale a </Text>
        <Text style={styles.calcResultValue}>
          {equivalency.toLocaleString("es-ar", { maximumFractionDigits: 2 })} lt
        </Text>
      </View>
      <View style={styles.calcResultContainer}>
        <Text style={styles.amountLitresMsg}>Máximo permitido por billetera: {walletLitresLimit?.toLocaleString("es-ar", { maximumFractionDigits: 2 })} lt</Text>
      </View>
      {walletAmountInsufficientMessage ?
        <View style={styles.calcResultContainer}>
          <Text style={styles.notAmountMessage}>No puede ingresar un valor mayor que el disponible</Text>
        </View> : null
      }
      {walletLimitExceededMessage ?
        <View style={styles.calcResultContainer}>
          <Text style={styles.notAmountMessage}>No puede exceder el máximo permitido para la billetera</Text>
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
              <CalcDeleteIcon style={{ alignSelf: 'center' }} />
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ExchangeCalculator;
