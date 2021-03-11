import React, { useEffect, useRef, useContext, useState } from 'react';
import styled from "styled-components/native";
import ShowStatusBarLayout from "../../layouts/show-status-bar.layout";
import { View, StyleSheet, Alert, Dimensions, KeyboardAvoidingView, Platform, Image } from "react-native";
import IconMessage from "../../components/icon-message.component";
import ProfileDefaultIcon from '../../assets/icons/ic_profile_default.svg';
import Input from '../../components/input.component';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import THEME_COLORS from '../../styles/theme.styles';
import { ScrollView } from 'react-native-gesture-handler';
import { useForm } from 'react-hook-form'
import Button from '../../components/button.component';
import moment from 'moment';
import useEditProfile, { IEditProfileRequest } from '../../hooks/use-edit-profile.hook';
import useProfile, { IProfileResult, ProfileRecord } from '../../hooks/use-profile';
import { SecurityContext } from '../../contexts/security.context';
import crashlytics from '@react-native-firebase/crashlytics';
import Loader from '../../components/loader.component';
import { ApolloQueryResult } from 'apollo-boost';


const Container = styled.View`
    background-color: white; 
    height: 100%;
    padding: 25px;    
    padding-top: 0px;
    padding-bottom: 10px;
    justify-content: center;
    align-items: center;
`;

const InfoPanel = styled.View`
    flex: 1;
    width: 100%;    
`;

const FormView = styled.View`
    flex: 1;
    justify-content: center;
`;

const ProfileEditDataPage = () => {
    const navigation = useNavigation();
    const profileHook = useProfile();
    const profile = useNavigationParam("profile") ?? profileHook.profile;
    const refetch: (variables?: Record<string, any> | undefined) => Promise<ApolloQueryResult<IProfileResult>> = useNavigationParam("refetch") ?? profileHook.refetch;
    const [securityCtx] = useContext(SecurityContext);
    const editProfile = useEditProfile();
    const { control, register, setValue, setError, handleSubmit, errors, formState, watch, getValues } = useForm<IEditProfileRequest>()
    const surname: any = useRef();
    const documentNumber: any = useRef();
    const cbu: any = useRef();
    const cbuAlias: any = useRef();
    const mercadopagoAccount: any = useRef();

    useEffect(() => {
        if (profile){
            register({ name: 'firstName', value: profile?.customer.firstName }, { required: true });
            register({ name: 'lastName', value: profile?.customer.lastName }, { required: true });
            register({ name: 'cbu', value: profile?.customer.cbu });
            register({ name: 'cbuAlias', value: profile?.customer.cbuAlias });
            register({ name: 'mercadopagoAccount', value: profile?.customer.mercadopagoAccount });
            register({ name: 'birthDate', value: moment('01/01/1986').toDate() }, { required: true });
        }
    }, [profile]);

    const onSubmit = async (data: IEditProfileRequest) => {
        try {
            editProfile.executeEditProfile(data);
            await refetch().then((result) => {goBack()});
        }
        catch (error) {
            crashlytics().recordError(error);
            Alert.alert('Error', "Ocurrió un error al registrar los datos del usuario", error);
        }
    }

    const goBack = () => {
        navigation.goBack();
    };

    const errorStyle: { label: string; border: string, text: string } = { label: THEME_COLORS.DANGER, border: THEME_COLORS.DANGER, text: THEME_COLORS.FONT_REGULAR };

    if (profileHook.loading) {
        return <Loader />
    }

    return (
        <>
        <ShowStatusBarLayout>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : undefined}>
                <ScrollView keyboardShouldPersistTaps="always">
                    <Container>
                        <InfoPanel>
                            <FormView>
                                <IconMessage icon={profile?.customer.profileImage ?
                                    <Image style={{ width: 150, height: 150, borderRadius: 150 / 2 }} source={{
                                        uri: `data:image/png;base64,${securityCtx.user?.customer.profileImage}`,
                                    }} />
                                    : <ProfileDefaultIcon width={150} height={150} />
                                }
                                />
                                <View style={{ marginTop: 20 }}>
                                    <Input
                                        defaultValue={profile?.customer.firstName}
                                        returnKeyType="done"
                                        onSubmitEditing={() => surname?.current?.focus()}
                                        onChangeText={text => setValue('firstName', text, true)}
                                        label={errors.firstName ? "Debe ingresar su nombre" : "Nombre"}
                                        colors={errors.firstName ? errorStyle : undefined} />
                                </View>

                                <View style={{ marginTop: 20 }}>
                                    <Input
                                        ref={surname}
                                        defaultValue={profile?.customer.lastName}
                                        returnKeyType="done"
                                        onSubmitEditing={() => cbu?.current?.focus()}
                                        onChangeText={text => setValue('lastName', text, true)}
                                        label={errors.lastName ? "Debe ingresar su apellido" : "Apellido"}
                                        colors={errors.lastName ? errorStyle : undefined} />
                                </View>

                                <View style={{ marginTop: 20 }}>
                                    <Input
                                        ref={cbu}
                                        defaultValue={profile?.customer.cbu}
                                        returnKeyType="done"
                                        onSubmitEditing={() => cbuAlias?.current?.focus()}
                                        onChangeText={text => setValue('cbu', text, true)}
                                        label={"CBU"}
                                    />
                                </View>

                                <View style={{ marginTop: 20 }}>
                                    <Input
                                        ref={cbuAlias}
                                        defaultValue={profile?.customer.cbuAlias}
                                        returnKeyType="done"
                                        onSubmitEditing={() => mercadopagoAccount?.current?.focus()}
                                        onChangeText={text => setValue('cbuAlias', text, true)}
                                        label={"Alias"}
                                    />
                                </View>

                                <View style={{ marginTop: 20 }}>
                                    <Input
                                        ref={mercadopagoAccount}
                                        defaultValue={profile?.customer.mercadopagoAccount}
                                        returnKeyType="done"
                                        onSubmitEditing={handleSubmit(onSubmit)}
                                        onChangeText={text => setValue('mercadopagoAccount', text, true)}
                                        label={"Email de Mercado Pago"}
                                    />
                                </View>

                                <View style={{ marginTop: 20 }}>
                                    <Input editable={false} label={"Fecha de nacimiento"} text="01/01/1986" />
                                </View>
                            </FormView>
                        </InfoPanel>
                    </Container>
                </ScrollView>
            </KeyboardAvoidingView>
        </ShowStatusBarLayout >
        <Button label="Confirmar" onPress={handleSubmit(onSubmit)} style={{ borderRadius: 0, height: 45, marginHorizontal: -25 }} loading={editProfile.loading} />
        </>
    );
};

ProfileEditDataPage.navigationOptions = {
    title: '',
};

export default ProfileEditDataPage;
