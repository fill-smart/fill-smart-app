import React from 'react';
import styled from "styled-components/native";
import NoSignalIcon from "../assets/icons/ic_no_signal.svg";
import ShowStatusBarLayout from "../layouts/show-status-bar.layout";
import { View, Text, StyleSheet } from "react-native";
import IconMessage from "../components/icon-message.component";
import THEME_COLORS from '../styles/theme.styles';
import Button from '../components/button.component';
import { useNavigation } from 'react-navigation-hooks';
import { APP_ROUTES, getRoutePath } from '../routing/routes';

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

const NoConnectionPage = () => {   
    const navigation = useNavigation();

    const goHome = () => {
        navigation.navigate(getRoutePath(APP_ROUTES.Main, APP_ROUTES));
    }

    return (
        <ShowStatusBarLayout>
          <Container>
            <InfoPanel>
                <View style={{flex: 1, justifyContent: "center"}}>
                    <IconMessage icon={<NoSignalIcon/>} title={"Tu dispositivo no esta conectado"} text={"Por favor revisa si tenes conexión a través de redes móviles o wifi"}/>
                </View>
            </InfoPanel>
            <ActionPanel>
                <Button label={"Aceptar"} onPress={goHome}/>
            </ActionPanel>
          </Container>
        </ShowStatusBarLayout>
    );
};

export default NoConnectionPage;
