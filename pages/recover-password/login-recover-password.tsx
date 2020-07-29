import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import styled from 'styled-components/native';
import PhoneCodeIcon from "../../assets/icons/ic_phone_code.svg";
import ShowStatusBarLayout from '../../layouts/show-status-bar.layout';
import IconMessage from '../../components/icon-message.component';
import Input from '../../components/input.component';
import Button from '../../components/button.component';
import { getRoutePath, RECOVER_PASSWORD_ROUTES } from '../../routing/routes';
import { useNavigation } from 'react-navigation-hooks';
import { useForm } from 'react-hook-form';
import THEME_COLORS from '../../styles/theme.styles';
import { emailExists } from '../../hooks/use-validate-customer-email.hook';
import useChangePwdRequestCode from '../../hooks/use-change-pwd-request-code.hook';
import crashlytics from '@react-native-firebase/crashlytics';


const Container = styled.View`
background-color: ${THEME_COLORS.WHITE};
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

type ResetPwdForm = {
    email: string;
};

const errorStyle: { label: string; border: string, text: string } = { label: THEME_COLORS.DANGER, border: THEME_COLORS.DANGER, text: THEME_COLORS.FONT_REGULAR };


const LoginRecoverPasswordPage = () => {
    const navigation = useNavigation();
    const { loading, error, isSuccess, executeRequestCode } = useChangePwdRequestCode();
    const { register, setValue, setError, getValues, handleSubmit, errors, watch } = useForm<ResetPwdForm>()
    const watchForm = watch();

    useEffect(() => {
        register({ name: 'email' }, {
            required: "Ingrese un email",
            pattern: {
                value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                message: 'Ingrese un email válido'
            }
        });
    }, [register]);

    useEffect(() => {
        if (error) {
            crashlytics().recordError(error);
            Alert.alert('Error', "Ocurrió un error al enviar el código para restablecer la contraseña");
            return;
        }

        if (isSuccess) {
            goToLoginEnterNewPasswordPage()
        }
    }, [isSuccess, error]);

    const onSubmit = async (data: ResetPwdForm) => {
        try {
            const existsEmail = await emailExists(data.email);
            if (!existsEmail) {
                setError("email", '', 'La cuenta de email no se encuentra registrada');
                return;
            }
            executeRequestCode(data.email);
        }
        catch (error) {
            crashlytics().recordError(error);
            Alert.alert('Error', "Ocurrió un error al enviar el código para restablecer la contraseña");
        }

        //Alert.alert('Form Data', JSON.stringify(data) + ". Errors:" + JSON.stringify(errors));        
    }

    const goToLoginEnterNewPasswordPage = () => {
        navigation.navigate(getRoutePath(RECOVER_PASSWORD_ROUTES.LoginEnterNewPassword, RECOVER_PASSWORD_ROUTES), { email: watchForm.email });
    };

    return (
        <ShowStatusBarLayout>
            <Container>
                <InfoPanel>

                    <View style={{ flex: 1, justifyContent: "flex-start", alignItems: "center", marginTop: 20 }}>
                        <IconMessage icon={<PhoneCodeIcon />} title="Recuperar contraseña" text="Se enviará un email con un código para restablecer la contraseña" />
                        <View style={{ marginTop: 20, width: "100%" }}>
                            <Input
                                returnKeyType="done"
                                onSubmitEditing={handleSubmit(onSubmit)}
                                text={watchForm.email}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                onChangeText={text => setValue('email', text, true)}
                                label={errors.email ? errors.email.message : "Email"}
                                colors={errors.email ? errorStyle : undefined} />
                            <Button label="Enviar" onPress={handleSubmit(onSubmit)} style={{ marginTop: 20 }} loading={loading} />
                        </View>

                    </View>
                </InfoPanel>



            </Container>
        </ShowStatusBarLayout>
    );
}

LoginRecoverPasswordPage.navigationOptions = {
    title: '',
};

export default LoginRecoverPasswordPage;


