import React, { useState, useContext, useEffect } from 'react';
import { useNavigation } from 'react-navigation-hooks';
import ShowStatusBarLayout from '../../layouts/show-status-bar.layout';
import Button from '../../components/button.component';
import styled from 'styled-components/native';
import MoneyIcon from '../../assets/icons/ic_money.svg'
import MoneyWhiteIcon from '../../assets/icons/ic_money_white.svg'

import TransferWithdrawalIcon from '../../assets/icons/ic_transfer_withdrawal.svg'
import TransferWithdrawalWhiteIcon from '../../assets/icons/ic_transfer_withdrawal_white.svg'
import THEME_COLORS from '../../styles/theme.styles';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Loader from '../../components/loader.component';
import { StackNavigationProp } from 'react-navigation-stack/lib/typescript/src/vendor/types';
import { NavigationActions } from 'react-navigation';
import { WithdrawalType } from '../../models/withdrawal-enums';
import { getRoutePath, HOME_ROUTE } from '../../routing/routes';
import { WithdrawalContext, WITHDRAWAL_ACTIONS } from '../../contexts/withdrawal.context';

const Container = styled.View`
  flex: 1;
  padding: 25px;
`;

const ExpandedView = styled.View`
  flex: 1;
`;

const WithdrawalTypeCardContainer = styled.View`
  margin-left: -25px;
  margin-right: -25px;
`;

const IconTextContainer = styled.View` 
  flex-direction: row;
  align-items: center;
`;

const WithdrawalTypeCard = styled.View`
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

const SelectedWithdrawalTypeCard = styled.View`
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

const WithdrawalTypeText = styled.Text`
  font-family: LibreFranklin-Light;
  font-size: 16px;
  color: ${THEME_COLORS.FONT_REGULAR};
  margin-left: 10px;
`;

const SelectedWithdrawalTypeText = styled.Text`
  font-family: LibreFranklin-Medium;
  font-size: 16px;
  color: ${THEME_COLORS.WHITE};
  margin-left: 10px;
`;

const TitleText = styled.Text`
  align-self: center;
  font-family: 'LibreFranklin-Thin';
  font-size: 14px;
  margin-bottom: 15px;
  text-align: center;
`;


const WithdrawalTypeSelectionPage = () => {
  const [withdrawalType, setWithdrawalType] = useState<WithdrawalType | null>(null);
  const navigation = useNavigation() as StackNavigationProp;
  const [context, dispatch] = useContext(WithdrawalContext);

  useEffect(() => {
    if (withdrawalType) {
      dispatch({
        type: WITHDRAWAL_ACTIONS.SET_TYPE,
        payload: {
          type: withdrawalType
        }
      });
    };
  }, [withdrawalType]);

  const goNext = () => {
    switch (withdrawalType) {
      case WithdrawalType.Transfer:
        navigation.navigate(getRoutePath(HOME_ROUTE.WithdrawalTransferAccountSelection, HOME_ROUTE));
        break;
      case WithdrawalType.Cash:
        navigation.navigate(getRoutePath(HOME_ROUTE.WithdrawalQrScan, HOME_ROUTE));
      default:
        break;
    }
  };

  const TransferButton = () =>
    withdrawalType === WithdrawalType.Transfer ?
    <SelectedWithdrawalTypeCard>
        <IconTextContainer>
            <TransferWithdrawalWhiteIcon />
            <SelectedWithdrawalTypeText>Transferencia</SelectedWithdrawalTypeText>
        </IconTextContainer>
    </SelectedWithdrawalTypeCard>
      :
    <WithdrawalTypeCard>
        <IconTextContainer>
            <TransferWithdrawalIcon />
            <WithdrawalTypeText>Transferencia</WithdrawalTypeText>
        </IconTextContainer>
    </WithdrawalTypeCard>


  const CashButton = () =>
    withdrawalType === WithdrawalType.Cash ?
      <SelectedWithdrawalTypeCard>
        <IconTextContainer>
          <MoneyWhiteIcon />
          <SelectedWithdrawalTypeText>Efectivo</SelectedWithdrawalTypeText>
        </IconTextContainer>
      </SelectedWithdrawalTypeCard>
      :
      <WithdrawalTypeCard>
        <IconTextContainer>
          <MoneyIcon />
          <WithdrawalTypeText>Efectivo</WithdrawalTypeText>
        </IconTextContainer>
      </WithdrawalTypeCard>

  return (
    <ShowStatusBarLayout>
      <Container>
        <TitleText>
            Seleccione la forma de retiro
        </TitleText>

        <ExpandedView>
          <WithdrawalTypeCardContainer>
            <TouchableWithoutFeedback onPress={() => setWithdrawalType(WithdrawalType.Transfer)}>
              <TransferButton />
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={() => setWithdrawalType(WithdrawalType.Cash)}>
              <CashButton />
            </TouchableWithoutFeedback>
          </WithdrawalTypeCardContainer>

        </ExpandedView>
        <Button label="Seleccionar" colors={{ background: withdrawalType ? THEME_COLORS.PRIMARY : THEME_COLORS.FONT_LIGHT }} onPress={withdrawalType ? goNext : undefined} />
      </Container>
    </ShowStatusBarLayout>
  );
};

WithdrawalTypeSelectionPage.navigationOptions = {
  title: 'Retirar fondos',
};

export default WithdrawalTypeSelectionPage;
