import React, { useState } from 'react';
import { View, Alert, Text, StyleSheet, ScrollView } from 'react-native';
import Input from '../../components/input.component';
import Button from '../../components/button.component';
import { useForm } from 'react-hook-form';
import styled from 'styled-components/native';
import THEME_COLORS from '../../styles/theme.styles';
import { useNavigation } from 'react-navigation-hooks';
import ShowStatusBarLayout from '../../layouts/show-status-bar.layout';
import IconMessage from '../../components/icon-message.component';
import UserLoginIcon from "../../assets/icons/ic_user_login.svg";

const Container = styled.View`
    background-color: white;
    flex: 1;
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

const ActionPanel = styled.View`
    width: 100%;
    height: 100px;
    flex-direction: column-reverse;
    justify-content: flex-start;
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
    identityNumber: number;
    birthDate: Date;
};

const errorStyle: { label: string; border: string } = { label: THEME_COLORS.DANGER, border: THEME_COLORS.DANGER };

const TestForm = () => {
    console.log("Render test");
    const navigation = useNavigation();
    const { control, register, setValue, handleSubmit, errors, formState } = useForm<RegisterFormData>();

    const onSubmit = (data: RegisterFormData) => {
        console.log("onSubmit entered");
        Alert.alert('Form Data', JSON.stringify(data) + ". Errors:" + JSON.stringify(errors));
    }

    React.useEffect(() => {
        register({ name: 'firstName' }, { required: true });
    }, [register])

    return (
        <ShowStatusBarLayout>
            



                <Input
                    onChangeText={text => setValue('firstName', text, true)}
                    label="Nombre" colors={errors.firstName ? errorStyle : undefined} />
                {errors.firstName && <Text>FisrtName This is required.</Text>}






                <Button label="Siguiente" onPress={handleSubmit(onSubmit)} />
            
        </ShowStatusBarLayout >











    );
}

export default TestForm