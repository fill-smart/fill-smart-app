import React, { useState, useRef, useEffect, useContext } from 'react';
import FuelCard from '../../components/fuel-card.component';
import OperationType from '../../models/operation-type.enum';
import { FlatList } from 'react-native';
import Button from '../../components/button.component';
import PaymentMethodPreviewCard from '../../components/payment-method-preview-card.component';
import { useNavigation } from 'react-navigation-hooks';
import { getRoutePath, HOME_ROUTE } from '../../routing/routes';
import ShowStatusBarLayout from '../../layouts/show-status-bar.layout';
import { WithdrawalContext, WITHDRAWAL_ACTIONS } from '../../contexts/withdrawal.context';
import useWallets, { WalletRecord } from '../../hooks/use-wallets';
import styled from 'styled-components/native';
import Loader from '../../components/loader.component';
import THEME_COLORS from '../../styles/theme.styles';


const ContainerView = styled.View`
  margin-top: 20px;
  margin-bottom: 25px;
  margin-left: 20px;
  margin-right: 20px;
  flex: 1;
`;

const ListDescriptionText = styled.Text`
  align-self: center;
  font-family: 'LibreFranklin-Thin';
  font-size: 14px;
  margin-left: 80px;
  margin-right: 80px;
  margin-bottom: 15px;
  text-align: center;
`;

const FuelSelectionListSeparator = styled.View`
  margin-bottom: 10px;
`;

const ButtonContainer = styled.View`
  margin-top: 15px;
`;

const WithdrawalFuelSelectionPage = () => {
    const navigation = useNavigation();
    const [withdrawalContext, dispatch] = useContext(WithdrawalContext);
    const { wallets, loading } = useWallets();
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const itemList = useRef<FlatList<any>>(null);

    useEffect(() => {
        if (withdrawalContext.wallet && withdrawalContext.amount && selectedIndex) {
            itemList?.current?.scrollToIndex({ index: selectedIndex! });
        }
    }, [selectedIndex]);

    if (loading) {
        return <Loader />;
    }

    const goConfirmPaymentMethod = () => {
        if (withdrawalContext.wallet) {
            navigation.navigate(getRoutePath(HOME_ROUTE.WithdrawalConfirmPaymentMethod, HOME_ROUTE));
        }
    };

    const onItemPressed = (wallet: WalletRecord, index: number) => {
        if (wallet.availableLitres >= (withdrawalContext.amount! / wallet.fuelType.currentPrice.price)) {
            dispatch({
                type: WITHDRAWAL_ACTIONS.SET_WALLET,
                payload: { wallet: wallet },
            });
            setSelectedIndex(index);
        };
    };

    const PaymentMethod = () => {
        if (withdrawalContext.wallet && withdrawalContext.amount) {
            return (
                <PaymentMethodPreviewCard
                    type={OperationType.Withdrawal}
                    operationValue={withdrawalContext.amount!}
                    selectedWallet={withdrawalContext.wallet?.fuelType.name!}
                    selectedWalletLitres={withdrawalContext.amount / withdrawalContext.wallet.fuelType.currentPrice.price}
                />
            );
        };
        return null;
    };

    return (
        <ShowStatusBarLayout>
            <ContainerView>
                <ListDescriptionText>
                    Seleccione con qué tipo de combustible desea pagar
                </ListDescriptionText>

                <FlatList
                    ref={itemList}
                    data={wallets}
                    keyExtractor={wallet => wallet.id.toString()}
                    renderItem={({ item, index }: { item: WalletRecord; index: number }) => (
                        <FuelCard
                            walletId={item.id}
                            title={item.fuelType.name}
                            litres={item.availableLitres}
                            money={item.availableLitres * item.fuelType.currentPrice.price}
                            type={OperationType.Withdrawal}
                            enabled={item.availableLitres >= (withdrawalContext.amount! / item.fuelType.currentPrice.price)}
                            selectedWalletId={withdrawalContext.wallet?.id}
                            onPress={() => onItemPressed(item, index)}
                        />
                    )}
                    ItemSeparatorComponent={FuelSelectionListSeparator}
                    showsVerticalScrollIndicator={false}
                    onScrollToIndexFailed={()=>{}}
                />

                <PaymentMethod />

                <ButtonContainer>
                    <Button label="Continuar" colors={{ background: withdrawalContext.wallet ? THEME_COLORS.PRIMARY : THEME_COLORS.FONT_LIGHT }} onPress={withdrawalContext.wallet ? goConfirmPaymentMethod : undefined} />
                </ButtonContainer>
            </ContainerView>
        </ShowStatusBarLayout>
    );
};

WithdrawalFuelSelectionPage.navigationOptions = {
    title: 'Retirar fondos',
};

export default WithdrawalFuelSelectionPage;