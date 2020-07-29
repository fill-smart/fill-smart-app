import React, { useState, useContext, useEffect } from 'react';
import styled from "styled-components/native";
import ShowStatusBarLayout from "../../layouts/show-status-bar.layout";
import { View, StyleSheet, Text } from "react-native";
import IconMessage from "../../components/icon-message.component";
import UserLoginIcon from "../../assets/icons/ic_user_login.svg";
import PasswordIcon from "../../assets/icons/ic_password.svg";
import Input from '../../components/input.component';
import Button from '../../components/button.component';
import { useNavigation } from 'react-navigation-hooks';
import { getRoutePath, REGISTER_ROUTES } from '../../routing/routes';
import THEME_COLORS from '../../styles/theme.styles';
import { ScrollView } from 'react-native-gesture-handler';
import { RegisterContext, REGISTER_ACTIONS } from '../../contexts/register-user.context';
import { useForm } from 'react-hook-form';

const Container = styled.View`
    background-color: white;
    height: 100%;
    padding: 25px;
    padding-top: 0px;
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
        textAlign: 'center',
    }
});

type RegisterFormData = {
    user: string;
    pwd: string;
    rePwd: string;
};

const RegisterCreateUserPage = () => {
    const navigation = useNavigation();
    const [state, dispatch] = useContext(RegisterContext);
    const { control, register, setValue, setError, getValues, handleSubmit, errors, formState, watch } = useForm<RegisterFormData>()
    const watchForm = watch(); 

    useEffect(() => {
        //TODO create async validator to check if user already exists
        register({ name: 'user' }, { required: true });
        register({ name: 'pwd' }, { required: true });
        register({ name: 'rePwd' }, {
            required: "Debe repetir la una contraseña",
            validate: {
                matchesPreviousPassword: (value: string) => {
                    const { pwd } = getValues();
                    return pwd === value || "La contraseña no coincide";
                }
            }
        });
    }, [register]);

    const onSubmit = (data: RegisterFormData) => {
        dispatch({
            type: REGISTER_ACTIONS.SET_REGISTER_DATA,
            payload: {
                registerData: {
                    username: data.user,
                    password: data.pwd,
                }
            }
        });

        goToRegisterPhone();
        //Alert.alert('Form Data', JSON.stringify(data) + ". Errors:" + JSON.stringify(errors));        
    }

    const goToRegisterPhone = () => {
        navigation.navigate(getRoutePath(REGISTER_ROUTES.RegisterSendCode, REGISTER_ROUTES));
    };


    const errorStyle: { label: string; border: string, text: string } = { label: THEME_COLORS.DANGER, border: THEME_COLORS.DANGER, text: THEME_COLORS.FONT_REGULAR };    

    return (
        <ShowStatusBarLayout>
            <ScrollView keyboardShouldPersistTaps="always">
                <Container>
                    <InfoPanel>
                        <View style={{ flex: 1, justifyContent: "center" }}>
                            <IconMessage icon={<UserLoginIcon />} title="Usuario" text="Escoge un nombre de usuario" iconStyle={{ marginLeft: 35, marginBottom: -10 }} />

                            <View style={{ marginTop: 20, alignItems: "stretch" }}>
                                <Input
                                    text={watchForm.user}
                                    onChangeText={text => setValue('user', text, true)}
                                    label={errors.user ? "Debe ingresar un nombre de usuario" : "Usuario"} colors={errors.user ? errorStyle : undefined} />
                            </View>

                            <IconMessage title="Contraseña" text="Crea tu contraseña" />

                            {/* <Text style={styles.label}>Mínimo 6 caracteres, una mayúscula y un número </Text> */}

                            <View style={{ marginTop: 20, alignItems: "stretch" }}>
                                <Input
                                    text={watchForm.pwd}
                                    label={errors.pwd ? "Debe ingresar una contraseña" : "Contraseña"}
                                    colors={errors.pwd ? errorStyle : undefined}
                                    secureTextEntry={true}
                                    onChangeText={text => setValue('pwd', text, true)}
                                />
                            </View>

                            <View style={{ marginTop: 30, alignItems: "stretch" }}>
                                <Input placeholder="Repetir contraseña"
                                    text={watchForm.rePwd}
                                    label={errors.rePwd ? errors.rePwd?.message : "Contraseña"}
                                    colors={errors.rePwd ? errorStyle : undefined}
                                    secureTextEntry={true}
                                    onChangeText={text => setValue('rePwd', text, true)}
                                />
                            </View>
                        </View>
                    </InfoPanel>
                    <ActionPanel>
                        <View style={{ paddingTop: 20 }}>
                            <Button label="Siguiente" onPress={handleSubmit(onSubmit)} />
                        </View>
                    </ActionPanel>
                </Container>
            </ScrollView>
        </ShowStatusBarLayout>
    );
};

RegisterCreateUserPage.navigationOptions = {
    title: '',
};

export default RegisterCreateUserPage;
