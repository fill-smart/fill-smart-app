import React from 'react';
import styled from "styled-components/native";
import FingerprintIcon from "../../assets/icons/ic_fingerprint.svg";
import ShowStatusBarLayout from "../../layouts/show-status-bar.layout";
import { View } from "react-native";
import IconMessage from "../../components/icon-message.component";
import { useNavigation } from 'react-navigation-hooks';
import { getRoutePath, BIOMETRIC_REGISTER_ROUTES } from '../../routing/routes';
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

const BiometricDataRegisterPage = () => {
    const navigation = useNavigation();
    
    const goToBiometricDataRegisterFingerprintPage = () => {
        navigation.navigate(getRoutePath(BIOMETRIC_REGISTER_ROUTES.BiometricDataRegisterFingerprint, BIOMETRIC_REGISTER_ROUTES));
    };

    return (
        <ShowStatusBarLayout>
          <Container>
            <InfoPanel>
                <View style={{flex: 1, justifyContent: "center"}}>
                    <IconMessage icon={<FingerprintIcon/>} title="Registro de datos biométricos" text="Vamos a asociar tu clave de acceso con tu huella digital y rostro para que a partir de ahora, con un simple toque, puedas ingresar a Fill Smart"/>
                </View>
            </InfoPanel>
            <ActionPanel>
                <Button label="Siguiente" onPress={goToBiometricDataRegisterFingerprintPage}/>
            </ActionPanel>
          </Container>
        </ShowStatusBarLayout>
    );
};

BiometricDataRegisterPage.navigationOptions = {
    title: '',
};

export default BiometricDataRegisterPage;
