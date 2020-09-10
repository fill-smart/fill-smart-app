import React, { useState, useContext, useEffect } from 'react';
import { useNavigation } from 'react-navigation-hooks';
import { ScrollView, Modal, View, StyleSheet, Text } from 'react-native';
import THEME_COLORS from '../../styles/theme.styles';
import ShowStatusBarLayout from '../../layouts/show-status-bar.layout';
import Button from '../../components/button.component';
import { getRoutePath, HOME_ROUTE } from '../../routing/routes';
import ExchangeCalculator from './exchange-calculator.component';
import styled from 'styled-components/native';
import { ExchangeWalletContext, EXCHANGE_WALLET_ACTIONS } from '../../contexts/exchange-wallets.context';
import ExchangeDropdown from './exchange-dropdown.component';
import useWallets, { WalletRecord } from '../../hooks/use-wallets';
import moment from 'moment';
import InfoIcon from '../../assets/icons/ic_info.svg'
import useParameters from '../../hooks/use-parameters.hook';

const FuelTypesContainer = styled.View`
  margin: 25px;
`;

const ActionsContainer = styled.View`
  margin: 25px;
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

//let sourceLitres = 0;

const ExchangeWalletSelectionPage = () => {
    const navigation = useNavigation();
    const [isContinueButtonEnabled, setIsContinueButtonEnabled] = useState<boolean>(false);
    const [sourceWallet, setSourceWallet] = useState<WalletRecord | null>(null);
    const [targetWallet, setTargetWallet] = useState<WalletRecord | null>(null);
    const [targetLitres, setTargetLitres] = useState<number | null>(null);
    const [sourceLitres, setSourceLitres] = useState<number | null>(0);
    const [_, dispatch] = useContext(ExchangeWalletContext);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(true);
    const { exchangeGracePeriod, loading } = useParameters();
    const availabilityDate = moment().add(exchangeGracePeriod, "days").format('DD/MM/YYYY');

    const goConfirmSelection = () => {
        navigation.navigate(getRoutePath(HOME_ROUTE.ExchangeConfirmSelection, HOME_ROUTE), { availabilityDate });
    };

    const onRequestCloseModal = () => {
        setIsModalVisible(false);
        navigation.goBack();
    }

    useEffect(() => {
        if (sourceWallet && targetWallet && targetLitres
            && (sourceWallet != targetWallet)
            && (sourceLitres && sourceWallet.availableLitres >= sourceLitres)
        ) {
            setIsContinueButtonEnabled(true);
        }
        else {
            setIsContinueButtonEnabled(false);
        }
    }, [sourceWallet, targetWallet, targetLitres]);

    useEffect(() => {
        if (sourceWallet === targetWallet) {
            setIsContinueButtonEnabled(false);
        } else {
            dispatch({
                type: EXCHANGE_WALLET_ACTIONS.SET_SOURCE_FUEL_TYPE,
                payload: { sourceFuelType: sourceWallet?.fuelType! }
            });
        }
    }, [sourceWallet]);

    useEffect(() => {
        if (targetWallet === sourceWallet) {
            setIsContinueButtonEnabled(false);
        } else {
            dispatch({
                type: EXCHANGE_WALLET_ACTIONS.SET_TARGET_FUEL_TYPE,
                payload: { targetFuelType: targetWallet?.fuelType! }
            });
        }
    }, [targetWallet]);

    useEffect(() => {
        dispatch({
            type: EXCHANGE_WALLET_ACTIONS.SET_SOURCE_LITRES,
            payload: { sourceLitres, targetLitres }
        });
    }, [targetLitres]);

    const onLitresCalculated = (source: number, target: number) => {
        //Check condition to fix when the amount typed in calculator is equal to the amount displayed 
        //and this value is rounded up. So we check this and equals the amount entered to the real amount
        if (sourceWallet
            && source.toLocaleString("es-ar", { maximumFractionDigits: 2 }) ==
            sourceWallet.availableLitres.toLocaleString("es-ar", { maximumFractionDigits: 2 })) {
            setSourceLitres(sourceWallet.availableLitres);
        } else {
            setSourceLitres(source);
        }
        setTargetLitres(target);
    };

    return (
        <ShowStatusBarLayout>
            <ScrollView>
                <FuelTypesContainer>
                    <ExchangeDropdown onItemSelected={e => { setSourceWallet(e) }} 
                    overlayColor={THEME_COLORS.SECONDARY} 
                    placeholder="Origen" 
                    showSelectedLitres={false}
                    isOriginWallet={true} />
                </FuelTypesContainer>

                <FuelTypesContainer style={{ marginTop: 0 }}>
                    <ExchangeDropdown onItemSelected={e => { setTargetWallet(e) }} 
                    overlayColor={THEME_COLORS.SECONDARY} 
                    placeholder="Destino" 
                    showSelectedLitres={false}
                    isOriginWallet={false} />
                </FuelTypesContainer>

                {sourceWallet && targetWallet ?
                    <ExchangeCalculator onLitresCalculated={(sourceLitres, targetLitres) => { onLitresCalculated(sourceLitres, targetLitres) }}
                        sourceWalletLitrePrice={sourceWallet?.fuelType.currentPrice.price ?? 0}
                        targetWalletLitrePrice={targetWallet?.fuelType.currentPrice.price ?? 0}
                        sourceWalletAvailableLitres={sourceWallet?.availableLitres ?? 0} 
                        targetWalletTotalLitres={targetWallet?.litres} />
                    : null}

                {sourceWallet && targetWallet ?
                    <ActionsContainer>
                        <Button label="Continuar" colors={{ background: isContinueButtonEnabled ? THEME_COLORS.PRIMARY : THEME_COLORS.FONT_LIGHT }} onPress={isContinueButtonEnabled ? goConfirmSelection : undefined}></Button>
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
                            <Text>Los litros de este canje estarán disponibles a partir del </Text>
                            <Text style={{ color: THEME_COLORS.PRIMARY }}>{availabilityDate}</Text>
                        </ModalText>
                        <Button label="Continuar" onPress={() => setIsModalVisible(false)} />
                    </ModalCard>
                </View>
            </Modal>
        </ShowStatusBarLayout>
    );
};

ExchangeWalletSelectionPage.navigationOptions = {
    title: 'Canjear',
}

export default ExchangeWalletSelectionPage;
