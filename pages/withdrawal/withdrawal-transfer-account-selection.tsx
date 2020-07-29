import React, { useState, useContext, useEffect } from 'react';
import { useNavigation } from 'react-navigation-hooks';
import ShowStatusBarLayout from '../../layouts/show-status-bar.layout';
import Button from '../../components/button.component';
import styled from 'styled-components/native';
import MoneyIcon from '../../assets/icons/ic_money.svg'
import MoneyWhiteIcon from '../../assets/icons/ic_money_white.svg'
import THEME_COLORS from '../../styles/theme.styles';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Loader from '../../components/loader.component';
import { StackNavigationProp } from 'react-navigation-stack/lib/typescript/src/vendor/types';
import { NavigationActions } from 'react-navigation';
import  { TransferAccountType } from '../../models/withdrawal-enums';
import { getRoutePath, HOME_ROUTE, PROFILE_ROUTES } from '../../routing/routes';
import { WithdrawalContext, WITHDRAWAL_ACTIONS } from '../../contexts/withdrawal.context';
import { SecurityContext } from '../../contexts/security.context';


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

const TransferAccountCard = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  background-color: ${THEME_COLORS.WHITE};
  border-radius: 5px;
  min-height: 50px;
  margin: 25px;
  margin-top: 0px;
  padding: 14px;
  padding-top: 16px;
  padding-bottom: 8px;
  elevation: 2;
`;

const SelectedTransferAccountCard = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  background-color: ${THEME_COLORS.SUCCESS};
  border-radius: 5px;
  min-height: 50px;
  margin: 25px;
  margin-top: 0px;
  padding: 14px;
  padding-top: 16px;
  padding-bottom: 8px;
  elevation: 2;
`;

const TransferAccountTitleText = styled.Text`
  font-family: LibreFranklin-Light;
  font-size: 16px;
  color: ${THEME_COLORS.FONT_REGULAR};
  margin-bottom: 10px;
`;

const SelectedTransferAccountTitleText = styled.Text`
  font-family: LibreFranklin-Medium;
  font-size: 16px;
  color: ${THEME_COLORS.WHITE};
  margin-bottom: 10px;
`;

const TransferAccountDataText = styled.Text`
  font-family: LibreFranklin-Thin;
  font-size: 14px;
  color: ${THEME_COLORS.FONT_REGULAR};
  margin-bottom: 9px;
`;

const SelectedTransferAccountDataText = styled.Text`
  font-family: LibreFranklin-Medium;
  font-size: 14px;
  color: ${THEME_COLORS.WHITE};
  margin-bottom: 9px;
`;

const TitleText = styled.Text`
  align-self: center;
  font-family: 'LibreFranklin-Thin';
  font-size: 14px;
  margin-bottom: 15px;
  text-align: center;
`;


const WithdrawalTransferAccountSelectionPage = () => {
  const [transferAccount, setTransferAccount] = useState<TransferAccountType | null>(null);
  const navigation = useNavigation();
  const [_, dispatch] = useContext(WithdrawalContext);
  const [securityCtx] = useContext(SecurityContext);
    
  useEffect(() => {
    if (transferAccount) {
      dispatch({
        type: WITHDRAWAL_ACTIONS.SET_TRANSFER_ACCOUNT,
        payload: {
          transferAccount: transferAccount
        }
      });
    };
  }, [transferAccount]);

  const goNext = () => {
    navigation.navigate(getRoutePath(HOME_ROUTE.WithdrawalAmountSelection, HOME_ROUTE));
  };

  const goEditProfile = () => {
    navigation.navigate(getRoutePath(HOME_ROUTE.ProfileEditData, HOME_ROUTE));
  };

  const CbuButton = () =>{
    const cbuText = securityCtx.user?.customer.cbu?.length ? securityCtx.user?.customer.cbu : "No ingresado";
    const cbuAliasText = securityCtx.user?.customer.cbuAlias?.length ? securityCtx.user?.customer.cbuAlias : "No ingresado";
    return(
      transferAccount === TransferAccountType.CBU ?
        <SelectedTransferAccountCard>
            <SelectedTransferAccountTitleText>CBU/Alias</SelectedTransferAccountTitleText>
            <SelectedTransferAccountDataText>CBU: {cbuText}</SelectedTransferAccountDataText>
            <SelectedTransferAccountDataText>Alias: {cbuAliasText}</SelectedTransferAccountDataText>
        </SelectedTransferAccountCard>
          :
        <TransferAccountCard>
            <TransferAccountTitleText>CBU/Alias</TransferAccountTitleText>
            <TransferAccountDataText>CBU: {cbuText}</TransferAccountDataText>
            <TransferAccountDataText>Alias: {cbuAliasText}</TransferAccountDataText>
        </TransferAccountCard>
    )
  }


  const MercadoPagoButton = () => {
    const text = securityCtx.user?.customer.mercadopagoAccount?.length ? securityCtx.user?.customer.mercadopagoAccount : "No ingresado";
    return(
      transferAccount === TransferAccountType.MercadoPago ?
          <SelectedTransferAccountCard>
            <SelectedTransferAccountTitleText>MercadoPago</SelectedTransferAccountTitleText>
            <SelectedTransferAccountDataText>{text}</SelectedTransferAccountDataText>
          </SelectedTransferAccountCard>
          :
          <TransferAccountCard>
            <TransferAccountTitleText>MercadoPago</TransferAccountTitleText>
            <TransferAccountDataText>{text}</TransferAccountDataText>
          </TransferAccountCard>
    )
  }
  
  return (
    <ShowStatusBarLayout>
      <Container>
        <TitleText>
            Seleccione la cuenta a la que desea transferir
        </TitleText>

        <ExpandedView>
          <WithdrawalTypeCardContainer>
            <TouchableWithoutFeedback onPress={() => securityCtx.user?.customer.cbu?.length || securityCtx.user?.customer.cbuAlias?.length ? setTransferAccount(TransferAccountType.CBU) : null}>
              <CbuButton />
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={() => securityCtx.user?.customer.mercadopagoAccount?.length ? setTransferAccount(TransferAccountType.MercadoPago) : null}>
              <MercadoPagoButton />
            </TouchableWithoutFeedback>
          </WithdrawalTypeCardContainer>

          <Button label="Editar mis datos" colors={{background:THEME_COLORS.PRIMARY }} onPress={ goEditProfile } />

        </ExpandedView>
        <Button label="Seleccionar" colors={{ background: transferAccount ? THEME_COLORS.PRIMARY : THEME_COLORS.FONT_LIGHT }} onPress={transferAccount ? goNext : undefined} />
      </Container>
    </ShowStatusBarLayout>
  );
};

WithdrawalTransferAccountSelectionPage.navigationOptions = {
  title: 'Retirar fondos',
};

export default WithdrawalTransferAccountSelectionPage;
