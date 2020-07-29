import React, {useState, useEffect, useContext} from 'react';
import {useNavigation} from 'react-navigation-hooks';
import THEME_COLORS from '../../styles/theme.styles';
import ShowStatusBarLayout from '../../layouts/show-status-bar.layout';
import Button from '../../components/button.component';
import {getRoutePath, HOME_ROUTE} from '../../routing/routes';
import styled from 'styled-components/native';
import WithdrawalCalculator from './withdrawal-calculator.component';
import { WithdrawalContext, WITHDRAWAL_ACTIONS } from '../../contexts/withdrawal.context';
import useGasStation from '../../hooks/use-gas-station.hook';
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

const WithdrawalAmountSelectionPage = () => {
  const navigation = useNavigation();
  const gasStationId = navigation.getParam('gasStationId');
  const {gasStation, loading} = useGasStation(gasStationId);
  const [amount, setAmount] = useState<number|null>(null);
  const [_, dispatch] = useContext(WithdrawalContext);
  const { withdrawalMaxAmount } = useParameters();

  useEffect(() => {
    dispatch({
      type: WITHDRAWAL_ACTIONS.SET_GAS_STATION, 
      payload: { 
        gasStation: gasStation!
      }
    });
  }, [gasStation]);

  useEffect(() => {
    if (amount) {
      dispatch({
        type: WITHDRAWAL_ACTIONS.SET_AMOUNT,
        payload: {
          amount: amount
          }
      });
    };
  }, [amount]);

  const goNext = () => {
    navigation.navigate(
      getRoutePath(HOME_ROUTE.WithdrawalFuelSelection, HOME_ROUTE),
    );
  };
  
  return (
    <ShowStatusBarLayout>
        <Container>
          <Title>Ingrese un monto a retirar</Title>
          
          <CalculatorContainer>
            <WithdrawalCalculator OnAmountInput={e => setAmount(e)}/>
          </CalculatorContainer>

          <ActionsContainer><Button label="Continuar" colors={{background: amount && (amount <= withdrawalMaxAmount!) ? THEME_COLORS.PRIMARY : THEME_COLORS.FONT_LIGHT}} onPress={amount && (amount <= withdrawalMaxAmount!) ? goNext : undefined}></Button>
            
          </ActionsContainer>
        </Container>
    </ShowStatusBarLayout>
  );
};

WithdrawalAmountSelectionPage.navigationOptions = {
  title: 'Retirar fondos',
};

export default WithdrawalAmountSelectionPage;
