import React from 'react';
import styled from "styled-components/native";
import CheckIcon from "../../assets/icons/ic_check.svg";
import ShowStatusBarLayout from "../../layouts/show-status-bar.layout";
import { View } from "react-native";
import IconMessage from "../../components/icon-message.component";
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import { getRoutePath, APP_ROUTES } from '../../routing/routes';
import Button from '../../components/button.component';
import useChangePwdReset from '../../hooks/use-change-pwd-reset.hook';
import { useForm } from 'react-hook-form';

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

const LoginPasswordResetPage = () => {
    const navigation = useNavigation();

    const goToLoginPage = () => {
        //TODO RESET NAVIGATION TO LOGIN PAGE
        navigation.navigate(getRoutePath(APP_ROUTES.Login));
    };

    return (
        <ShowStatusBarLayout>
            <Container>
                <InfoPanel>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <IconMessage icon={<CheckIcon />} title="¡Contraseña modificada con éxito!" text="Tenés una nueva contraseña" />
                    </View>
                </InfoPanel>
                <ActionPanel>
                    <Button label="Aceptar" onPress={goToLoginPage} />
                </ActionPanel>
            </Container>
        </ShowStatusBarLayout>
    );
};

LoginPasswordResetPage.navigationOptions = {
    title: '',
};

export default LoginPasswordResetPage;
