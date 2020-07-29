import React, { useState, useEffect, useRef } from 'react';
import styled from "styled-components/native";
import ShowStatusBarLayout from "../../layouts/show-status-bar.layout";
import { View, StyleSheet, Text, Alert } from "react-native";
import IconMessage from "../../components/icon-message.component";
import PhoneCodeIcon from "../../assets/icons/ic_phone_code.svg";
import PasswordIcon from "../../assets/icons/ic_password.svg";
import Input from '../../components/input.component';
import Button from '../../components/button.component';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import { getRoutePath, RECOVER_PASSWORD_ROUTES } from '../../routing/routes';
import THEME_COLORS from '../../styles/theme.styles';
import useChangePwdReset from '../../hooks/use-change-pwd-reset.hook';
import { useForm } from 'react-hook-form';
import CrossedEyeIcon from '../../assets/icons/ic_password_disabled.svg';
import EyeIcon from '../../assets/icons/ic_password.svg';
import crashlytics from '@react-native-firebase/crashlytics';

const Container = styled.View`
    background-color: white;
    height: 100%;
    padding: 25px;
    justify-content: center;
    align-items: center;
`;

const InfoPanel = styled.View`
    flex: 1;
    width: 100%;
    flex-grow: 1;
`;

const styles = StyleSheet.create({
    label: {
        fontSize: 14,
        fontFamily: 'LibreFranklin-Regular',
        color: THEME_COLORS.FONT_NORMAL,
        textAlign: 'center',
    }
});

type ResetPwdForm = {
    code: string;
    pwd: string;
    rePwd: string;
};

const errorStyle: { label: string; border: string, text: string } = { label: THEME_COLORS.DANGER, border: THEME_COLORS.DANGER, text: THEME_COLORS.FONT_REGULAR };

const LoginEnterNewPasswordPage = () => {
    const navigation = useNavigation();
    const email = useNavigationParam('email');
    const { loading, error, isSuccess, executeResetPwd } = useChangePwdReset();
    const { register, setValue, setError, getValues, handleSubmit, errors, watch } = useForm<ResetPwdForm>()
    const watchForm = watch();
    const inputPwd: any = useRef();
    const inputRePwd: any = useRef();
    const [isPasswordHidden, setIsPasswordHidden] = useState(true);
    const [isRePasswordHidden, setIsRePasswordHidden] = useState(true);
    const PasswordToggleIcon = isPasswordHidden ? <EyeIcon /> : <CrossedEyeIcon />;
    const RePasswordToggleIcon = isRePasswordHidden ? <EyeIcon /> : <CrossedEyeIcon />;


    useEffect(() => {
        register(
            { name: 'code' }, { required: "Ingrese el código recibido." });
        register({ name: 'pwd' }, { required: true });
        register({ name: 'rePwd' }, {
            required: "Debe repetir la contraseña",
            validate: {
                matchesPreviousPassword: (value: string) => {
                    const { pwd } = getValues();
                    return pwd === value || "La contraseña no coincide";
                }
            }
        });
    }, [register]);

    useEffect(() => {
        if (error) {
            crashlytics().recordError(error);
            Alert.alert('Error', "El código ingresado no es correcto");
            return;
        }

        if (isSuccess) {
            goToLoginPasswordResetPage()
        }
    }, [isSuccess, error])

    const onSubmit = async (data: ResetPwdForm) => {
        executeResetPwd(email, data.code, data.pwd);
    }


    const goToLoginPasswordResetPage = () => {
        navigation.navigate(getRoutePath(RECOVER_PASSWORD_ROUTES.LoginPasswordReset, RECOVER_PASSWORD_ROUTES));
    };

    return (
        <ShowStatusBarLayout>
            <Container>
                <InfoPanel>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <IconMessage icon={<PhoneCodeIcon />} title="Establecer nueva contraseña" text="" />


                        <View style={{ marginTop: 20, alignItems: "stretch" }}>
                            <Input
                                returnKeyType="done"
                                onSubmitEditing={() => { inputPwd?.current?.focus(); }}
                                text={watchForm.code}
                                autoCapitalize="none"
                                onChangeText={text => setValue('code', text, true)}
                                label={errors.code ? errors.code.message : "Código"}
                                colors={errors.code ? errorStyle : undefined}
                            />
                        </View>
                        <View style={{ marginTop: 20, alignItems: "stretch" }}>
                            <Input
                                ref={inputPwd}
                                returnKeyType="done"
                                onSubmitEditing={() => { inputRePwd?.current?.focus(); }}
                                text={watchForm.pwd}
                                label={errors.pwd ? "Debe ingresar una contraseña" : "Contraseña"}
                                colors={errors.pwd ? errorStyle : undefined}
                                onChangeText={text => setValue('pwd', text, true)}
                                icon={PasswordToggleIcon}
                                onIconPress={() => setIsPasswordHidden(!isPasswordHidden)}
                                secureTextEntry={isPasswordHidden}
                            />
                        </View>
                        <View style={{ marginTop: 20, alignItems: "stretch" }}>
                            <Input
                                ref={inputRePwd}
                                returnKeyType="done"
                                onSubmitEditing={handleSubmit(onSubmit)}
                                placeholder="Repetir contraseña"
                                text={watchForm.rePwd}
                                label={errors.rePwd ? errors.rePwd?.message : undefined}
                                colors={errors.rePwd ? errorStyle : undefined}
                                onChangeText={text => setValue('rePwd', text, true)}
                                icon={RePasswordToggleIcon}
                                onIconPress={() => setIsRePasswordHidden(!isRePasswordHidden)}
                                secureTextEntry={isRePasswordHidden}
                            />
                        </View>

                        <View style={{ marginTop: 20, alignItems: "stretch" }}>
                            <Button label="Siguiente" onPress={handleSubmit(onSubmit)} loading={loading} />
                        </View>

                    </View>
                </InfoPanel>
            </Container>
        </ShowStatusBarLayout>
    );
};

LoginEnterNewPasswordPage.navigationOptions = {
    title: '',
};

export default LoginEnterNewPasswordPage;
