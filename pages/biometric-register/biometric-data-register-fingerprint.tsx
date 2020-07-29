import React from 'react';
import styled from "styled-components/native";
import ShowStatusBarLayout from "../../layouts/show-status-bar.layout";
import { View, Text, StyleSheet } from "react-native";
import IconMessage from "../../components/icon-message.component";
import FingerprintIcon from "../../assets/icons/ic_fingerprint.svg";
import TextButton from '../../components/text-button.component';
import { useNavigation } from 'react-navigation-hooks';
import { getRoutePath, BIOMETRIC_REGISTER_ROUTES } from '../../routing/routes';
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

const styles = StyleSheet.create({
    label: {
        fontSize: 14,
        fontFamily: 'LibreFranklin-Regular',
        color: THEME_COLORS.FONT_NORMAL,        
        textAlign: 'center',
    }
});

const BiometricDataRegisterFingerprintPage = () => {
    const navigation = useNavigation();
    
    const goToBiometricDataRegisterFacePage = () => {
        navigation.navigate(getRoutePath(BIOMETRIC_REGISTER_ROUTES.BiometricDataRegisterFace, BIOMETRIC_REGISTER_ROUTES));
    };

    return (
        <ShowStatusBarLayout>
          <Container>
            <InfoPanel>
                <View style={{flex: 1, justifyContent: "center"}}>
                    <IconMessage icon={<FingerprintIcon/>} title="Registro de huella" text="Apoyá tu dedo en el lector de huellas sin presionarlo."/>
                    <Text style={styles.label}>
                        {"\n"}
                        La huella ingresada debe coincidir con la que registraste para desbloquear el dispositivo.
                        {"\n\n"}
                        Recordá que si tenés otras huellas registradas en tu celular, las mismas podrán usarse para acceder a la app.
                    </Text>
                </View>
            </InfoPanel>
            <ActionPanel style={{justifyContent: "center"}}>
                <View>
                    <TextButton label="Cancelar" colors={{text: THEME_COLORS.FONT_REGULAR}} onPress={goToBiometricDataRegisterFacePage}/>
                </View>
            </ActionPanel>
          </Container>
        </ShowStatusBarLayout>
    );
};

BiometricDataRegisterFingerprintPage.navigationOptions = {
    title: '',
};

export default BiometricDataRegisterFingerprintPage;
