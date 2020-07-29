import React, { useState, useEffect, useRef } from 'react';
import { View, ActivityIndicator, KeyboardAvoidingView, Dimensions, TextInput, Platform } from 'react-native';
import Input from '../components/input.component';
import CrossedEyeIcon from '../assets/icons/ic_password_disabled.svg';
import EyeIcon from '../assets/icons/ic_password.svg';
import User from '../assets/icons/ic_user.svg';
import IconMessage from '../components/icon-message.component';
import Button from '../components/button.component';
import TextButton from '../components/text-button.component';
import styled from 'styled-components/native';
import THEME_COLORS from '../styles/theme.styles';
import ShowStatusBarLayout from '../layouts/show-status-bar.layout';
import { useNavigation } from 'react-navigation-hooks';
import LottieView from 'lottie-react-native';

import {
  getRoutePath,
  APP_ROUTES,
  RECOVER_PASSWORD_ROUTES,
  BIOMETRIC_REGISTER_ROUTES,
  REGISTER_ROUTES,
} from '../routing/routes';
import useLogin from '../hooks/use-login.hook';
import { StackActions, NavigationActions } from 'react-navigation';
import Loader from '../components/loader.component';
import { ScrollView } from 'react-native-gesture-handler';
import { REGISTER_ACTIONS } from '../contexts/register-user.context';
import { StackNavigationProp } from 'react-navigation-stack/lib/typescript/src/vendor/types';

const WarningText = styled.Text`
  font-size: 12px;
  font-family: 'LibreFranklin-Regular';
  color: ${THEME_COLORS.FONT_NORMAL};
  padding: 0px 15px;
`;

const DangerText = styled.Text`
  font-size: 12px;
  font-family: 'LibreFranklin-Regular';
  color: ${THEME_COLORS.DANGER};
  padding: 0px 15px;
`;

const MainView = styled.View`
  background-color: white;
  height: 100%;
  padding: 25px;
  justify-content: center;
`;

const LottieWrapper = styled.View`
  width: 48px;
  height: 48px;
`;

export const Login = () => {
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const navigation = useNavigation() as StackNavigationProp;
  const { loading, error, isAuthenticated, isActive, doLogin, doLogout } = useLogin();
  const inputPwd: any = useRef();

  useEffect(() => {
    if (isAuthenticated) {
      if (isActive) {
        const resetAction = StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: getRoutePath(APP_ROUTES.Main),
            }),
          ],
        });
        navigation.dispatch(resetAction);
      }
      else {
        navigation.reset([
          NavigationActions.navigate({ routeName: getRoutePath(REGISTER_ROUTES.RegisterEnterCode, REGISTER_ROUTES) })
        ], 0);
      }
    }
  }, [isAuthenticated]);


  const goToLoginRecoverPasswordPage = () => {
    navigation.navigate(
      getRoutePath(
        RECOVER_PASSWORD_ROUTES.LoginRecoverPassword,
        RECOVER_PASSWORD_ROUTES,
      ),
    );
  };

  const goToBiometricDataRegisterPage = () => {
    navigation.navigate(
      getRoutePath(
        BIOMETRIC_REGISTER_ROUTES.BiometricDataRegister,
        BIOMETRIC_REGISTER_ROUTES,
      ),
    );
  };

  const handleSubmit = () => {
    if (!isAuthenticated) {
      doLogin(username, password);
    }
  };

  const PasswordToggleIcon = isPasswordHidden ? <EyeIcon /> : <CrossedEyeIcon />;
  const hasError = error;
  const color: { label: string; border: string, text: string } | undefined = hasError
    ? { label: THEME_COLORS.DANGER, border: THEME_COLORS.DANGER, text: THEME_COLORS.FONT_REGULAR }
    : { label: THEME_COLORS.PRIMARY, border: THEME_COLORS.PRIMARY, text: THEME_COLORS.FONT_REGULAR };
  // if (loading) {
  //   return <Loader />;
  // }

  const screenHeight = Math.round(Dimensions.get('window').height) - 30;

  return (
    <ShowStatusBarLayout>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={{ height: screenHeight }} >

          <MainView>
            <View style={{ marginBottom: 22 }}>
              <IconMessage
                icon={<User />}
                title="Login"
                text="Ingresa"></IconMessage>
            </View>
            <View style={{ marginBottom: 20 }}>
              <Input
                returnKeyType="done"
                onSubmitEditing={() => { inputPwd?.current?.focus(); }}
                blurOnSubmit={false}
                keyboardType="email-address"
                autoCapitalize="none"
                colors={color}
                key="username"
                label="Email"
                text={username}
                onChangeText={text => setUsername(text)}></Input>
            </View>
            <View style={{ marginBottom: 5 }}>
              <Input
                onSubmitEditing={handleSubmit}
                returnKeyType="done"
                blurOnSubmit={false}
                ref={inputPwd}
                autoCapitalize="none"
                colors={color}
                key="password"
                secureTextEntry={isPasswordHidden}
                label="Contraseña"
                text={password}
                onChangeText={text => setPassword(text)}
                onIconPress={() => setIsPasswordHidden(!isPasswordHidden)}
                icon={PasswordToggleIcon}></Input>
            </View>
            <View style={{ marginBottom: 45 }}>
              <WarningText>
                Al ingresar mal la contraseña 3 veces, su cuenta se bloqueará
          </WarningText>

              {error ?
                <View style={{ marginTop: 20, alignContent: "center", justifyContent: "center", flexDirection: "row" }}>
                  <DangerText>
                    Usuario o contraseña incorrectos
          </DangerText>
                </View>
                : null
              }


            </View>

            {/* <View style={{ marginBottom: 20 }}>
              <TextButton
                label="Ingresar con huella o rostro"
                onPress={goToBiometricDataRegisterPage}></TextButton>
            </View> */}

            <View style={{ marginBottom: 10 }}>
              <Button onPress={handleSubmit} label="Ingresar" loading={loading}></Button>
            </View>
            <View>
              <TextButton
                label="Olvidé mi contraseña"
                onPress={goToLoginRecoverPasswordPage}></TextButton>
            </View>
          </MainView>
        </ScrollView>
      </KeyboardAvoidingView>
    </ShowStatusBarLayout >
  );
};

export default Login;
