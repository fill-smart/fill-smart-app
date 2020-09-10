import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, View, KeyboardAvoidingView, Platform } from "react-native";
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationActions, StackActions } from 'react-navigation';
import { useNavigation } from 'react-navigation-hooks';
import { StackNavigationProp } from 'react-navigation-stack/lib/typescript/src/vendor/types';
import styled from "styled-components/native";
import PhoneCodeIcon from "../../assets/icons/ic_phone_code.svg";
import Button from '../../components/button.component';
import IconMessage from "../../components/icon-message.component";
import Input from '../../components/input.component';
import Loader from '../../components/loader.component';
import useChangePassword from '../../hooks/use-change-password.hook';
import ShowStatusBarLayout from "../../layouts/show-status-bar.layout";
import { getRoutePath, PROFILE_ROUTES, APP_ROUTES } from '../../routing/routes';
import THEME_COLORS from '../../styles/theme.styles';
import EyeIcon from '../../assets/icons/ic_password.svg';
import CrossedEyeIcon from '../../assets/icons/ic_password_disabled.svg';


const Container = styled.View`
    flex: 1;
    background-color: white;
    padding: 25px;
    padding-top: 0px;
    justify-content: center;
    align-items: stretch;
    flex-grow: 1;
    width: 100%;
`;

const Header = styled.View`
    margin-top: 20px;
    margin-bottom: 50px;
    background-color: white;
`;

const ActionPanel = styled.View`
    width: 100%;
    background-color: white;
    padding: 25px;
`;

const SubtitleText = styled.Text`
    font-size: 14px;
    font-family: LibreFranklin-Regular;
    color: ${THEME_COLORS.FONT_NORMAL};
    text-align: center;
`;


type ChangePasswordFormData = {
    currentPassword: string;
    newPassword: string;
    reNewPassword: string;
};

const ChangePasswordPage = () => {
    const navigation = useNavigation() as StackNavigationProp;
    const { isSuccess, error, executeChangePassword } = useChangePassword();
    const { control, register, setValue, setError, getValues, handleSubmit, errors, formState, watch } = useForm<ChangePasswordFormData>()
    const watchForm = watch(); 
    const [isPasswordHidden, setIsPasswordHidden] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const PasswordToggleIcon = isPasswordHidden ? <EyeIcon /> : <CrossedEyeIcon />;
    const newPassword: any = useRef();
    const reNewPassword: any = useRef();

    useEffect(() => {
        register({ name: 'currentPassword' }, { 
            required: true,
        });
        register({ name: 'newPassword' }, { 
            required: "Ingrese una contraseña",
            pattern: {
                value: /^(?=.*\d)(?=.*[A-Z]).{6,}$/,
                message: 'Ingrese una contraseña válida'
            }
        });
        register({ name: 'reNewPassword' }, {
            required: "Debe repetir la contraseña",
            validate: {
                matchesPreviousPassword: (value: string) => {
                    const { newPassword } = getValues();
                    return newPassword === value || "La contraseña no coincide";
                }
            }
        });
    }, [register]);

    useEffect(() => {
        if (isSuccess){
            setIsLoading(false);
            goToChangePasswordComplete();
        }
    }, [isSuccess]);

    useEffect(() => {
        if (error){
            setIsLoading(false);
            Alert.alert("Ocurrió un error inesperado. Por favor intentá de nuevo.");
        }
    }, [error]);

    const goToChangePasswordComplete = () => {
        navigation.reset([
            NavigationActions.navigate({ routeName: getRoutePath(PROFILE_ROUTES.Profile, PROFILE_ROUTES) }),
            NavigationActions.navigate({ routeName: getRoutePath(PROFILE_ROUTES.ChangePasswordComplete, PROFILE_ROUTES) })
        ], 1);
    };

    const onSubmit = (data: ChangePasswordFormData) => {
        setIsLoading(true);
        executeChangePassword(data.currentPassword, data.newPassword);
    }

    const errorStyle: { label: string; border: string, text: string } = { label: THEME_COLORS.DANGER, border: THEME_COLORS.DANGER, text: THEME_COLORS.FONT_REGULAR };    

    return (
        <ShowStatusBarLayout>
            <ScrollView keyboardShouldPersistTaps="always" style={{backgroundColor: "white"}}>
                <Container>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "stretch" }}>
                        <Header>
                            <IconMessage icon={<PhoneCodeIcon />} title="Establecer una nueva contraseña" text="Crea una nueva contraseña" iconStyle={{ marginLeft: 35 }}/>
                            <SubtitleText>Mínimo 6 caracteres, una mayúscula y un número</SubtitleText>
                        </Header>
                        <View>
                            <Input
                                label={errors.currentPassword ? "Debe ingresar la contraseña actual" : "Contraseña actual"}
                                colors={errors.currentPassword ? errorStyle : undefined}
                                secureTextEntry={isPasswordHidden}
                                onChangeText={text => setValue('currentPassword', text, false)}
                                onIconPress={() => setIsPasswordHidden(!isPasswordHidden)}
                                icon={PasswordToggleIcon}
                                onSubmitEditing={() => newPassword?.current?.focus()}
                                returnKeyType="next"
                            />

                            <View style={{ marginTop: 30 }}>
                                <Input
                                    ref={newPassword}
                                    label={errors.newPassword ? errors.newPassword.message : "Nueva contraseña"}
                                    colors={errors.newPassword ? errorStyle : undefined}
                                    secureTextEntry={isPasswordHidden}
                                    onChangeText={text => setValue('newPassword', text, false)}
                                    onIconPress={() => setIsPasswordHidden(!isPasswordHidden)}
                                    icon={PasswordToggleIcon}
                                    onSubmitEditing={() => reNewPassword?.current?.focus()}
                                    returnKeyType="next"
                                />
                            </View>

                            <View style={{ marginTop: 30 }}>
                                <Input placeholder="Repetir nueva contraseña"
                                    ref={reNewPassword}
                                    label={errors.reNewPassword ? errors.reNewPassword?.message : undefined}
                                    colors={errors.reNewPassword ? errorStyle : undefined}
                                    secureTextEntry={isPasswordHidden}
                                    onChangeText={text => setValue('reNewPassword', text, false)}
                                    onIconPress={() => setIsPasswordHidden(!isPasswordHidden)}
                                    icon={PasswordToggleIcon}
                                    onSubmitEditing={handleSubmit(onSubmit)}
                                    returnKeyType="done"
                                />
                            </View>
                        </View>
                    </View>
                </Container>
            </ScrollView>
            <ActionPanel>
                <Button label="Siguiente" onPress={handleSubmit(onSubmit)} loading={isLoading}/>
            </ActionPanel>
        </ShowStatusBarLayout>
    );
};

ChangePasswordPage.navigationOptions = {
    title: '',
};

export default ChangePasswordPage;
