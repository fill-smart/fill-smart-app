import React from 'react';
import { Dimensions, TouchableWithoutFeedback, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import HamburguerMenuIcon from '../assets/icons/ic_hamburguer_menu.svg';
import BackButton from '../components/go-back.component';
import SideMenu from '../components/side-menu.component';
import Toolbar from '../components/toolbar.component';
import MovementDetailPage from '../pages/account-movements/movement-detail';
import MovementListPage from '../pages/account-movements/movement-list';
import MyAccount from '../pages/account-movements/my-account';
import BiometricDataRegisterPage from '../pages/biometric-register/biometric-data-register';
import BiometricDataRegisterFacePage from '../pages/biometric-register/biometric-data-register-face';
import BiometricDataRegisterFingerprintPage from '../pages/biometric-register/biometric-data-register-fingerprint';
import BiometricDataRegistrationCompletePage from '../pages/biometric-register/biometric-data-registration-complete';
import ExchangeConfirmSelectionPage from '../pages/exchange/exchange-confirm-selection';
import ExchangeOperationCompletePage from '../pages/exchange/exchange-operation-complete';
import ExchangeWalletSelectionPage from '../pages/exchange/exchange-wallet-selection';
import HelpPage from '../pages/help/help';
import Home from '../pages/home/home';
import Login from '../pages/login';
import MercadoPago from '../pages/mercadopago/mercadopago';
import NoConnectionPage from '../pages/no-connection';
import NotificationDetailPage from '../pages/notifications/notification-detail';
import NotificationsPage from '../pages/notifications/notifications';
import PaymentInStoreAmountSelectionPage from '../pages/payment-in-store/payment-in-store-amount-selection';
import PaymentInStoreConfirmPaymentMethodPage from '../pages/payment-in-store/payment-in-store-confirm-payment-method';
import PaymentInStoreDniRejected from '../pages/payment-in-store/payment-in-store-dni-rejected';
import PaymentInStoreFuelSelectionPage from '../pages/payment-in-store/payment-in-store-fuel-selection';
import PaymentInStoreOperationCompletePage from '../pages/payment-in-store/payment-in-store-operation-complete';
import PaymentInStoreQrScan from '../pages/payment-in-store/payment-in-store-qr-scan';
import PaymentInStoreVerifyDni from '../pages/payment-in-store/payment-in-store-verify-dni';
import ChangePasswordPage from '../pages/profile/change-password';
import ChangePasswordCompletePage from '../pages/profile/change-password-complete';
import ProfilePage from '../pages/profile/profile';
import ProfileCameraPage from '../pages/profile/profile-camera';
import ProfileEditDataPage from '../pages/profile/profile-edit-data';
import PurchaseConfirm from '../pages/purchase-fuel/purchase-confirm';
import PurchaseDniRejected from '../pages/purchase-fuel/purchase-dni-rejected';
import PurchaseFuel from '../pages/purchase-fuel/purchase-fuel';
import PurchasePayment from '../pages/purchase-fuel/purchase-payment';
import PurchasePaymentMethod from '../pages/purchase-fuel/purchase-payment-method';
import PurchasePaymentMP from '../pages/purchase-fuel/purchase-payment-mp';
import PurchaseQrScanPage from '../pages/purchase-fuel/purchase-qr-scan';
import PurchaseResult from '../pages/purchase-fuel/purchase-result';
import PurchaseVerifyDni from '../pages/purchase-fuel/purchase-verify-dni';
import LoginEnterNewPasswordPage from '../pages/recover-password/login-enter-new-password';
import LoginPasswordResetPage from '../pages/recover-password/login-password-reset';
import LoginRecoverPasswordPage from '../pages/recover-password/login-recover-password';
import RefuelConfirmPaymentMethodPage from '../pages/refuel/refuel-confirm-payment-method';
import RefuelConfirmQrPage from '../pages/refuel/refuel-confirm-qr';
import RefuelDniRejected from '../pages/refuel/refuel-dni-rejected';
import RefuelFuelSelectionPage from '../pages/refuel/refuel-fuel-selection';
import RefuelOperationCompletePage from '../pages/refuel/refuel-operation-complete';
import RefuelQrScan from '../pages/refuel/refuel-qr-scan';
import RefueleVerifyDni from '../pages/refuel/refuel-verify-dni';
import RegisterCamera from '../pages/register/register-camera';
import RegisterDniPage from '../pages/register/register-dni-page';
import RegisterDniScanConfirmPage from '../pages/register/register-dni-scan-confirm-page';
import RegisterDniScanPage from '../pages/register/register-dni-scan-page';
import RegisterEnterCodePage from '../pages/register/register-enter-code-page';
import RegisterEnterEmailPage from '../pages/register/register-enter-email-page';
import RegisterRegistrationCompletePage from '../pages/register/register-registration-complete';
import RegisterSendCodePage from '../pages/register/register-send-code-page';
import RegisterUserData from '../pages/register/register-user-data';
import SplashPage from '../pages/splash';
import TransferAmountSelectionPage from '../pages/transfer/transfer-amount-selection';
import TransferConfirmPage from '../pages/transfer/transfer-confirm';
import TransferOperationCompletePage from '../pages/transfer/transfer-operation-complete';
import TransferSearchUserPage from '../pages/transfer/transfer-search-user';
import UpdateApp from '../pages/update-app';
import WelcomePage from '../pages/welcome-page';
import WithdrawalAmountSelectionPage from '../pages/withdrawal/withdrawal-amount-selection';
import WithdrawalConfirmPaymentMethodPage from '../pages/withdrawal/withdrawal-confirm-payment-method';
import WithdrawalDniRejected from '../pages/withdrawal/withdrawal-dni-rejected';
import WithdrawalFuelSelectionPage from '../pages/withdrawal/withdrawal-fuel-selection';
import WithdrawalOperationCompletePage from '../pages/withdrawal/withdrawal-operation-complete';
import WithdrawalQrScanPage from '../pages/withdrawal/withdrawal-qr-scan';
import WithdrawalTransferAccountSelectionPage from '../pages/withdrawal/withdrawal-transfer-account-selection';
import WithdrawalTypeSelectionPage from '../pages/withdrawal/withdrawal-type-selection';
import WithdrawalVerifyDniPage from '../pages/withdrawal/withdrawal-verify-dni';
import THEME_COLORS from '../styles/theme.styles';


export const getRoutePath = (
  route: any,
  navigator?: { [key: string]: any },
): string => {
  const nav = navigator ?? APP_ROUTES;
  return Object.keys(nav).find(key =>
    nav[key].screen && route.screen
      ? nav[key].screen === route.screen
      : route === nav[key],
  ) as string;
};

export const defNavigationOptions = {
  headerStyle: {
    backgroundColor: THEME_COLORS.WHITE,
  },
  headerTitleAlign: 'center',
  headerTintColor: THEME_COLORS.PRIMARY,
  headerTitleStyle: {
    fontFamily: 'LibreFranklin-Medium',
    fontSize: 16,
    color: THEME_COLORS.FONT_REGULAR,
  },
  headerRight: () => <Toolbar />,
  headerLeft: () => <BackButton />,
};

export const nonHeader = {
  headerStyle: {
    elevation: 0,
  },
  headerTintColor: THEME_COLORS.PRIMARY,
};

//Register navigation flow
export const REGISTER_ROUTES = {
  Welcome: { screen: WelcomePage },
  RegisterCamera: { screen: RegisterCamera },
  RegisterDni: { screen: RegisterDniPage },
  //RegisterUserData: { screen: TestForm },
  RegisterUserData: { screen: RegisterUserData },
  RegisterDniScan: { screen: RegisterDniScanPage },
  RegisterDniScanConfirm: { screen: RegisterDniScanConfirmPage },
  //RegisterDniData: { screen: RegisterDniData },
  RegisterSendCode: { screen: RegisterSendCodePage },
  RegisterEnterCode: { screen: RegisterEnterCodePage },
  RegisterEnterEmail: { screen: RegisterEnterEmailPage },
  //RegisterActivateAccount: { screen: RegisterActivateAccountPage },
  //RegisterAccountActivated: { screen: RegisterAccountActivatedPage },
  //RegisterCreateUser: { screen: RegisterCreateUserPage },
  RegisterRegistrationComplete: { screen: RegisterRegistrationCompletePage },
};

//Biometrhic register navigation flow
export const BIOMETRIC_REGISTER_ROUTES = {
  BiometricDataRegister: { screen: BiometricDataRegisterPage },
  BiometricDataRegisterFingerprint: {
    screen: BiometricDataRegisterFingerprintPage,
  },
  BiometricDataRegisterFace: { screen: BiometricDataRegisterFacePage },
  BiometricDataRegistrationComplete: {
    screen: BiometricDataRegistrationCompletePage,
  },
};

//Recover passwrod navigation flow
export const RECOVER_PASSWORD_ROUTES = {
  LoginRecoverPassword: { screen: LoginRecoverPasswordPage },
  LoginEnterNewPassword: { screen: LoginEnterNewPasswordPage },
  LoginPasswordReset: { screen: LoginPasswordResetPage },
};

export const PROFILE_ROUTES = {
  Profile: { screen: ProfilePage },
  ProfileEditData: { screen: ProfileEditDataPage },
  ProfileCamera: { screen: ProfileCameraPage },
  ChangePassword: { 
    screen: ChangePasswordPage,
  },
  ChangePasswordComplete: { 
    screen: ChangePasswordCompletePage,
  },
};

//My account navogation flow
export const MY_ACCOUNT_ROUTES = {
  MyAccount: { screen: MyAccount },
  MyAccountMovements: { screen: MovementListPage },
  MovementList: { screen: MovementListPage },
  MovementDetail: { screen: MovementDetailPage },
};

//Purchase navigation flow
export const PURCHASE_ROUTES = {
  PurchaseFuel: { screen: PurchaseFuel },
  PurchasePaymentMethod: { screen: PurchasePaymentMethod },
  PurchaseConfirm: { screen: PurchaseConfirm },
  PurchaseResult: { screen: PurchaseResult },
  PurchasePayment: { screen: PurchasePayment },
  PurchasePaymentMP: { screen: PurchasePaymentMP },
  PurchaseQrScan: { screen: PurchaseQrScanPage },
  PurchaseVerifyDni: { screen: PurchaseVerifyDni },
  PurchaseDniRejected: { screen: PurchaseDniRejected }
};

//Refuel navigation flow
export const REFUEL_ROUTES = {
  ScanQr: { screen: RefuelQrScan },
  RefuelConfirmQr: { screen: RefuelConfirmQrPage },
  RefuelFuelSelection: { screen: RefuelFuelSelectionPage },
  RefuelConfirmPaymentMethod: { screen: RefuelConfirmPaymentMethodPage },
  RefuelOperationComplete: { screen: RefuelOperationCompletePage },
  RefuelDniRejected: { screen: RefuelDniRejected },
  RefuelVerifyDni: {
    screen: RefueleVerifyDni,
    navigationOptions: {
      headerMode: 'screen',
    },
  },
};

//Withdrawal navigation flow
export const WITHDRAWAL_ROUTES = {
  WithdrawalTypeSelection: { screen: WithdrawalTypeSelectionPage },
  WithdrawalTransferAccountSelection: { screen: WithdrawalTransferAccountSelectionPage },
  ProfileEditData: { screen: ProfileEditDataPage },
  WithdrawalQrScan: { screen: WithdrawalQrScanPage },
  WithdrawalAmountSelection: { screen: WithdrawalAmountSelectionPage },
  WithdrawalFuelSelection: { screen: WithdrawalFuelSelectionPage },
  WithdrawalConfirmPaymentMethod: { screen: WithdrawalConfirmPaymentMethodPage },
  WithdrawalOperationComplete: { screen: WithdrawalOperationCompletePage },
  WithdrawalDniRejected: { screen: WithdrawalDniRejected },
  WithdrawalVerifyDni: {
    screen: WithdrawalVerifyDniPage,
    navigationOptions: {
      headerMode: 'screen',
    },
  },
};

//Payment in sotre navigation flow
export const PAYMENT_IN_STORE_ROUTES = {
  PaymentInStoreScanQr: { screen: PaymentInStoreQrScan },
  PaymentInStoreAmountSelection: { screen: PaymentInStoreAmountSelectionPage },
  //PaymentInStoreConfirmQr: {screen: PaymentInStoreConfirmQrPage},
  PaymentInStoreFuelSelection: { screen: PaymentInStoreFuelSelectionPage },
  PaymentInStoreConfirmPaymentMethod: { screen: PaymentInStoreConfirmPaymentMethodPage },
  PaymentInStoreDniRejected: { screen: PaymentInStoreDniRejected },
  PaymentInStoreOperationComplete: { screen: PaymentInStoreOperationCompletePage },
  PaymentInStoreVerifyDni: {
    screen: PaymentInStoreVerifyDni,
    navigationOptions: {
      headerMode: 'screen',
    }
  },
};

//Exchnage navigation flow
export const EXCHANGE_WALLET_ROUTES = {
  ExchangeWalletSelection: { screen: ExchangeWalletSelectionPage },
  ExchangeConfirmSelection: { screen: ExchangeConfirmSelectionPage },
  ExchangeOperationComplete: { screen: ExchangeOperationCompletePage },
};

export const TRANSFER_ROUTES = {
  TransferSearchUser: { screen: TransferSearchUserPage },
  TransferAmountSelection: { screen: TransferAmountSelectionPage },
  TransferConfirm: { screen: TransferConfirmPage },
  TransferOperationComplete: { screen: TransferOperationCompletePage }
};

export const HOME_ROUTE = {
  Home: {
    screen: Home,
    navigationOptions: ({ navigation }: { navigation: any }) => ({
      // Title to appear in status bar
      headerLeft: () => (
        <TouchableWithoutFeedback onPress={() => navigation.toggleDrawer()}>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", width: '100%', paddingHorizontal: 24 }}>
            <HamburguerMenuIcon />
          </View>
        </TouchableWithoutFeedback>
      ),
    }),
  },
  //Purchase
  ...PURCHASE_ROUTES,
  //Refuel
  ...REFUEL_ROUTES,
  //Withdrawal
  ...WITHDRAWAL_ROUTES,
  //Payment in store routes
  ...PAYMENT_IN_STORE_ROUTES,
  //Exhange routes
  ...EXCHANGE_WALLET_ROUTES,
  //My Account routes
  ...MY_ACCOUNT_ROUTES,
  //Transfer routes
  ...TRANSFER_ROUTES,
  Notifications: { screen: NotificationsPage },
  NotificationDetail: { screen: NotificationDetailPage },
  Help: { screen: HelpPage }
};

//******NAVIGATORS***********
const RegisterNavigator = createStackNavigator(REGISTER_ROUTES, {
  initialRouteName: getRoutePath(REGISTER_ROUTES.RegisterDni, REGISTER_ROUTES),
  headerMode: 'none',
  defaultNavigationOptions: nonHeader as any,
});

const BiometricRegisterNavigator = createStackNavigator(
  BIOMETRIC_REGISTER_ROUTES,
  {
    initialRouteName: getRoutePath(
      BIOMETRIC_REGISTER_ROUTES.BiometricDataRegister,
      BIOMETRIC_REGISTER_ROUTES,
    ),
    headerMode: 'screen',
    defaultNavigationOptions: nonHeader as any,
  },
);

const RecoverPasswordNavigator = createStackNavigator(RECOVER_PASSWORD_ROUTES, {
  initialRouteName: getRoutePath(
    RECOVER_PASSWORD_ROUTES.LoginRecoverPassword,
    RECOVER_PASSWORD_ROUTES,
  ),
  headerMode: 'screen',
  defaultNavigationOptions: nonHeader as any,
});

const HomeNavigator = createStackNavigator(HOME_ROUTE as any, {
  initialRouteName: getRoutePath(HOME_ROUTE.Home, HOME_ROUTE),
  defaultNavigationOptions: defNavigationOptions as any,
});

const ProfileNavigator = createStackNavigator(PROFILE_ROUTES as any, {
  initialRouteName: getRoutePath(PROFILE_ROUTES.Profile, PROFILE_ROUTES),
  headerMode: "screen",
  defaultNavigationOptions: nonHeader as any,
})

const sideMenuWidth = () => {
  return (Math.round(Dimensions.get('window').width) / 4) * 3;
};

const MainNavigator = createDrawerNavigator(
  {
    Home: HomeNavigator,
    Profile: ProfileNavigator,
    MercadoPago: { screen: MercadoPago },
  },
  {
    initialRouteName: 'Home',
    drawerPosition: 'left',
    drawerWidth: sideMenuWidth,
    contentComponent: SideMenu,
    unmountInactiveRoutes: true,
  },
);

//******END NAVIGATORS***********

//APP NAVIGATOR
export const DIRECT_ROUTES = {
  Splash: { screen: SplashPage },
  Welcome: { screen: WelcomePage },
  Login: { screen: Login },
  RegisterEnterCode: { screen: RegisterEnterCodePage },
  RegisterRegistrationComplete: { screen: RegisterRegistrationCompletePage },
  NoConnection: { screen: NoConnectionPage },
  UpdateApp: { screen: UpdateApp },
};

export const NAVIGATOR_ROUTES = {
  Register: RegisterNavigator,
  BiometricRegister: BiometricRegisterNavigator,
  RecoverPassword: RecoverPasswordNavigator,
  Main: MainNavigator,
};

export const APP_ROUTES = {
  ...NAVIGATOR_ROUTES,
  ...DIRECT_ROUTES,
};

const AppNavigator = createStackNavigator(APP_ROUTES, {
  headerMode: 'none',
  initialRouteName: getRoutePath(APP_ROUTES.Splash),
});
//END APP NAVIGATOR

const Navigator = createAppContainer(AppNavigator);

export default Navigator;
