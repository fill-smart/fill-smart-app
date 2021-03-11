import crashlytics from '@react-native-firebase/crashlytics';
import { ApolloQueryResult } from 'apollo-boost';
import React, { useContext, useState } from 'react';
import { Alert, Dimensions, GestureResponderEvent, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import styled from 'styled-components/native';
import ExchangeWalletIcon from '../../assets/icons/ic_exchange_wallets_white.svg';
import FuelPriceIcon from '../../assets/icons/ic_fuel_price.svg';
import MovementsIcon from '../../assets/icons/ic_movements.svg';
import PayInStoreIcon from '../../assets/icons/ic_pay_in_store_white.svg';
import PlusIcon from '../../assets/icons/ic_plus.svg';
import PumpBuyIcon from '../../assets/icons/ic_pump_buy_white.svg';
import PumpChargeIcon from '../../assets/icons/ic_pump_charge_white.svg';
import Pump from '../../assets/icons/ic_pump_primary.svg';
import TopupIcon from '../../assets/icons/ic_topup_white.svg';
import TransferLitresIcon from '../../assets/icons/ic_transfer_litres_white.svg';
import IconSeparator from '../../components/icon-separator.component';
import MyAccountSummary from '../../components/my-account-summary.component';
import WalletCarousel from '../../components/wallet-carousel.component';
import { ConnectionContext } from '../../contexts/connection-context';
import { SecurityContext } from '../../contexts/security.context';
import useFuelPriceVariations from '../../hooks/use-fuel-price-variations.hook';
import useOperations, { IOperationsResult } from '../../hooks/use-operations';
import useWallets from '../../hooks/use-wallets';
import ShowStatusBarLayout from '../../layouts/show-status-bar.layout';
import { APP_ROUTES, getRoutePath, HOME_ROUTE } from '../../routing/routes';
import THEME_COLORS from '../../styles/theme.styles';
import FuelPricesVariation from './fuel-price-variations';
import HomeMovementList from '../../components/home-movement-list.component';
import { QueryCriteria, FilterTypesEnum } from '../../filters';
import { PurchaseStatusEnum } from '../../models/purchase.model';
import useSummary from '../../hooks/use-summary.hook';

const screenWidth = Math.round(Dimensions.get('window').width);
const cardWidth = (screenWidth - 15 * 5) / 2;

const Page = styled.View`
  padding-right: 24px;
  padding-left: 24px;  
  background-color: ${THEME_COLORS.BACKGROUND_DARK};
  flex-grow: 1;
`;

const SeparatorView = styled.View`
  margin-top: 15px;
  margin-bottom: 20px;
`;

const BigButton =
  ({
    label,
    icon,
    backgroundColor,
    labelColor,
    onPress,
    style,
  }: {
    label: string;
    icon: Element;
    backgroundColor: string;
    labelColor: string;
    onPress?: (event: GestureResponderEvent) => void;
    style?: any
  }) => {
    return (
      <View
        style={{
          flex: 1,
          height: 60,
          paddingVertical: 15,
          backgroundColor: backgroundColor,
          borderRadius: 10,
          ...style
        }}>
        <TouchableOpacity onPress={onPress ?? undefined}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            {icon}
            <Text style={{ color: labelColor, marginLeft: 10 }}>{label}</Text>
          </View>
        </TouchableOpacity>
      </View >
    );
  };

export let operationsRefetch: (variables?: Record<string, any> | undefined) => Promise<ApolloQueryResult<IOperationsResult>>;

const Home = () => {
  const [securityCtx] = useContext(SecurityContext);
  const listCriteria: QueryCriteria = {
    pagination: {
      current: 1,
      pageSize: 6
    },
    sort: [{
      property: "stamp",
      descending: true
    }],
    filter: {
      and: [
        {
          or: [
            {
              property: "authorizationStatus",
              value: "",
              type: FilterTypesEnum.IsNull
            },
            {
              property: "authorizationStatus",
              value: "authorized",
              type: FilterTypesEnum.Equals
            }
          ],
        },
        {
          or: [
            {
              property: "transferWithdrawalAuthorized",
              value: true,
              type: FilterTypesEnum.Equals
            },
            {
              property: "transferWithdrawalAuthorized",
              value: "",
              type: FilterTypesEnum.IsNull
            },
          ]
        },
        {
          or: [
            {
              property: "userId",
              value: securityCtx?.user?.id,
              type: FilterTypesEnum.Equals
            },
            {
              property: "targetUserId",
              value: securityCtx?.user?.id,
              type: FilterTypesEnum.Equals
            },
          ]
        },
        {
          or: [
            {
              property: "purchaseStatus",
              value: PurchaseStatusEnum.Completed,
              type: FilterTypesEnum.Equals
            },
            {
              property: "purchaseStatus",
              value: "",
              type: FilterTypesEnum.IsNull
            },
          ]
        }
      ]
    }
  };
  const { operations, loading: operationsLoading, error: operationsError, refetch: operationsRefetchHook } = useOperations(listCriteria);
  const { wallets, loading: walletsLoading, error: walletsError, refetch: walletsRefetch } = useWallets();
  const { litres, availableLitres, money, availableMoney, loading: summaryLoading, error: summaryError } = useSummary(wallets, walletsLoading, walletsError);
  const { fuelTypesWithPrices, loading: fuelPriceVariationsLoading, error: fuelPriceVariationsError, refetch: fuelPriceVariationsRefetch } = useFuelPriceVariations();
  const [refreshing, setRefreshing] = useState(false);
  const [conn] = useContext(ConnectionContext);
  const navigation = useNavigation();
  
  operationsRefetch = operationsRefetchHook;
  const loading = operationsLoading || walletsLoading || summaryLoading || fuelPriceVariationsLoading;

  const onRefresh = () => {
    if (!conn.isConnected) {
      navigation.navigate(getRoutePath(APP_ROUTES.NoConnection, APP_ROUTES));
      return;
    }

    setRefreshing(true);
    Promise.all([walletsRefetch(), operationsRefetch(), fuelPriceVariationsRefetch()])
      .then(([]) => setRefreshing(false))
      .catch((error) => { setRefreshing(false); crashlytics().recordError(error); });
  };

  const goMyAccount = () => {
    !conn.isConnected ? navigation.navigate(getRoutePath(APP_ROUTES.NoConnection, APP_ROUTES)) :
      navigation.navigate(
        getRoutePath(HOME_ROUTE.MyAccountMovements, HOME_ROUTE),
      );
  };

  const goRefuel = () => {
    !conn.isConnected ? navigation.navigate(getRoutePath(APP_ROUTES.NoConnection, APP_ROUTES)) :
      navigation.navigate(getRoutePath(HOME_ROUTE.ScanQr, HOME_ROUTE));
  };

  const goPuschaseFuel = () => {
    !conn.isConnected ? navigation.navigate(getRoutePath(APP_ROUTES.NoConnection, APP_ROUTES)) :
      navigation.navigate(
        getRoutePath(HOME_ROUTE.PurchaseFuel, HOME_ROUTE),
      );
  };

  const goWithdrawal = () => {
    !conn.isConnected ? navigation.navigate(getRoutePath(APP_ROUTES.NoConnection, APP_ROUTES)) :
      navigation.navigate(
        getRoutePath(HOME_ROUTE.WithdrawalTypeSelection, HOME_ROUTE),
      );
  };

  const goPaymentInStore = () => {
    !conn.isConnected ? navigation.navigate(getRoutePath(APP_ROUTES.NoConnection, APP_ROUTES)) :
      navigation.navigate(getRoutePath(HOME_ROUTE.PaymentInStoreScanQr, HOME_ROUTE),
      );
  };

  const goExchange = () => {
    !conn.isConnected ? navigation.navigate(getRoutePath(APP_ROUTES.NoConnection, APP_ROUTES)) :
      navigation.navigate(getRoutePath(HOME_ROUTE.ExchangeWalletSelection, HOME_ROUTE));
  };

  const goTransfer = () => {
    !conn.isConnected ? navigation.navigate(getRoutePath(APP_ROUTES.NoConnection, APP_ROUTES)) :
      navigation.navigate(getRoutePath(HOME_ROUTE.TransferSearchUser, HOME_ROUTE));
  };

  return (
    <ShowStatusBarLayout>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} keyboardShouldPersistTaps="always">
        <Page>
          <SeparatorView>
            <IconSeparator text="Mis litros" icon={<Pump />} />
          </SeparatorView>

          <WalletCarousel 
            wallets={wallets}
            loading={loading}
            error={walletsError}
          />

          <MyAccountSummary
            litres={litres}
            availableLitres={availableLitres}
            availableMoney={availableMoney}
            money={money}
            loading={loading}
            error={summaryError}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignContent: 'center',
              height: 60,
            }}>
            <BigButton
              style={{ marginRight: 20, }}
              icon={<PumpBuyIcon />}
              label="Comprar"
              backgroundColor={THEME_COLORS.PRIMARY}
              labelColor={THEME_COLORS.WHITE}
              onPress={goPuschaseFuel}></BigButton>
            <BigButton
              icon={<PumpChargeIcon />}
              label="Cargar"
              backgroundColor={THEME_COLORS.WARNING}
              labelColor={THEME_COLORS.WHITE}
              onPress={securityCtx.hasAvailableLitres ? goRefuel :
                () => Alert.alert("No dispone de litros para realizar esta operación.")}></BigButton>
          </View>

          <SeparatorView>
            <IconSeparator text="Otras operaciones" icon={<PlusIcon />} />
          </SeparatorView>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              backgroundColor: THEME_COLORS.WHITE,
              borderRadius: 10,
              height: 80,
              elevation: 2,
              marginTop: 20,
            }}>
            <TouchableOpacity onPress={securityCtx.hasAvailableLitres ? goWithdrawal :
              () => Alert.alert("No dispone de litros para realizar esta operación.")}>
              <View
                style={{
                  width: 60,
                  height: 95,
                  justifyContent: 'center',
                  marginTop: -30,
                }}>
                <View
                  style={{
                    width: 60,
                    height: 60,
                    backgroundColor: THEME_COLORS.SUCCESS,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 10,
                  }}>
                  <TopupIcon width={30} height={35} />
                </View>
                <Text
                  style={{
                    fontFamily: 'LibreFranklin-Light',
                    fontSize: 12,
                    textAlign: 'center',
                    marginTop: 10,
                  }}>
                  Retirar fondos
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={securityCtx.hasAvailableLitres ? goPaymentInStore :
              () => Alert.alert("No dispone de litros para realizar esta operación.")}>
              <View
                style={{
                  width: 60,
                  height: 95,
                  justifyContent: 'center',
                  marginTop: -30,
                }}>
                <View
                  style={{
                    width: 60,
                    height: 60,
                    backgroundColor: THEME_COLORS.VIOLET,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 10,
                  }}>
                  <PayInStoreIcon />
                </View>
                <Text
                  style={{
                    fontFamily: 'LibreFranklin-Light',
                    fontSize: 12,
                    textAlign: 'center',
                    marginTop: 10,
                  }}>
                  Pagar en tienda
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={securityCtx.hasAvailableLitres ? goExchange :
              () => Alert.alert("No dispone de litros para realizar esta operación.")}>
              <View
                style={{
                  width: 60,
                  height: 95,
                  justifyContent: 'center',
                  marginTop: -30,
                }}>
                <View
                  style={{
                    width: 60,
                    height: 60,
                    backgroundColor: THEME_COLORS.SECONDARY,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 10,
                  }}>
                  <ExchangeWalletIcon width={35} height={37} />
                </View>
                <Text
                  style={{
                    fontFamily: 'LibreFranklin-Light',
                    fontSize: 12,
                    textAlign: 'center',
                    marginTop: 10,
                  }}>
                  Canjear billeteras
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={securityCtx.hasAvailableLitres ? goTransfer :
              () => Alert.alert("No dispone de litros para realizar esta operación.")}>
              <View
                style={{
                  width: 60,
                  height: 95,
                  justifyContent: 'center',
                  marginTop: -30,
                }}>
                <View
                  style={{
                    width: 60,
                    height: 60,
                    backgroundColor: THEME_COLORS.TRANSFER_LITRES,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 10,
                  }}>
                  <TransferLitresIcon width={35} height={37} />
                </View>
                <Text
                  style={{
                    fontFamily: 'LibreFranklin-Light',
                    fontSize: 12,
                    textAlign: 'center',
                    marginTop: 10,
                  }}>
                  Transferir litros
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <SeparatorView>
            <IconSeparator text="Movimientos" icon={<MovementsIcon />} />
          </SeparatorView>

          <HomeMovementList
            operations={operations}
            loading={loading}
            error={operationsError}
            onFooterPress={goMyAccount}
          />

          <SeparatorView>
            <IconSeparator
              text="Precio Combustibles"
              icon={<FuelPriceIcon />}
            />
          </SeparatorView>
          <FuelPricesVariation 
            fuelTypesWithPrices={fuelTypesWithPrices}
            loading={loading}
            error={fuelPriceVariationsError}
          />
        </Page>
      </ScrollView>
    </ShowStatusBarLayout>
  );
};

Home.navigationOptions = {
  title: 'FillSmart',
};

export default Home;
