import React, { useState, useEffect, useContext } from 'react';
import { useNavigation } from 'react-navigation-hooks';
import THEME_COLORS from '../../styles/theme.styles';
import ShowStatusBarLayout from '../../layouts/show-status-bar.layout';
import Button from '../../components/button.component';
import { getRoutePath, HOME_ROUTE } from '../../routing/routes';
import styled from 'styled-components/native';
import PaymentInStoreCalculator from './payment-in-store-calculator.component';
import useGasStation from '../../hooks/use-gas-station.hook';
import { PaymentInStoreContext, PAYMENT_IN_STORE_ACTIONS } from '../../contexts/payment-in-store.context';
import useParameters from '../../hooks/use-parameters.hook';


const Container = styled.View`
  flex-direction: column;
  flex: 1;
  margin: 25px;
`;

const Title = styled.Text`
  align-self: center;
  font-family: 'LibreFranklin-Thin';
  font-size: 14px;
  margin-bottom: 15px;
  text-align: center;
`;

const CalculatorContainer = styled.View`
  flex: 1;
`;

const ActionsContainer = styled.View`
  margin-top: 25px;
`;

const PaymentInStoreAmountSelectionPage = () => {
  const navigation = useNavigation();
  const gasStationId = navigation.getParam('gasStationId');
  const { gasStation, loading } = useGasStation(gasStationId);
  const [amount, setAmount] = useState<number>(0);
  const [_, dispatch] = useContext(PaymentInStoreContext);
  const { paymentInStoreLimit } = useParameters();

  useEffect(() => {
    dispatch({
      type: PAYMENT_IN_STORE_ACTIONS.SET_GAS_STATION,
      payload: {
        gasStation: gasStation!
      }
    });
  }, [gasStation]);

  const checkNewAmount = (newAmount: number) => {
    setAmount(newAmount)
  }

  useEffect(() => {
    if (amount) {
      dispatch({
        type: PAYMENT_IN_STORE_ACTIONS.SET_AMOUNT,
        payload: {
          amount: amount
        }
      });
    };
  }, [amount]);

  const goNext = () => {
    navigation.navigate(getRoutePath(HOME_ROUTE.PaymentInStoreFuelSelection, HOME_ROUTE));
  };

  return (
    <ShowStatusBarLayout>
      <Container>
        <Title>Ingrese el monto a pagar</Title>

        <CalculatorContainer>
          <PaymentInStoreCalculator OnAmountInput={e => checkNewAmount(e)} />
        </CalculatorContainer>

        <ActionsContainer>
          <Button label="Continuar" colors={{ background: amount && (amount <= paymentInStoreLimit!) ? THEME_COLORS.PRIMARY : THEME_COLORS.FONT_LIGHT }} onPress={amount && (amount <= paymentInStoreLimit!) ? goNext : undefined}></Button>
        </ActionsContainer>
      </Container>
    </ShowStatusBarLayout>
  );
};

PaymentInStoreAmountSelectionPage.navigationOptions = {
  title: 'Pagar en tienda',
};

export default PaymentInStoreAmountSelectionPage;

