import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import THEME_COLORS from '../styles/theme.styles';
import CheckIcon from '../assets/icons/ic_check.svg';
import Button from './button.component';
import OperationType from '../models/operation-type.enum';

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME_COLORS.WHITE,
    borderRadius: 10,
    elevation: 2,
    paddingTop: 53,
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
    fontFamily: 'LibreFranklin-Regular',
    fontSize: 18,
    marginBottom: 30,
    alignSelf: 'center',
    textAlign: 'center',
  },
  valueLabel: {
    color: THEME_COLORS.SUCCESS,
    fontFamily: 'LibreFranklin-Regular',
    fontSize: 30,
    marginBottom: 35,
    alignSelf: 'center',
    textAlign: 'center',
  },
  operationLabel: {
    color: THEME_COLORS.PRIMARY,
    fontFamily: 'LibreFranklin-Medium',
    fontSize: 16,
    alignSelf: 'center',
    marginBottom: 30,
    textAlign: 'center',
  },
});

const OperationCompletedCard = ({
  operation,
  type,
  value,
  exchange,
  onPress,
}: {
  operation: string;
  type: OperationType;
  value?: number;
  exchange?: string;
  onPress?: () => void;
}) => {
  const ValueLabel = () => {
    if (value) {
      return <Text style={styles.valueLabel}>{'$ ' + value}</Text>;
    }
    return null;
  };

  const ExchangeLabel = () => {
    if (exchange) {
      return <Text style={styles.titleLabel}>{'Canjeaste ' + exchange}</Text>;
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <CheckIcon style={styles.icon} width={102.16} height={100} />
      <View style={styles.separatorLine} />
      <Text style={styles.titleLabel}>
        {type === OperationType.Withdrawal
          ? 'Retiraste'
          : type === OperationType.PaymentInStore
          ? 'Pagaste en tienda'
          : type === OperationType.Exchange
          ? 'Operación realizada'
          : 'Operación realizada con éxito'}
      </Text>
      <ExchangeLabel />
      <ValueLabel />
      <Text style={styles.operationLabel}>Operación {operation}</Text>
      <Button label="Aceptar" onPress={onPress} />
    </View>
  );
};

export default OperationCompletedCard;
