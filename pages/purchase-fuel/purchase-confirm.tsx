import React, { useState, useContext, useEffect } from 'react';
import { useNavigation } from 'react-navigation-hooks';
import ShowStatusBarLayout from '../../layouts/show-status-bar.layout';
import Button from '../../components/button.component';
import { getRoutePath, HOME_ROUTE } from '../../routing/routes';
import PurchaseDetail from '../../components/purchase-detail.component';
import styled from 'styled-components/native';
import { View, Text } from 'react-native';
import InfoIcon from '../../assets/icons/ic_info.svg'
import MercadoPagoIcon from '../../assets/icons/ic_mercadopago.svg'
import MercadoPagoWhiteIcon from '../../assets/icons/ic_mercadopago_white.svg'
import ArrowRightIcon from '../../assets/icons/ic_arrow_simple_right_blue.svg'
import MoneyIcon from '../../assets/icons/ic_money.svg'
import MoneyWhiteIcon from '../../assets/icons/ic_money_white.svg'
import CreditCardIcon from '../../assets/icons/ic_creditcard.svg'
import CreditCardWhiteIcon from '../../assets/icons/ic_creditcard_white.svg'
import THEME_COLORS from '../../styles/theme.styles';
import moment from 'moment';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Loader from '../../components/loader.component';
import PaymentMethod from '../../models/payment-method.enum';
import { PurchaseFuelContext, PURCHASE_FUEL_ACTIONS } from '../../contexts/purchase-fuel.context';
import { StackNavigationProp } from 'react-navigation-stack/lib/typescript/src/vendor/types';
import { NavigationActions } from 'react-navigation';

const Container = styled.View`
  flex: 1;
  padding: 25px;
`;

const ExpandedView = styled.View`
  flex: 1;
`;

const InfoCard = styled.View`
  flex-direction: row;
  height: 60px;
  align-items: center;
  background-color: ${THEME_COLORS.WHITE};
  border-radius: 5px;
  padding-left: 10px;
  padding-right: 10px;
  margin-bottom: 25px;
  elevation: 2;
`;

const InfoText = styled.Text`
  font-family: LibreFranklin-Thin;
  font-size: 14px;
  color: ${THEME_COLORS.FONT_NORMAL};
  margin-left: 10px;
  flex: 1;
`;

const PaymentCardContainer = styled.View`
  margin-left: -25px;
  margin-right: -25px;
`;

const IconTextContainer = styled.View` 
  flex-direction: row;
`;

const PaymentTypeCard = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${THEME_COLORS.WHITE};
  border-radius: 5px;
  height: 50px;
  margin: 25px;
  margin-top: 0px;
  padding-left: 10px;
  padding-right: 10px;
  elevation: 2;
`;

const SelectedPaymentTypeCard = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${THEME_COLORS.PRIMARY};
  border-radius: 5px;
  height: 50px;
  margin: 25px;
  margin-top: 0px;
  padding-left: 10px;
  padding-right: 10px;
  elevation: 2;
`;

const PaymentTypeText = styled.Text`
  font-family: LibreFranklin-Light;
  font-size: 16px;
  color: ${THEME_COLORS.FONT_REGULAR};
  margin-left: 10px;
`;

const SelectedPaymentTypeText = styled.Text`
  font-family: LibreFranklin-Medium;
  font-size: 16px;
  color: ${THEME_COLORS.WHITE};
  margin-left: 10px;
`;


const PurchaseConfirm = () => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [purchase, dispatch] = useContext(PurchaseFuelContext);
  const navigation = useNavigation() as StackNavigationProp;;
  const [waitExecute, setWaitExecute] = useState(false);

  useEffect(() => {
    if (paymentMethod) {
      dispatch({
        type: PURCHASE_FUEL_ACTIONS.SET_PAYMENT_METHOD,
        payload: {
          paymentMethod: paymentMethod
        }
      });
    };
  }, [paymentMethod]);

  if (waitExecute) {
    return <Loader />;
  }

  const goToPurchase = () => {
    setWaitExecute(true);
    switch (paymentMethod) {
      case PaymentMethod.Mercadopago:
        navigation.reset([
          NavigationActions.navigate({ routeName: getRoutePath(HOME_ROUTE.Home, HOME_ROUTE) }),
          NavigationActions.navigate({ routeName: getRoutePath(HOME_ROUTE.PurchasePayment, HOME_ROUTE) })
        ], 1);
        // navigation.navigate(
        //   getRoutePath(HOME_ROUTE.PurchasePayment, HOME_ROUTE),
        // );
        break;
      case PaymentMethod.Cash:
        navigation.reset([
          NavigationActions.navigate({ routeName: getRoutePath(HOME_ROUTE.Home, HOME_ROUTE) }),
          NavigationActions.navigate({ routeName: getRoutePath(HOME_ROUTE.PurchaseQrScan, HOME_ROUTE) })
        ], 1);
      // navigation.navigate(
      //   getRoutePath(HOME_ROUTE.PurchaseQrScan, HOME_ROUTE),
      // );
      default:
        break;
    }
  };

  const MercadoPagoButton = () =>
    paymentMethod === PaymentMethod.Mercadopago ?
      <SelectedPaymentTypeCard>
        <MercadoPagoWhiteIcon />
      </SelectedPaymentTypeCard>
      :
      <PaymentTypeCard>
        <MercadoPagoIcon />
      </PaymentTypeCard>

  // const CardButton = () =>
  //   paymentMethod === PaymentMethod.Card ?
  //       <SelectedPaymentTypeCard>
  //         <IconTextContainer>
  //           <CreditCardWhiteIcon/>
  //           <SelectedPaymentTypeText>Tarjeta Débito / Crédito</SelectedPaymentTypeText>
  //         </IconTextContainer>
  //       </SelectedPaymentTypeCard>
  //   :
  //       <PaymentTypeCard>
  //         <IconTextContainer>
  //           <CreditCardIcon />
  //           <PaymentTypeText>Tarjeta Débito / Crédito</PaymentTypeText>
  //         </IconTextContainer>
  //       </PaymentTypeCard>

  const CashButton = () =>
    paymentMethod === PaymentMethod.Cash ?
      <SelectedPaymentTypeCard>
        <IconTextContainer>
          <MoneyWhiteIcon />
          <SelectedPaymentTypeText>Efectivo</SelectedPaymentTypeText>
        </IconTextContainer>
      </SelectedPaymentTypeCard>
      :
      <PaymentTypeCard>
        <IconTextContainer>
          <MoneyIcon />
          <PaymentTypeText>Efectivo</PaymentTypeText>
        </IconTextContainer>
      </PaymentTypeCard>

  return (
    <ShowStatusBarLayout>
      <Container>
        <ExpandedView>
          <InfoCard>
            <IconTextContainer>
              <InfoIcon />
              <InfoText>Los litros de esta compra estarán disponibles a partir del {purchase.availabilityDate}</InfoText>
            </IconTextContainer>
          </InfoCard>

          <PurchaseDetail />

          <View style={{ marginBottom: 25 }} />

          <PaymentCardContainer>
            <TouchableWithoutFeedback onPress={() => setPaymentMethod(PaymentMethod.Mercadopago)}>
              <MercadoPagoButton />
            </TouchableWithoutFeedback>

            {/* <TouchableWithoutFeedback onPress={() => setPaymentMethod(PaymentMethod.Card)}>
              <CardButton/>
            </TouchableWithoutFeedback> */}

            <TouchableWithoutFeedback onPress={() => setPaymentMethod(PaymentMethod.Cash)}>
              <CashButton />
            </TouchableWithoutFeedback>
          </PaymentCardContainer>

        </ExpandedView>
        <Button label="Pagar" colors={{ background: paymentMethod ? THEME_COLORS.PRIMARY : THEME_COLORS.FONT_LIGHT }} onPress={paymentMethod ? goToPurchase : undefined} />
      </Container>
    </ShowStatusBarLayout>
  );
};

PurchaseConfirm.navigationOptions = {
  title: 'Comprar',
};

export default PurchaseConfirm;
