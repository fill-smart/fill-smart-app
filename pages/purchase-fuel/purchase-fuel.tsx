import React, { useState, useEffect, useContext } from 'react';
import { useNavigation } from 'react-navigation-hooks';
import { ScrollView, Modal, View, StyleSheet, Text } from 'react-native';
import THEME_COLORS from '../../styles/theme.styles';
import ShowStatusBarLayout from '../../layouts/show-status-bar.layout';
import Button from '../../components/button.component';
import PurchaseCalculator from '../../components/purchase-calculator.component';
import DropDown from '../../components/drop-down.component';
import InfoIcon from '../../assets/icons/ic_info.svg'
import { getRoutePath, HOME_ROUTE } from '../../routing/routes';
import { FuelTypeWithCurrentPriceRecord } from '../../hooks/use-fuel-types-with-current-price.hook';
import styled from 'styled-components/native';
import {
  PurchaseFuelContext,
  PURCHASE_FUEL_ACTIONS,
} from '../../contexts/purchase-fuel.context';
import moment from 'moment';
import useParameters from '../../hooks/use-parameters.hook';
import Loader from '../../components/loader.component';


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

const PurchaseFuel = () => {
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(true);
  const [isContinueButtonEnabled, setIsContinueButtonEnabled] = useState<boolean>(false);
  const [
    selectedFuelType,
    setSelectedFuelType,
  ] = useState<FuelTypeWithCurrentPriceRecord | null>(null);
  const [litres, setLitres] = useState(0);
  const [_, dispatch] = useContext(PurchaseFuelContext);
  const { gracePeriod, loading } = useParameters();
  const availabilityDate = moment().add(gracePeriod, "days").format('DD/MM/YYYY');

  const goNext = () => {
    navigation.navigate(
      getRoutePath(HOME_ROUTE.PurchaseConfirm, HOME_ROUTE),
    );
  };

  const onRequestCloseModal = () => {
    setIsModalVisible(false);
    navigation.goBack();
  }

  useEffect(() => {
    if (litres > 0 && selectedFuelType) {
      setIsContinueButtonEnabled(true);
      dispatch({
        type: PURCHASE_FUEL_ACTIONS.SET_PURCHASE_FUEL_AND_QUANTITY,
        payload: {
          purchaseFuelAndQuantity: {
            litres,
            fuelType: selectedFuelType,
            fuelPrice: selectedFuelType.currentPrice,
          },
        },
      });
      dispatch({
        type: PURCHASE_FUEL_ACTIONS.SET_AVAILABILITY_DATE,
        payload: {
          availabilityDate: availabilityDate
        },
      });
    } else {
      setIsContinueButtonEnabled(false);
    }
  }, [litres, selectedFuelType]);

  if (loading) {
    return (<Loader />);
  }

  return (
    <ShowStatusBarLayout>
      <ScrollView>
        <FuelTypesContainer>
          <DropDown
            onItemSelected={e => setSelectedFuelType(e)}
            overlayColor={THEME_COLORS.PRIMARY}
            isOpen={!isModalVisible}
          />
        </FuelTypesContainer>

        {selectedFuelType ?
          <PurchaseCalculator
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

      <Modal animationType="none" transparent={true} visible={isModalVisible} onRequestClose={onRequestCloseModal}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(72, 137, 255, 0.5)',
          }}>
          <ModalCard>
            <InfoIcon style={styles.icon} width={102.16} height={101.12} />
            <ModalSeparator />
            <ModalText>
              <Text>Los litros de esta compra estarán disponibles a partir del </Text>
              <Text style={{ color: THEME_COLORS.PRIMARY }}>{availabilityDate}</Text>
            </ModalText>
            <Button label="Continuar" onPress={() => setIsModalVisible(false)} />
          </ModalCard>
        </View>
      </Modal>
    </ShowStatusBarLayout>
  );
};

PurchaseFuel.navigationOptions = {
  title: 'Comprar',
};

export default PurchaseFuel;
