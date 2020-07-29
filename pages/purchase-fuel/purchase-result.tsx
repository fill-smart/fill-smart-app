import React, { useContext, useEffect } from 'react';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import { View, Text, StyleSheet } from 'react-native';
import THEME_COLORS from '../../styles/theme.styles';
import ShowStatusBarLayout from '../../layouts/show-status-bar.layout';
import CheckIcon from '../../assets/icons/ic_check.svg';
import InfoIcon from '../../assets/icons/ic_info.svg'
import Button from '../../components/button.component';
import {
  FcmContext,
  FCM_ACTIONS,
  PushNotificationTypesEnum,
} from '../../contexts/fcm.context';
import {
  PurchaseFuelContext,
  PURCHASE_FUEL_ACTIONS,
} from '../../contexts/purchase-fuel.context';
import { getRoutePath, HOME_ROUTE, APP_ROUTES } from '../../routing/routes';
import useWallets from '../../hooks/use-wallets';
import { StackActions, NavigationActions } from 'react-navigation';
import useFcmNotifications from '../../hooks/use-fcm-notification.hook';
import useOperations from '../../hooks/use-operations';
import styled from 'styled-components/native';
import { operationsRefetch } from '../home/home';


const IconTextContainer = styled.View` 
  flex-direction: row;
`;

const InfoCard = styled.View`
  flex-direction: row;
  height: 60px;
  align-items: center;
  background-color: ${THEME_COLORS.WHITE};
  border-radius: 5px;
  padding-left: 10px;
  padding-right: 10px;
  margin-bottom: 20px;
  elevation: 2;
`;

const InfoText = styled.Text`
  font-family: LibreFranklin-Thin;
  font-size: 14px;
  color: ${THEME_COLORS.FONT_NORMAL};
  margin-left: 10px;
  flex: 1;
`;

const styles = StyleSheet.create({
  container: {
    padding: 25,
  },
  cardConfirm: {
    backgroundColor: THEME_COLORS.WHITE,
    borderRadius: 10,
    elevation: 2,
    paddingTop: 50,
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
    fontFamily: 'LibreFranklin-Medium',
    fontSize: 18,
    alignSelf: 'center',
    textAlign: 'center',
    marginVertical: 7,
  },
  productLabel: {
    color: THEME_COLORS.FONT_NORMAL,
    fontFamily: 'LibreFranklin-Thin',
    fontSize: 18,
    alignSelf: 'center',
    textAlign: 'center',
    marginVertical: 7,
  },
  valueLabel: {
    color: THEME_COLORS.FONT_REGULAR,
    fontFamily: 'LibreFranklin-Light',
    fontSize: 30,
    alignSelf: 'center',
    textAlign: 'center',
  },
  operationLabel: {
    color: THEME_COLORS.PRIMARY,
    fontFamily: 'LibreFranklin-Medium',
    fontSize: 16,
    alignSelf: 'center',
    textAlign: 'center',
    marginVertical: 30,
  },
});

const PurchaseResult = () => {
  const navigation = useNavigation();
  const [_, dispatchFcm] = useContext(FcmContext);
  // const {notification} = useFcmNotifications<{receiptId: string}>(
  //   PushNotificationTypesEnum.PurchaseSuccess,
  // );
  const receiptId = useNavigationParam("operationId");
  const [purchase, dispatchPurchase] = useContext(PurchaseFuelContext);
  const walletsHook = useWallets();

  useEffect(() => {
    walletsHook.refetch();
    operationsRefetch();
  }, []);

  const finishPurchase = () => {
    dispatchFcm({
      type: FCM_ACTIONS.CLEAR_NOTIFICATION,
    });
    dispatchPurchase({
      type: PURCHASE_FUEL_ACTIONS.CLEAR_PURCHASE,
    });

    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: getRoutePath(APP_ROUTES.Main, APP_ROUTES),
        }),
      ],
    });
    navigation.dispatch(resetAction);
  };

  if (!purchase.purchaseFuelAndQuantity) {
    return null;
  }

  return (
    <ShowStatusBarLayout>
      <View style={styles.container}>
        <InfoCard>
          <IconTextContainer>
            <InfoIcon />
            <InfoText>Los litros de esta compra estarán disponibles a partir del {purchase.availabilityDate}</InfoText>
          </IconTextContainer>
        </InfoCard>

        <View style={styles.cardConfirm}>
          <CheckIcon style={styles.icon} width={102.16} height={100} />
          <View style={styles.separatorLine} />
          <Text style={styles.titleLabel}>Compraste</Text>
          <Text style={styles.productLabel}>
            {purchase.purchaseFuelAndQuantity?.fuelType.name}
          </Text>
          <Text style={styles.valueLabel}>
            {purchase.purchaseFuelAndQuantity?.litres.toLocaleString(
              "es-ar",
              { maximumFractionDigits: 2 },
            )}{' '}
            lt
          </Text>
          <Text style={styles.productLabel}>Equivale a</Text>
          <Text style={styles.valueLabel}>
            $
            {(
              purchase.purchaseFuelAndQuantity?.litres! *
              purchase.purchaseFuelAndQuantity?.fuelPrice.price!
            ).toLocaleString("es-ar", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
          </Text>
          <Text style={styles.operationLabel}>Operación {receiptId.padStart(8, "0")}</Text>
          <Button label="Aceptar" onPress={finishPurchase} />
        </View>
      </View>
    </ShowStatusBarLayout>
  );
};

PurchaseResult.navigationOptions = {
  title: 'Comprar',
};

export default PurchaseResult;
