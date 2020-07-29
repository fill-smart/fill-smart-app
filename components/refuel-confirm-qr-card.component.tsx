import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import THEME_COLORS from '../styles/theme.styles';
import PumpWhiteIcon from '../assets/icons/ic_pump_white.svg';
import Button from './button.component';
import {useNavigation} from 'react-navigation-hooks';
import {getRoutePath, HOME_ROUTE} from '../routing/routes';

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME_COLORS.WHITE,
    borderRadius: 10,
    elevation: 2,
    paddingTop: 25,
    paddingBottom: 20,
    paddingLeft: 50,
    paddingRight: 50,
    alignItems: 'stretch',
  },
  iconBox: {
    borderRadius: 10,
    height: 90,
    width: 90,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME_COLORS.WARNING,
    marginBottom: 20,
  },
  separatorLine: {
    backgroundColor: THEME_COLORS.FONT_LIGHT,
    width: '100%',
    height: 1,
    marginBottom: 15,
  },
  titleLabel: {
    color: THEME_COLORS.FONT_NORMAL,
    fontFamily: 'LibreFranklin-Medium',
    fontSize: 18,
    marginBottom: 20,
    alignSelf: 'center',
  },
  descriptionLabel: {
    color: THEME_COLORS.FONT_NORMAL,
    fontFamily: 'LibreFranklin-Thin',
    fontSize: 18,
    marginBottom: 5,
    alignSelf: 'center',
  },
  amountLabel: {
    color: THEME_COLORS.FONT_REGULAR,
    fontFamily: 'LibreFranklin-Light',
    fontSize: 30,
    marginBottom: 5,
    alignSelf: 'center',
  },
  locationLabel: {
    color: THEME_COLORS.FONT_REGULAR,
    fontFamily: 'LibreFranklin-Medium',
    fontSize: 18,
    alignSelf: 'center',
  },
});

const RefuelConfirmQrCard = ({
  fuel,
  litres,
  money,
  location,
  sublocation,
}: {
  fuel: string;
  litres: number;
  money: number;
  location: string;
  sublocation: string;
}) => {
  const navigation = useNavigation();

  const goFuelSelection = () => {
    navigation.navigate(
      getRoutePath(HOME_ROUTE.RefuelFuelSelection, HOME_ROUTE),
    );
  };

  const LitreAmountLabel = () => {
    const formattedLitres = litres.toLocaleString("es-ar", {
      maximumFractionDigits: 2,
    }) + ' lt';
    return <Text style={styles.amountLabel}>{formattedLitres}</Text>;
  };

  const MoneyAmountLabel = () => {
    const formattedMoney =
      '$' +
      money.toLocaleString("es-ar", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      });
    return (
      <Text style={[styles.amountLabel, {marginBottom: 20}]}>
        {formattedMoney}
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconBox}>
        <PumpWhiteIcon width={55.39} height={38.12} />
      </View>
      <View style={styles.separatorLine} />
      <Text style={styles.titleLabel}>Usted ha cargado</Text>
      <Text style={styles.descriptionLabel}>{fuel}</Text>
      <LitreAmountLabel />
      <Text style={styles.descriptionLabel}>Equivale a</Text>
      <MoneyAmountLabel />
      <Text style={[styles.locationLabel, {marginBottom: 5}]}>{location}</Text>
      <Text style={[styles.locationLabel, {marginBottom: 20}]}>
        {sublocation}
      </Text>
      <Button label="Confirmar" onPress={goFuelSelection} />
    </View>
  );
};

export default RefuelConfirmQrCard;
