import React from 'react';
import styled from "styled-components/native";
import CheckIcon from "../../assets/icons/ic_check.svg";
import ShowStatusBarLayout from "../../layouts/show-status-bar.layout";
import { View, Text, StyleSheet } from "react-native";
import IconMessage from "../../components/icon-message.component";
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

const RegisterAccountActivatedPage = () => {
    const navigation = useNavigation();
    
    const goToRegisterCreateUserPage = () => {
        navigation.navigate(getRoutePath(REGISTER_ROUTES.RegisterCreateUser, REGISTER_ROUTES));
    };

    return (
        <ShowStatusBarLayout>
          <Container>
            <InfoPanel>
                <View style={{flex: 1, justifyContent: "center"}}>
                    <IconMessage icon={<CheckIcon/>} title="¡Cuenta activada!" text="Tu cuenta fue activada con éxito"/>
                    <Text style={styles.label}>Puedes continuar con el registro</Text>
                </View>
            </InfoPanel>
            <ActionPanel>
                <Button label="Continuar con registro" onPress={goToRegisterCreateUserPage}/>
            </ActionPanel>
          </Container>
        </ShowStatusBarLayout>
    );
};

RegisterAccountActivatedPage.navigationOptions = {
    title: '',
};

export default RegisterAccountActivatedPage;
