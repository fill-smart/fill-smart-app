import React, { useState, useContext, useEffect, useRef } from 'react';
import styled from "styled-components/native";
import ShowStatusBarLayout from "../../layouts/show-status-bar.layout";
import { View, Alert, Dimensions, ScrollView, Text, KeyboardAvoidingView, Platform, Modal } from "react-native";
import IconMessage from "../../components/icon-message.component";
import ComputerIcon from "../../assets/icons/ic_computer.svg";
import CrossedEyeIcon from '../../assets/icons/ic_password_disabled.svg';
import EyeIcon from '../../assets/icons/ic_password.svg';
import Input from '../../components/input.component';
import Button from '../../components/button.component';
import { useNavigation } from 'react-navigation-hooks';
import { getRoutePath, REGISTER_ROUTES, DIRECT_ROUTES } from '../../routing/routes';
import { RegisterContext, REGISTER_ACTIONS } from '../../contexts/register-user.context';
import THEME_COLORS from '../../styles/theme.styles';
import useRegistration from '../../hooks/use-register-user.hook';
import { useForm } from 'react-hook-form';
import LottieView from 'lottie-react-native';
import { emailExists } from '../../hooks/use-validate-customer-email.hook';
import { StackNavigationProp } from 'react-navigation-stack/lib/typescript/src/vendor/types';
import { NavigationActions } from 'react-navigation';
import TextButton from '../../components/text-button.component';
import useTermsConditions from '../../hooks/use-terms-conditions.hook';
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

const LottieWrapper = styled.View`
  width: 48px;
  height: 48px;
`;

const ModalCard = styled.View`
  background-color: ${THEME_COLORS.WHITE};
  border-radius: 10px;
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: 16px;
  padding-right: 16px;  
  align-items: stretch;
  margin:16px;
  height: 95%;  
`;

const ModalTitleText = styled.Text`
  color: ${THEME_COLORS.FONT_NORMAL};
  font-family: LibreFranklin-Regular;    
  margin-bottom: 10px;  
  font-size: 18px;
`;

const ModalText = styled.Text`
  color: ${THEME_COLORS.FONT_NORMAL};
  font-family: LibreFranklin-Regular;    
  margin-bottom: 20px;  
`;


type RegisterFormData = {
    email: string;
    pwd: string;
    rePwd: string;
};

const errorStyle: { label: string; border: string, text: string } = { label: THEME_COLORS.DANGER, border: THEME_COLORS.DANGER, text: THEME_COLORS.FONT_REGULAR };
const screenHeight = Math.round(Dimensions.get('window').height) - 30;


const RegisterEnterEmailPage = () => {
    const navigation = useNavigation() as StackNavigationProp;
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [isPasswordHidden, setIsPasswordHidden] = useState(true);
    const [isRePasswordHidden, setIsRePasswordHidden] = useState(true);
    const [state, dispatch] = useContext(RegisterContext);
    const { customer, loading, error, executeRegister } = useRegistration();
    const { terms, loading: loadingTerms, error: errorTerms } = useTermsConditions();
    const { register, setValue, setError, getValues, handleSubmit, errors, watch } = useForm<RegisterFormData>()
    const watchForm = watch();

    const inputPwd: any = useRef();
    const inputRePwd: any = useRef();

    const PasswordToggleIcon = isPasswordHidden ? <EyeIcon /> : <CrossedEyeIcon />;
    const RePasswordToggleIcon = isRePasswordHidden ? <EyeIcon /> : <CrossedEyeIcon />;

    useEffect(() => {
        register({ name: 'email' }, {
            required: "Ingrese un email",
            pattern: {
                value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                message: 'Ingrese un email válido'
            }
        });
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
            console.log(error);
            crashlytics().log('Error en el registro de usuario.' + error);
            crashlytics().recordError(error);
            Alert.alert('Error de Registro', "Ocurrió un error al registrar al usuario");
            return;
        }
        if (customer) {
            goToRegisterActivateAccountPage();
        }
    }, [customer, error])

    useEffect(() => {
        if (state.username) {
            executeRegister();
        }
    }, [state.username])

    const onSubmit = async (data: RegisterFormData) => {
        try {
            const existsEmail = await emailExists(data.email);
            if (existsEmail) {
                setError("email", '', 'La cuenta de email ya se encuentra registrada');
                return;
            }

            dispatch({
                type: REGISTER_ACTIONS.SET_REGISTER_DATA,
                payload: {
                    registerData: {
                        username: data.email,
                        password: data.pwd,
                    }
                }
            });
        }
        catch (error) {
            crashlytics().recordError(error);
            console.log("Error on submit", error);
            Alert.alert('Error', "Ocurrió un error al registrar el email del usuario");
        }

        //Alert.alert('Form Data', JSON.stringify(data) + ". Errors:" + JSON.stringify(errors));        
    }

    const goToRegisterActivateAccountPage = () => {
        dispatch({ type: REGISTER_ACTIONS.CLEAN_STORE });
        navigation.reset([
            NavigationActions.navigate({ routeName: getRoutePath(DIRECT_ROUTES.Welcome, DIRECT_ROUTES) }),
            NavigationActions.navigate({ routeName: getRoutePath(REGISTER_ROUTES.RegisterEnterCode, REGISTER_ROUTES) })
        ], 1);
        //navigation.navigate(getRoutePath(REGISTER_ROUTES.RegisterRegistrationComplete, REGISTER_ROUTES));
    };



    return (
        <ShowStatusBarLayout>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : undefined}>
                <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={{ height: screenHeight }} >

                    <Container>
                        <InfoPanel>
                            <View style={{ flex: 1, justifyContent: "center" }}>
                                <IconMessage icon={<ComputerIcon />} title="Email" text="Ingresá tu email, el mismo servirá luego para ingresar a la aplicación" />
                                <View style={{ marginTop: 20, alignItems: "stretch" }}>
                                    <Input
                                        returnKeyType="done"
                                        onSubmitEditing={() => { inputPwd?.current?.focus(); }}
                                        text={watchForm.email}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        onChangeText={text => setValue('email', text, true)}
                                        label={errors.email ? errors.email.message : "Email"}
                                        colors={errors.email ? errorStyle : undefined} />
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

                                <View style={{ marginTop: 30, alignItems: "stretch" }}>
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

                                <View style={{ marginTop: 20 }}>
                                    <TextButton label="Al crear su cuenta confirma estar de acuerdo con los términos de uso de FillSmart" onPress={() => setIsModalVisible(true)}></TextButton>
                                </View>
                            </View>

                            <Button label="Siguiente" onPress={handleSubmit(onSubmit)} style={{ marginTop: 20 }} loading={loading} />
                        </InfoPanel>

                        <Modal animationType="none" transparent={true} visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)}>
                            <View
                                style={{
                                    flex: 1,
                                    backgroundColor: 'rgba(72, 137, 255, 0.5)',
                                }}>
                                <ModalCard>
                                    <ScrollView>
                                        <ModalTitleText>Términos y condiciones</ModalTitleText>
                                        <ModalText>
                                            {terms}
                                        </ModalText>

                                    </ScrollView>
                                    <Button style={{ marginTop: 20 }} label="Aceptar" onPress={() => setIsModalVisible(false)} />
                                </ModalCard>
                            </View>
                        </Modal>

                    </Container>
                </ScrollView>
            </KeyboardAvoidingView>
        </ShowStatusBarLayout>
    );
};

RegisterEnterEmailPage.navigationOptions = {
    title: '',
};


export default RegisterEnterEmailPage;
