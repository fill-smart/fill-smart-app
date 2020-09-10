import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions, ScrollView, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';

import styled from 'styled-components/native';
import PhoneIcon from '../../assets/icons/ic_phone.svg';
import ShowStatusBarLayout from '../../layouts/show-status-bar.layout';
import IconMessage from '../../components/icon-message.component';
import Input from '../../components/input.component';
import Button from '../../components/button.component';
import THEME_COLORS from '../../styles/theme.styles';
import { getRoutePath, REGISTER_ROUTES } from '../../routing/routes';
import { RegisterContext, REGISTER_ACTIONS } from '../../contexts/register-user.context';
import { useForm } from 'react-hook-form';
import { phoneExists } from '../../hooks/use-validate-customer-phone.hook';
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

const ActionPanel = styled.View`
width: 100%;
height: 100px;
`;

const styles = StyleSheet.create({
    label: {
        fontSize: 14,
        fontFamily: 'LibreFranklin-Regular',
        color: THEME_COLORS.FONT_NORMAL,
        marginLeft: 24
    },
    input: {
        marginBottom: 6
    }
});

type RegisterFormData = {
    phone: string
};

const RegisterSendCodePage = () => {
    const navigation = useNavigation();
    const [state, dispatch] = useContext(RegisterContext);
    const { register, setValue, setError, handleSubmit, errors, watch } = useForm<RegisterFormData>()
    const watchForm = watch();

    useEffect(() => {
        register({ name: 'phone' }, { required: "Ingrese el número de teléfono" });
    }, [register]);

    const onSubmit = async (data: RegisterFormData) => {
        try {
            const existsPhone = await phoneExists(data.phone);
            if (existsPhone) {
                setError("phone", "", "El número de teléfono ya existe");
                return;
            }

            dispatch({
                type: REGISTER_ACTIONS.SET_REGISTER_DATA,
                payload: {
                    registerData: {
                        phone: data.phone,
                    }
                }
            });

            goToRegisterEnterMailPage();
        }
        catch (ex) {
            crashlytics().recordError(ex);
            Alert.alert('Error', "Ocurrió un error al registrar el número de teléfono");
        }
    }

    const goToRegisterEnterMailPage = () => {
        navigation.navigate(getRoutePath(REGISTER_ROUTES.RegisterEnterEmail, REGISTER_ROUTES));
    }

    const errorStyle: { label: string; border: string, text: string } = { label: THEME_COLORS.DANGER, border: THEME_COLORS.DANGER, text: THEME_COLORS.FONT_REGULAR };
    const screenHeight = Math.round(Dimensions.get('window').height) - 30;

    return (
        <ShowStatusBarLayout>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : undefined}>
                <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={{ height: screenHeight }} >
                    <Container>
                        <InfoPanel>
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                <IconMessage icon={<PhoneIcon />} title="Celular"></IconMessage>
                                <View style={{ marginTop: 20, width: "100%" }}>
                                    <Input
                                        style={styles.input} 
                                        text={watchForm.phone}
                                        keyboardType="number-pad"
                                        onSubmitEditing={handleSubmit(onSubmit)}
                                        returnKeyType="done"
                                        onChangeText={text => setValue('phone', text, true)}
                                        label={errors.phone ? errors.phone.message : "Nro. de celular"}
                                        colors={errors.phone ? errorStyle : undefined}
                                    />
                                    <Text style={styles.label}>Con el código de área y sin el 15.</Text>
                                    <Text style={styles.label}>Por ejemplo: 114444444 para Buenos Aires</Text>
                                </View>
                            </View>
                            <Button label="Siguiente" onPress={handleSubmit(onSubmit)} style={{ marginTop: 20 }}></Button>
                        </InfoPanel>
                    </Container>
                </ScrollView>
            </KeyboardAvoidingView>
        </ShowStatusBarLayout>
    );

}

RegisterSendCodePage.navigationOptions = {
    title: '',
};

export default RegisterSendCodePage;


