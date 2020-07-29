import React, { useState, useEffect, useContext } from 'react';
import { useNavigation } from 'react-navigation-hooks';
import { ScrollView, Modal, View, StyleSheet, Text } from 'react-native';
import THEME_COLORS from '../../styles/theme.styles';
import ShowStatusBarLayout from '../../layouts/show-status-bar.layout';
import Button from '../../components/button.component';
import PurchaseCalculator from '../../components/purchase-calculator.component';
import DropDown from '../../components/drop-down.component';
import { getRoutePath, HOME_ROUTE } from '../../routing/routes';
import { FuelTypeWithCurrentPriceRecord } from '../../hooks/use-fuel-types-with-current-price.hook';
import styled from 'styled-components/native';
import TransferCalculator from './transfer-calculator.component';
import { TRANSFER_ACTIONS, TransferContext } from '../../contexts/transfer.context';
import TransferDropdown from './transfer-dropdown.component';
import { WalletRecord } from '../../hooks/use-wallets';


const FuelTypesContainer = styled.View`
  margin: 25px;
`;

const ActionsContainer = styled.View`
  margin: 25px;
  flex: 1;
`;

const ModalCard = styled.View`
  background-color: ${THEME_COLORS.WHITE};
  border-radius: 10px;
  padding-top: 53px;
  padding-bottom: 30px;
  padding-left: 50px;
  padding-right: 50px;
  margin-top: 80px;
  margin-left: 25px;
  margin-right: 25px;
  align-items: stretch;
`;

const ModalSeparator = styled.View`
  background-color: ${THEME_COLORS.FONT_LIGHT};
  height: 1px;
  margin-bottom: 30px;
  width: 100%;
`;

const ModalText = styled.Text`
  color: ${THEME_COLORS.FONT_NORMAL};
  font-family: LibreFranklin-Regular;
  font-size: 18px;
  align-self: center;
  text-align: center;
  margin-bottom: 50px;
`;

const styles = StyleSheet.create({
  icon: {
    alignSelf: 'center',
    marginBottom: 30,
  }
});

const TransferAmountSelectionPage = () => {
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(true);
  const [isContinueButtonEnabled, setIsContinueButtonEnabled] = useState<boolean>(false);
  const [
    selectedFuelType,
    setSelectedFuelType,
  ] = useState<WalletRecord | null>(null);
  const [litres, setLitres] = useState(0);
  const [_, dispatch] = useContext(TransferContext);


  const goNext = () => {
    navigation.navigate(
      getRoutePath(HOME_ROUTE.TransferConfirm, HOME_ROUTE),
    );
  };

  useEffect(() => {
    if (litres > 0 && selectedFuelType) {
      setIsContinueButtonEnabled(true);
      dispatch({
        type: TRANSFER_ACTIONS.SET_LITRES,
        payload: {
          litres: litres
        },
      });
      dispatch({
        type: TRANSFER_ACTIONS.SET_FUEL_TYPE,
        payload: {
          fuelType: selectedFuelType.fuelType
        },
      });
    } else {
      setIsContinueButtonEnabled(false);
    }
  }, [litres, selectedFuelType]);

  return (
    <ShowStatusBarLayout>
      <ScrollView>
        <FuelTypesContainer>
          <TransferDropdown
            onItemSelected={e => setSelectedFuelType(e)}
            overlayColor={THEME_COLORS.TRANSFER_LITRES}
            placeholder="Billetera:"
            showSelectedLitres={true}
          />
        </FuelTypesContainer>

        {selectedFuelType ?
          <TransferCalculator
            selectedFuelType={selectedFuelType}
            onLitresCalculated={e => setLitres(e)}
          />
          : null}

        {selectedFuelType ?
          <ActionsContainer>
            <Button label="Continuar" colors={{ background: isContinueButtonEnabled ? THEME_COLORS.PRIMARY : THEME_COLORS.FONT_LIGHT }} onPress={isContinueButtonEnabled ? goNext : undefined}></Button>
          </ActionsContainer>
          : null}
      </ScrollView>
    </ShowStatusBarLayout>
  );
};

TransferAmountSelectionPage.navigationOptions = {
  title: 'Transferir litros',
};

export default TransferAmountSelectionPage;
