import React, { useState, useEffect, useContext } from 'react';
import styled from "styled-components/native";
import ShowStatusBarLayout from "../../layouts/show-status-bar.layout";
import { View, Alert, TouchableOpacity, TouchableHighlight, KeyboardAvoidingView, Platform } from "react-native";
import IconMessage from "../../components/icon-message.component";
import PhoneCodeIcon from "../../assets/icons/ic_phone_code.svg";
import Input from '../../components/input.component';
import Button from '../../components/button.component';
import TextButton from '../../components/text-button.component';
import { useNavigation } from 'react-navigation-hooks';
import { getRoutePath, REGISTER_ROUTES, APP_ROUTES } from '../../routing/routes';
import useActivateAccount from '../../hooks/use-activate-account.hook';
import LottieView from 'lottie-react-native';
import { SecurityContext, SECURITY_ACTIONS } from '../../contexts/security.context';
import useResendActivationCode from '../../hooks/use-resend-code-account-validation.hook';
import useLogin from '../../hooks/use-login.hook';
import { NavigationActions, StackActions } from 'react-navigation';
import crashlytics from '@react-native-firebase/crashlytics';



const Container = styled.View`
    background-color: white;
    flex: 1;
    padding: 25px;
    justify-content: center;
    align-items: center;
`;

const InfoPanel = styled.View`
    flex: 1;
    width: 100%;
    flex-grow: 1;
`;

const ActionPanel = styled.View`
    width: 100%;
    height: 100px;
`;

const LottieWrapper = styled.View`
  width: 48px;
  height: 48px;
`;

const RegisterEnterCodePage = () => {
    const [code, setCode] = useState('');
    const { isSuccess, loading, error, executeActivateAccount } = useActivateAccount();
    const { isSuccess: resendSuccess, error: resendError, reSendCode } = useResendActivationCode();
    const [securityCtx, dispatch] = useContext(SecurityContext);
    const { doLogout } = useLogin();
    const navigation = useNavigation();

    useEffect(() => {
        if (isSuccess) {
            dispatch({ type: SECURITY_ACTIONS.SET_ACTIVE });
            navigation.navigate(getRoutePath(REGISTER_ROUTES.RegisterRegistrationComplete, REGISTER_ROUTES));
        }

        if (error) {
            crashlytics().recordError(error);
            Alert.alert("Error", "El código ingresado es incorrecto")
        }
    }, [isSuccess, error])

    useEffect(() => {
        if (resendSuccess) {
            Alert.alert("Información", "Se reenvió el código para activar su cuenta.")
        }

        if (resendError) {
            crashlytics().recordError(resendError);
            Alert.alert("Error", "Ocurrió un error al enviar el código. Intente nuevamente mas tarde.")
        }
    }, [resendSuccess, resendError])

    const goToActivatedAccountPage = () => {
        executeActivateAccount(code);
    };

    const sendCode = () => {
        reSendCode();
    }

    const logout = () => {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: getRoutePath(APP_ROUTES.Welcome) }),
            ],
        });
        doLogout();
        navigation.dispatch(resetAction);
    }

    return (
        <ShowStatusBarLayout>
            <Container>
                <InfoPanel>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <IconMessage icon={<PhoneCodeIcon />} title="Es necesario que actives tu cuenta" text="Te enviamos un mail con el código para activarla." />
                        <View style={{ marginTop: 20, alignItems: "stretch" }}>
                            <Input
                                label="Código"
                                text={code}
                                keyboardType="number-pad"
                                returnKeyType="done"
                                onChangeText={(code) => setCode(code)}
                            />
                        </View>

                        <Button label="Siguiente" onPress={goToActivatedAccountPage} style={{ marginTop: 20 }} loading={loading} />

                        <View style={{ marginTop: 15 }}>
                            <TextButton label="Enviar código de nuevo" onPress={sendCode} />
                        </View>

                        <View style={{ marginTop: 15 }}>
                            <TextButton label="Ingresar con otro usuario" onPress={logout} />
                        </View>


                    </View>
                </InfoPanel>
            </Container>
        </ShowStatusBarLayout>
    );
};

RegisterEnterCodePage.navigationOptions = {
    title: '',
};

export default RegisterEnterCodePage;
