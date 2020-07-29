import React from 'react';
import { View } from "react-native";
import { useNavigation } from 'react-navigation-hooks';
import styled from "styled-components/native";
import UserScanIcon from "../../assets/icons/ic_user_scan.svg";
import ShowStatusBarLayout from "../../layouts/show-status-bar.layout";
import IconMessage from "../../components/icon-message.component";
import { getRoutePath, BIOMETRIC_REGISTER_ROUTES } from '../../routing/routes';
import Button from '../../components/button.component';
import TextButton from '../../components/text-button.component';
import THEME_COLORS from '../../styles/theme.styles';

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

const BiometricDataRegisterFacePage = () => {
    const navigation = useNavigation();
    
    const goToBiometricDataRegistrationCompletePage = () => {
        navigation.navigate(getRoutePath(BIOMETRIC_REGISTER_ROUTES.BiometricDataRegistrationComplete, BIOMETRIC_REGISTER_ROUTES));
    };

    return (
        <ShowStatusBarLayout>
          <Container>
            <InfoPanel>
                <View style={{flex: 1, justifyContent: "center"}}>
                    <IconMessage icon={<UserScanIcon/>} title="Registro de rostro" text="Tomá una selfie de tu rostro para registrar tus rasgos."/>
                </View>
            </InfoPanel>
            <ActionPanel>
                <Button label="Abrir cámara" onPress={goToBiometricDataRegistrationCompletePage}/>
                <View style={{marginTop: 15}}>
                    <TextButton label="Cancelar" colors={{text: THEME_COLORS.FONT_REGULAR}}/>
                </View>
            </ActionPanel>
          </Container>
        </ShowStatusBarLayout>
    );
};

BiometricDataRegisterFacePage.navigationOptions = {
    title: '',
};

export default BiometricDataRegisterFacePage;
