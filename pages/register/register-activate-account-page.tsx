import React from 'react';
import styled from "styled-components/native";
import ShowStatusBarLayout from "../../layouts/show-status-bar.layout";
import { View, Text, StyleSheet } from "react-native";
import IconMessage from "../../components/icon-message.component";
import ComputerOkIcon from "../../assets/icons/ic_computer_ok.svg";
import TextButton from '../../components/text-button.component';
import { useNavigation } from 'react-navigation-hooks';
import { getRoutePath, REGISTER_ROUTES } from '../../routing/routes';
import THEME_COLORS from '../../styles/theme.styles';
import Button from '../../components/button.component';

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
        textAlign: 'center',
    }
});

const RegisterActivateAccountPage = () => {
    const navigation = useNavigation();
    
    const goToRegisterAccountActivatedPage = () => {
        //navigation.navigate(getRoutePath(REGISTER_ROUTES.RegisterAccountActivated, REGISTER_ROUTES));
    };

    return (
        <ShowStatusBarLayout>
          <Container>
            <InfoPanel>
                <View style={{flex: 1, justifyContent: "center"}}>
                    <IconMessage icon={<ComputerOkIcon/>} title="Activar cuenta" text="Te enviamos un correo electrónico"/>
                    <Text style={styles.label}>Ingresá a tu email para activar la cuenta</Text>
                </View>
            </InfoPanel>
            <ActionPanel>
                <Button label="Abrir email" onPress={goToRegisterAccountActivatedPage}/>
                <View style={{marginTop: 15}}>
                    <TextButton label="Reenviar email"/>
                </View>
            </ActionPanel>
          </Container>
        </ShowStatusBarLayout>
    );
};

RegisterActivateAccountPage.navigationOptions = {
    title: '',
};

export default RegisterActivateAccountPage;
