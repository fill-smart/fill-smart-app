import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import styled from "styled-components/native";
import ShowStatusBarLayout from "../../layouts/show-status-bar.layout";
import { View, StyleSheet, Text, Alert, TextInput, Dimensions, KeyboardAvoidingView, Platform } from "react-native";
import IconMessage from "../../components/icon-message.component";
import UserLoginIcon from "../../assets/icons/ic_user_login.svg";
import PasswordIcon from "../../assets/icons/ic_password.svg";
import Input from '../../components/input.component';

import { useNavigation } from 'react-navigation-hooks';
import { getRoutePath, REGISTER_ROUTES } from '../../routing/routes';
import THEME_COLORS from '../../styles/theme.styles';
import { ScrollView } from 'react-native-gesture-handler';
import { useForm, Controller } from 'react-hook-form'
import Button from '../../components/button.component';
import { RegisterContext, REGISTER_ACTIONS } from '../../contexts/register-user.context';
import moment from 'moment';
import DateInput from '../../components/date-input.component';
import { dniExists } from '../../hooks/use-validate-customer-document.hook';
import crashlytics from '@react-native-firebase/crashlytics';


const Container = styled.View`
    background-color: white; 
    height: 100%;
    padding: 25px;    
    padding-top: 0px;
    padding-bottom: 0px;
    justify-content: center;
    align-items: center;
`;

const InfoPanel = styled.View`
    flex: 1;
    width: 100%;    
`;

const styles = StyleSheet.create({
    label: {
        fontSize: 14,
        fontFamily: 'LibreFranklin-Regular',
        color: THEME_COLORS.FONT_NORMAL,
        textAlign: 'center',
    }
});

type RegisterFormData = {
    firstName: string;
    lastName: string;
    identityNumber: string;
    birthDate: Date;
};

const RegisterUserData = () => {
    const navigation = useNavigation();
    const [_, dispatch] = useContext(RegisterContext);
    const { control, register, setValue, setError, handleSubmit, errors, formState, watch } = useForm<RegisterFormData>()
    const watchForm = watch();
    //const [showCalendar, setShowCalendar] = useState(false);
    //const initialBirthDate = new Date()
    //const watchBirthDate = watch('birthDate');
    const surname: any = useRef();
    const identityNumber: any = useRef();

    useEffect(() => {
        register({ name: 'firstName' }, { required: true });
        register({ name: 'lastName' }, { required: true });
        register({ name: 'identityNumber' }, { required: "Debe ingresar un valor" });
        register({ name: 'birthDate', value: moment('01/01/1986').toDate() }, { required: true });
    }, [register]);

    const onSubmit = async (data: RegisterFormData) => {
        try {
            //validate date        
            const birthDate = moment(data.birthDate);
            if (!birthDate.isValid()) {
                setError("birthDate", "Fecha inválida. Ingrese con formato dd/mm/yyyy");
                return;
            }

            const existsDni = await dniExists(data.identityNumber);
            if (existsDni) {
                setError("identityNumber", '', 'El Nro. de DNI ya se encuentra registrado');
                return;
            }

            dispatch({
                type: REGISTER_ACTIONS.SET_REGISTER_DATA,
                payload: {
                    registerData: {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        documentNumber: data.identityNumber,
                        born: birthDate.toDate(),
                    }
                }
            });

            goToRegisterPhoneNumber();
        }
        catch (error) {
            crashlytics().recordError(error);
            Alert.alert('Error', "Ocurrió un error al registrar los datos del usuario");
        }
        //Alert.alert('Form Data', JSON.stringify(data) + ". Errors:" + JSON.stringify(errors));        
    }

    const goToRegisterPhoneNumber = () => {
        navigation.navigate(getRoutePath(REGISTER_ROUTES.RegisterSendCode, REGISTER_ROUTES));
    };


    const errorStyle: { label: string; border: string, text: string } = { label: THEME_COLORS.DANGER, border: THEME_COLORS.DANGER, text: THEME_COLORS.FONT_REGULAR };
    const screenHeight = Math.round(Dimensions.get('window').height) - 30;

    return (
        <ShowStatusBarLayout>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : undefined}>
                <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={{ height: screenHeight }} >
                    <Container>
                        <InfoPanel>
                            <View style={{ flex: 1, justifyContent: "center" }}>
                                <IconMessage icon={<UserLoginIcon />} title="Registro" text="Ingresa tus datos personales" iconStyle={{ marginLeft: 35, marginBottom: -10 }} />
                                <View style={{ marginTop: 20 }}>
                                    <Input
                                        returnKeyType="done"
                                        onSubmitEditing={() => surname?.current?.focus()}
                                        onChangeText={text => setValue('firstName', text, true)}
                                        label={errors.firstName ? "Debe ingresar su nombre" : "Nombre"}
                                        colors={errors.firstName ? errorStyle : undefined} />
                                </View>

                                <View style={{ marginTop: 20 }}>
                                    <Input
                                        ref={surname}
                                        returnKeyType="done"
                                        onSubmitEditing={() => identityNumber?.current?.focus()}
                                        onChangeText={text => setValue('lastName', text, true)}
                                        label={errors.lastName ? "Debe ingresar su apellido" : "Apellido"}
                                        colors={errors.lastName ? errorStyle : undefined} />
                                </View>

                                <View style={{ marginTop: 20 }}>
                                    <Input
                                        ref={identityNumber}
                                        returnKeyType="done"
                                        onSubmitEditing={handleSubmit(onSubmit)}
                                        text={watchForm.identityNumber}
                                        keyboardType="number-pad"
                                        onChangeText={text => setValue('identityNumber', text, true)}
                                        label={errors.identityNumber ? errors.identityNumber.message : "DNI"}
                                        colors={errors.identityNumber ? errorStyle : undefined} />
                                </View>
                                <Button label="Siguiente" onPress={handleSubmit(onSubmit)} style={{ marginTop: 20 }} />
                            </View>
                        </InfoPanel>
                    </Container>
                </ScrollView>
            </KeyboardAvoidingView>
        </ShowStatusBarLayout >
    );
};

RegisterUserData.navigationOptions = {
    title: '',
};

export default RegisterUserData;
