import React, { useState, useEffect } from 'react';
import styled from "styled-components/native";
import ShowStatusBarLayout from "../../layouts/show-status-bar.layout";
import { View, Modal, Alert, ScrollView, KeyboardAvoidingView, Dimensions, Platform } from "react-native";
import Input from '../../components/input.component';
import Button from '../../components/button.component';
import { useNavigation } from 'react-navigation-hooks';
import { getRoutePath, HOME_ROUTE } from '../../routing/routes';
import THEME_COLORS from '../../styles/theme.styles';
import RadioForm from 'react-native-simple-radio-button';
import Card from '../../components/card-component';
import HelpIcon from '../../assets/icons/ic_help_customer.svg';
import useHelpCustomer from '../../hooks/use-help-customer.hook';

const Container = styled.View`
    background-color: ${THEME_COLORS.BACKGROUND_DARK};
    flex: 1;
    padding: 25px;
    justify-content: center;
    align-items: center;
    margin-top: -40px;
`;

const InfoPanel = styled(Card)`
    position: absolute;
    flex: 1;
    width: 100%;
    flex-grow: 1;    
`;

const ModalCard = styled.View`
  background-color: ${THEME_COLORS.WHITE};
  border-radius: 10px;
  padding-top: 53px;
  padding-bottom: 30px;
  padding-left: 50px;
  padding-right: 50px;
  margin-top: 80px;
  margin-left: 25px;
  margin-right: 25px;
  align-items: stretch;
`;

const ModalText = styled.Text`
  color: ${THEME_COLORS.FONT_NORMAL};
  font-family: LibreFranklin-Regular;
  font-size: 18px;
  align-self: center;
  text-align: center;
  margin-bottom: 50px;
`;

const Text = styled.Text`
  color: ${THEME_COLORS.FONT_NORMAL};
  font-family: LibreFranklin-Regular;
  font-size: 14px;  
  margin-top:15px;
  line-height: 20px;
`;


const radio_props = [
    { label: 'E-mail', value: 'email' },
    { label: 'Teléfono', value: 'phone' }
];

const screenHeight = Math.round(Dimensions.get('window').height) - 30;

const HelpPage = () => {
    const navigation = useNavigation();
    const [asunto, setAsunto] = useState('');
    const [message, setMessage] = useState('');
    const [contactOption, setContactOption] = useState('');
    const [showModal, setShowModal] = useState(false);
    const { result, loading, error, executeSendHelpQuery } = useHelpCustomer();

    const sendConsulta = () => {
        executeSendHelpQuery({ contactType: contactOption, message: message });
    }

    useEffect(() => {
        if (result === true) {
            setShowModal(true);
        }
        if (result === false) {
            Alert.alert("Error", "No se puedo enviar la consulta. Intente nuevamente mas tarde.")
        }

    }, [result])

    const goHome = () => {
        navigation.navigate(getRoutePath(HOME_ROUTE.Home, HOME_ROUTE));
    }

    return (
        <ShowStatusBarLayout>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : undefined}>
                <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={{ height: screenHeight }} >
                    <Container>
                        <InfoPanel>
                            <View style={{ alignItems: "center", marginVertical: 10 }}>
                                <HelpIcon />
                            </View>


                            <Text>Si tenes alguna sugerencia, duda o consulta acerca de Fillsmart, por favor dejanos tus comentarios y un ejectutivo se pondrá en contacto lo antes posible.</Text>


                            <View style={{ marginTop: 20, alignItems: "stretch" }}>
                                <Input
                                    label="Mensaje"
                                    text={message}
                                    onChangeText={(text) => setMessage(text)}
                                    multiline={true}
                                    numberOfLines={8}
                                    style={{ height: 200 }}
                                />
                            </View>


                            <Text>Selecciona como queres que nos comuniquemos con vos</Text>


                            <View style={{ marginTop: 15 }}>
                                <RadioForm
                                    radio_props={radio_props}
                                    initial={0}
                                    buttonColor={THEME_COLORS.PRIMARY}
                                    labelColor={THEME_COLORS.FONT_REGULAR}
                                    onPress={(value: string) => { setContactOption(value) }}
                                />
                            </View>

                            <Button label="Enviar" onPress={sendConsulta} style={{ marginTop: 20 }} loading={loading} />

                        </InfoPanel>
                        <Modal animationType="none" transparent={true} visible={showModal} onRequestClose={goHome}>
                            <View
                                style={{
                                    flex: 1,
                                    backgroundColor: 'rgba(72, 137, 255, 0.5)',
                                }}>
                                <ModalCard>
                                    <ModalText>
                                        <Text>Se ha enviado su consulta, en breve nos estaremos comunicando con Usted. </Text>
                                    </ModalText>
                                    <Button label="Continuar" onPress={goHome} />
                                </ModalCard>
                            </View>
                        </Modal>
                    </Container>
                </ScrollView>
            </KeyboardAvoidingView>
        </ShowStatusBarLayout >
    );
}

HelpPage.navigationOptions = {
    title: 'Ayuda',
};

export default HelpPage;

