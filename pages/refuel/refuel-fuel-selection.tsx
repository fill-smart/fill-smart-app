import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from 'react';
import FuelCard from '../../components/fuel-card.component';
import OperationType from '../../models/operation-type.enum';
import { FlatList, ActivityIndicator } from 'react-native';
import Button from '../../components/button.component';
import PaymentMethodPreviewCard from '../../components/payment-method-preview-card.component';
import { useNavigation } from 'react-navigation-hooks';
import { getRoutePath, HOME_ROUTE } from '../../routing/routes';
import ShowStatusBarLayout from '../../layouts/show-status-bar.layout';
import styled from 'styled-components/native';
import { RefuelContext, REFUEL_ACTIONS } from '../../contexts/refuel.context';
import useWallets, { WalletRecord } from '../../hooks/use-wallets';
import THEME_COLORS from '../../styles/theme.styles';
import Loader from '../../components/loader.component';


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

const calcEquivalentLitres = (operationLitres: number, operationLitrePrice: number, targetWalletLitresPrice: number): number => {
  const operationPrice = operationLitres * operationLitrePrice;
  const targetLitres = operationPrice / targetWalletLitresPrice;
  return targetLitres;
};

const RefuelFuelSelectionPage = () => {
  const navigation = useNavigation();
  const [refuelState, dispatch] = useContext(RefuelContext);
  const { wallets, loading } = useWallets();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const itemList = useRef<FlatList<any>>(null);

  useEffect(() => {
    if (refuelState.wallet && refuelState.operation && selectedIndex) {
      itemList?.current?.scrollToIndex({ index: selectedIndex! });
    }
  }, [selectedIndex]);

  if (loading) {
    return <Loader />;
  }

  const goConfirmPaymentMethod = () => {
    if (refuelState.wallet) {
      navigation.navigate(getRoutePath(HOME_ROUTE.RefuelConfirmPaymentMethod, HOME_ROUTE));
    }
  };

  const onItemPressed = (wallet: WalletRecord, index: number) => {
    if (wallet.availableLitres >= refuelState.operation?.lastExternalOperation.litres!) {
      dispatch({
        type: REFUEL_ACTIONS.SET_WALLET,
        payload: { wallet: wallet },
      });
      setSelectedIndex(index);
    };
  };

  const PaymentMethod = () => {
    const operation = refuelState.operation?.lastExternalOperation;
    const wallet = refuelState.wallet;

    if (refuelState.wallet && refuelState.operation) {
      const myWalletLitres = calcEquivalentLitres(operation?.litres!, operation?.fuelType.currentPrice.price!, wallet?.fuelType.currentPrice.price!);
      const myWalletPrice = myWalletLitres * wallet?.fuelType.currentPrice.price!;

      return (
        <PaymentMethodPreviewCard
          type={OperationType.Refuel}
          title={operation?.fuelType.name}
          operationValue={operation?.litres!}
          operationValueEquivalent={
            operation?.litres! * operation?.fuelType.currentPrice.price!
          }
          selectedWallet={wallet?.fuelType.name!}
          selectedWalletLitres={myWalletLitres}
        />
      );
    }
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
              type={OperationType.Refuel}
              enabled={item.availableLitres >= refuelState.operation?.lastExternalOperation.litres!}
              selectedWalletId={refuelState.wallet?.id}
              onPress={() => onItemPressed(item, index)}
            />
          )}
          ItemSeparatorComponent={FuelSelectionListSeparator}
          showsVerticalScrollIndicator={false}
          onScrollToIndexFailed={()=>{}}
        />

        <PaymentMethod />

        <Button label="Continuar" colors={{ background: refuelState.wallet ? THEME_COLORS.PRIMARY : THEME_COLORS.FONT_LIGHT }} onPress={refuelState.wallet ? goConfirmPaymentMethod : undefined} />
      </ContainerView>
    </ShowStatusBarLayout>
  );
};

RefuelFuelSelectionPage.navigationOptions = {
  title: 'Cargar',
};

export default RefuelFuelSelectionPage;
