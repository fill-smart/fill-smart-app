import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import IconMessage from '../../components/icon-message.component';
import Button from '../../components/button.component';
import DniIcon from '../../assets/icons/ic_dni.svg';
import THEME_COLORS from '../../styles/theme.styles';
import ShowStatusBarLayout from '../../layouts/show-status-bar.layout';
import styled from 'styled-components/native';
import { getRoutePath, REGISTER_ROUTES } from '../../routing/routes';
import { useNavigation } from 'react-navigation-hooks';

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
        fontSize: 16,
        fontFamily: 'LibreFranklin-Regular',
        color: THEME_COLORS.FONT_REGULAR,
        marginBottom: 4
    },
    value: {
        fontSize: 14,
        fontFamily: 'LibreFranklin-Regular',
        color: THEME_COLORS.FONT_NORMAL,
        marginBottom: 16
    }
});

export const RegisterDniData = () => {
    const navigation = useNavigation();

    const goToRegisterSendCodePage = () => {
        navigation.navigate(getRoutePath(REGISTER_ROUTES.RegisterSendCode, REGISTER_ROUTES));
    }

    return (

        <ShowStatusBarLayout>
            <Container>
                <InfoPanel>
                    <View style={{ flex: 1, justifyContent: "center" }}>
                        <View style={{
                            flex: 1,
                            width: '100%',
                            justifyContent: "center"
                        }}>
                            <IconMessage icon={<DniIcon />} title="" text=""></IconMessage>
                        </View>

                        <View style={{
                            flex: 2,
                            justifyContent: 'flex-start',
                            marginLeft: 60
                        }}>
                            <Text style={styles.label}>Nombre</Text>
                            <Text style={styles.value}>Juan José</Text>
                            <Text style={styles.label}>Apellidos</Text>
                            <Text style={styles.value}>Ceballos</Text>
                            <Text style={styles.label}>DNI</Text>
                            <Text style={styles.value}>3255478</Text>
                            <Text style={styles.label}>Fecha de Nacimiento</Text>
                            <Text style={styles.value}>11 de Novimebre de 1986</Text>

                        </View>
                    </View>
                </InfoPanel>
                <ActionPanel>

                    <View style={{ width: '100%', justifyContent: 'flex-start', paddingLeft: 16, paddingRight: 16 }}>
                        <Button label="Siguiente" onPress={goToRegisterSendCodePage}></Button>
                    </View>

                </ActionPanel>
            </Container>







        </ShowStatusBarLayout>
    );
};

RegisterDniData.navigationOptions = {
    title: '',
};

export default RegisterDniData;
