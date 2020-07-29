import React, {useContext} from 'react';
import {View, Text, StyleSheet, Image, Platform} from 'react-native';
import styled from 'styled-components/native';
import IconMessage from '../../components/icon-message.component';
import Button from '../../components/button.component';
import DniScanIcon from '../../assets/icons/ic_dni_selected.svg';
import THEME_COLORS from '../../styles/theme.styles';
import ButtonOutline from '../../components/button-outline.component';
import ShowStatusBarLayout from '../../layouts/show-status-bar.layout';
import {getRoutePath, REGISTER_ROUTES} from '../../routing/routes';
import {useNavigation, useNavigationParam} from 'react-navigation-hooks';
import {RegisterContext} from '../../contexts/register-user.context';

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

const DniContainer = styled.View`
  border: 1px solid ${THEME_COLORS.PRIMARY};
  border-radius: 5px;
  width: 240px;
  height: 140px;
  margin-bottom: 20px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const styles = StyleSheet.create({
  photoLabel: {
    color: THEME_COLORS.FONT_NORMAL,
    fontSize: 12,
    fontFamily: 'LibreFranklin-Regular',
  },
});

const RegisterDniScanConfirmPage = () => {
  const navigation = useNavigation();
  const imageType: 'FRONT' | 'BACK' = useNavigationParam('type');
  const [context, _] = useContext(RegisterContext);

  const goToRegisterDniScanPage = () => {
    navigation.goBack('RegisterDniScan');
  };
  return (
    <ShowStatusBarLayout>
      <Container>
        <InfoPanel>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <View style={{flex: 1, justifyContent: 'center'}}>
              <IconMessage
                icon={<DniScanIcon />}
                title="Confirma la foto"
                text="Revisa que la foto sea válida"></IconMessage>
            </View>
            <View
              style={{
                flex: 2,
                marginBottom: 19,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <DniContainer>
                {imageType === 'FRONT' && context.documentImageFrontPath && (
                  <View style={{padding: 10, width: '100%', height: '100%'}}>
                    <Image
                      style={{
                        width: '100%',
                        height: '100%',
                        resizeMode: 'contain',
                        padding: 10,
                        transform:
                          Platform.OS === 'ios' ? [{rotate: '180deg'}] : [],
                      }}
                      source={{
                        uri: `data:image/png;base64,${context.documentImageFrontPath}`,
                      }}
                    />
                  </View>
                )}

                {imageType === 'BACK' && context.documentImageBackPath && (
                  <View style={{padding: 10, width: '100%', height: '100%'}}>
                    <Image
                      style={{
                        width: '100%',
                        height: '100%',
                        resizeMode: 'contain',
                        padding: 10,
                        transform:
                          Platform.OS === 'ios' ? [{rotate: '180deg'}] : [],
                      }}
                      source={{
                        uri: `data:image/png;base64,${context.documentImageBackPath}`,
                      }}
                    />
                  </View>
                )}
              </DniContainer>
              <Text style={styles.photoLabel}>
                Verificar que tenga buena luz
              </Text>
              <Text style={styles.photoLabel}>Se vea la totalidad del DNI</Text>
              <Text style={styles.photoLabel}>
                Tus datos se vean claramente
              </Text>
            </View>
          </View>
        </InfoPanel>
        <ActionPanel>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-start',
              paddingLeft: 16,
              paddingRight: 16,
            }}>
            <Button
              label="Confirmar"
              onPress={goToRegisterDniScanPage}
              style={{marginBottom: 15}}></Button>
            <ButtonOutline
              label="Tomar otra"
              onPress={() => navigation.goBack()}
              colors={{
                text: THEME_COLORS.PRIMARY,
              }}></ButtonOutline>
          </View>
        </ActionPanel>
      </Container>
    </ShowStatusBarLayout>
  );
};

RegisterDniScanConfirmPage.navigationOptions = {
  title: '',
};

export default RegisterDniScanConfirmPage;
