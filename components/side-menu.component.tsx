import React, { useContext } from 'react';
import SafeAreaView from 'react-native-safe-area-view';
import { DrawerItems, DrawerActions } from 'react-navigation-drawer';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacityComponent,
  Alert,
  Image,
} from 'react-native';
import THEME_COLORS from '../styles/theme.styles';
import ArrowBackWhiteIcon from '../assets/icons/ic_arrow_simple_left_white.svg';
import ProfileDefaultIcon from '../assets/icons/ic_profile_default.svg';
import BuyMenuIcon from '../assets/icons/ic_menu_buy.svg';
import ChargeMenuIcon from '../assets/icons/ic_menu_charge.svg';
import ExchangeMenuIcon from '../assets/icons/ic_menu_exchange_wallets.svg';
import TransferLitresMenuIcon from '../assets/icons/ic_menu_transfer_litres.svg';
import HelpMenuIcon from '../assets/icons/ic_menu_help.svg';
import HomeMenuIcon from '../assets/icons/ic_menu_home.svg';
import LogoutMenuIcon from '../assets/icons/ic_menu_logout.svg';
import PayInStoreMenuIcon from '../assets/icons/ic_menu_pay_in_store.svg';
import RingMenuIcon from '../assets/icons/ic_menu_ring.svg';
import SettingsMenuIcon from '../assets/icons/ic_menu_settings.svg';
import WithdrawalMenuIcon from '../assets/icons/ic_menu_topup.svg';
import WalletMenuIcon from '../assets/icons/ic_menu_wallet.svg';
import HeaderBackground from '../assets/icons/ic_user_back.svg';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import { useNavigation } from 'react-navigation-hooks';
import {
  getRoutePath,
  APP_ROUTES,
  HOME_ROUTE,
} from '../routing/routes';
import { StackActions, NavigationActions } from 'react-navigation';
import useLogin from '../hooks/use-login.hook';
import { SecurityContext } from '../contexts/security.context';
import { ConnectionContext } from '../contexts/connection-context';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    paddingLeft: 12,
    alignItems: 'center',
    height: 110,
    backgroundColor: THEME_COLORS.PRIMARY,
  },

  headerTextContainer: {
    flex: 1,
    alignItems: 'flex-start',
    marginHorizontal: 12,
    marginBottom: 14,
  },

  headerText: {
    fontFamily: 'LibreFranklin-Regular',
    fontSize: 18,
    color: THEME_COLORS.WHITE,
  },

  headerSubText: {
    fontFamily: 'LibreFranklin-Light',
    fontSize: 12,
    color: THEME_COLORS.WHITE,
  },

  separator: {
    borderColor: THEME_COLORS.LINES,
    borderWidth: 1,
    borderStyle: 'solid',
    marginHorizontal: 24,
  },

  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
    paddingVertical: 14,
  },

  itemLabel: {
    marginLeft: 16,
    fontFamily: 'LibreFranklin-Regular',
    fontSize: 16,
    color: THEME_COLORS.FONT_REGULAR,
  },
});

const MenuItem = ({
  title,
  icon,
  onPress,
}: {
  title: string;
  icon: Element;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.itemContainer}>
        {icon}
        <Text style={styles.itemLabel}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const SideMenu = (props: any) => {
  const navigation = useNavigation();
  const [securityCtx] = useContext(SecurityContext);
  const [conn] = useContext(ConnectionContext);
  const { doLogout } = useLogin();

  const navigate = (useCase: any, useCaseModule: any) => {
    navigation.dispatch(DrawerActions.toggleDrawer());
    navigation.navigate(getRoutePath(useCase, useCaseModule));
  };

  const logout = () => {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: getRoutePath(APP_ROUTES.Welcome) }),
      ],
    });
    doLogout();
    props.navigation.dispatch(resetAction);
  };

  return (
    <ScrollView keyboardShouldPersistTaps="always">
      <SafeAreaView
        style={styles.container}
        forceInset={{ top: 'always', horizontal: 'never' }}>
        <View style={styles.header}>
          <TouchableWithoutFeedback
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
            <ArrowBackWhiteIcon />
          </TouchableWithoutFeedback>

          <TouchableOpacity onPress={() => !conn.isConnected ? navigation.navigate(getRoutePath(APP_ROUTES.NoConnection, APP_ROUTES)) : navigation.navigate('Profile')}>
            {securityCtx.user?.customer.profileImage ?
              <Image style={{ width: 50, height: 50, borderRadius: 50 / 2, marginHorizontal: 12 }} source={{
                uri: `data:image/png;base64,${securityCtx.user?.customer.profileImage}`,
              }} /> : <ProfileDefaultIcon width="50" height="50" style={{ marginHorizontal: 12 }} />
            }
          </TouchableOpacity>

          <View style={styles.headerTextContainer}>
            <TouchableOpacity onPress={() => !conn.isConnected ? navigation.navigate(getRoutePath(APP_ROUTES.NoConnection, APP_ROUTES)) : navigation.navigate('Profile')}>
              <Text style={styles.headerText}>
                {securityCtx.user?.customer.firstName}{' '}
                {securityCtx.user?.customer.lastName}
              </Text>
              <Text style={styles.headerSubText}>Ver y editar perfil</Text>
            </TouchableOpacity>
          </View>

          <HeaderBackground style={{ position: 'absolute', right: 0, top: 0 }} />
        </View>

        <View>
          <MenuItem
            title="Inicio"
            onPress={() => navigate(HOME_ROUTE.Home, HOME_ROUTE)}
            icon={
              <HomeMenuIcon
                width="20"
                height="20"
                fill={THEME_COLORS.FONT_REGULAR}
              />
            }
          />
          <MenuItem
            title="Mi cuenta"
            onPress={() => !conn.isConnected ? navigation.navigate(getRoutePath(APP_ROUTES.NoConnection, APP_ROUTES)) :
              navigate(HOME_ROUTE.MyAccount, HOME_ROUTE)
            }
            icon={
              <WalletMenuIcon
                width="20"
                height="20"
                fill={THEME_COLORS.FONT_REGULAR}
              />
            }
          />
          <MenuItem
            title="Notificaciones"
            onPress={() => !conn.isConnected ? navigation.navigate(getRoutePath(APP_ROUTES.NoConnection, APP_ROUTES)) :
              navigate(HOME_ROUTE.Notifications, HOME_ROUTE)}
            icon={
              <RingMenuIcon
                width="20"
                height="20"
                fill={THEME_COLORS.FONT_REGULAR}
              />
            }
          />
          <View style={styles.separator} />

          <MenuItem
            title="Comprar"
            onPress={() => !conn.isConnected ? navigation.navigate(getRoutePath(APP_ROUTES.NoConnection, APP_ROUTES)) :
              navigate(HOME_ROUTE.PurchaseFuel, HOME_ROUTE)}
            icon={
              <BuyMenuIcon
                width="20"
                height="20"
                fill={THEME_COLORS.FONT_REGULAR}
              />
            }
          />
          <MenuItem
            title="Cargar"
            onPress={() => !conn.isConnected ? navigation.navigate(getRoutePath(APP_ROUTES.NoConnection, APP_ROUTES)) :
              securityCtx.hasAvailableLitres ? navigate(HOME_ROUTE.ScanQr, HOME_ROUTE) :
                Alert.alert("No dispone de litros para realizar esta operación.")
            }
            icon={
              <ChargeMenuIcon
                width="20"
                height="20"
                fill={THEME_COLORS.FONT_REGULAR}
              />
            }
          />
          <View style={styles.separator} />

          <MenuItem
            title="Retirar fondos"
            onPress={() => !conn.isConnected ? navigation.navigate(getRoutePath(APP_ROUTES.NoConnection, APP_ROUTES)) :
              securityCtx.hasAvailableLitres ? navigate(HOME_ROUTE.WithdrawalTypeSelection, HOME_ROUTE) :
                Alert.alert("No dispone de litros para realizar esta operación.")
            }
            icon={
              <WithdrawalMenuIcon
                width="20"
                height="20"
                fill={THEME_COLORS.FONT_REGULAR}
              />
            }
          />
          <MenuItem
            title="Pagar en tienda"
            onPress={() => !conn.isConnected ? navigation.navigate(getRoutePath(APP_ROUTES.NoConnection, APP_ROUTES)) :
              securityCtx.hasAvailableLitres ? navigate(HOME_ROUTE.PaymentInStoreScanQr, HOME_ROUTE) :
                Alert.alert("No dispone de litros para realizar esta operación.")
            }
            icon={
              <PayInStoreMenuIcon
                width="20"
                height="20"
                fill={THEME_COLORS.FONT_REGULAR}
              />
            }
          />
          <MenuItem
            title="Canjear billetera"
            onPress={() => !conn.isConnected ? navigation.navigate(getRoutePath(APP_ROUTES.NoConnection, APP_ROUTES)) :
              securityCtx.hasAvailableLitres ? navigate(HOME_ROUTE.ExchangeWalletSelection, HOME_ROUTE) :
                Alert.alert("No dispone de litros para realizar esta operación.")
            }
            icon={
              <ExchangeMenuIcon
                width="20"
                height="20"
                fill={THEME_COLORS.FONT_REGULAR}
              />
            }
          />
          <MenuItem
            title="Transferir litros"
            onPress={() => !conn.isConnected ? navigation.navigate(getRoutePath(APP_ROUTES.NoConnection, APP_ROUTES)) :
              securityCtx.hasAvailableLitres ? navigate(HOME_ROUTE.TransferSearchUser, HOME_ROUTE) :
                Alert.alert("No dispone de litros para realizar esta operación.")
            }
            icon={
              <TransferLitresMenuIcon
                width="20"
                height="20"
                fill={THEME_COLORS.FONT_REGULAR}
              />
            }
          />
          <View style={styles.separator} />

          {/* <MenuItem
            title="Ayuda"
            onPress={() => null}
            icon={
              <HelpMenuIcon
                width="20"
                height="20"
                fill={THEME_COLORS.FONT_REGULAR}
              />
            }
          /> */}
          <MenuItem
            title="Configurar"
            onPress={() => navigate(HOME_ROUTE.PurchasePaymentMP, HOME_ROUTE)}
            icon={
              <SettingsMenuIcon
                width="20"
                height="20"
                fill={THEME_COLORS.FONT_REGULAR}
              />
            }
          />
          <MenuItem
            title="Cerrar"
            onPress={logout}
            icon={
              <LogoutMenuIcon
                width="20"
                height="20"
                fill={THEME_COLORS.FONT_REGULAR}
              />
            }
          />
        </View>

        {/* <DrawerItems {...props} /> */}
      </SafeAreaView>
    </ScrollView>
  );
};

export default SideMenu;
