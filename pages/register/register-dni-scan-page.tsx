import React, {useContext} from 'react';
import {View, Text, Image, Platform} from 'react-native';
import styled from 'styled-components/native';
import IconMessage from '../../components/icon-message.component';
import Button from '../../components/button.component';
import DniScanIcon from '../../assets/icons/ic_dni_selected.svg';
import CameraIcon from '../../assets/icons/ic_camera.svg';
import THEME_COLORS from '../../styles/theme.styles';
import ShowStatusBarLayout from '../../layouts/show-status-bar.layout';
import {getRoutePath, REGISTER_ROUTES} from '../../routing/routes';
import {useNavigation} from 'react-navigation-hooks';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {RegisterContext} from '../../contexts/register-user.context';

const Container = styled.View`
  background-color: white;
  height: 100%;
  padding: 25px;
  padding-top: 10px;
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
  justify-content: flex-end;
  flex-direction: column;
`;

const SvgView = styled.View`
  position: absolute;
  right: 13px;
  bottom: 12px;
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

const DniContainerTitle = styled.Text`
  color: ${THEME_COLORS.PRIMARY};
  font-size: 12px;
  font-family: 'LibreFranklin-Regular';
  background-color: white;
  position: absolute;
  top: -11px;
  padding: 0px 3px;
  left: 14px;
  z-index: 99;
`;

export const RegisterDniScanPage = () => {
  const navigation = useNavigation();
  const [context, _] = useContext(RegisterContext);

  const goToRegisterDniUserData = () => {
    if (context.documentImageFrontPath && context.documentImageBackPath) {
      navigation.navigate(
        getRoutePath(REGISTER_ROUTES.RegisterUserData, REGISTER_ROUTES),
      );
    }
  };

  const goTakePhoto = (type: 'FRONT' | 'BACK') => {
    navigation.navigate({
      routeName: getRoutePath(REGISTER_ROUTES.RegisterCamera, REGISTER_ROUTES),
      key: 'RegisterDniScan',
      params: {type},
    });
  };

  let buttonColor =
    context.documentImageFrontPath && context.documentImageBackPath
      ? {
          text: THEME_COLORS.WHITE,
          background: THEME_COLORS.PRIMARY,
        }
      : {
          text: THEME_COLORS.LINES,
          background: THEME_COLORS.FONT_LIGHT,
        };

  return (
    <ShowStatusBarLayout>
      <Container>
        <InfoPanel>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-start',
              marginBottom: 19,
            }}>
            <IconMessage
              icon={<DniScanIcon />}
              title="Escaneo DNI"
              text="Toma una foto al frente y al dorso de tu DNI"></IconMessage>
          </View>
          <View
            style={{
              flex: 2,
              marginBottom: 30,
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{padding: 10}}
              onPress={() => goTakePhoto('FRONT')}>
              <DniContainer>
                <DniContainerTitle>Frente</DniContainerTitle>
                {context.documentImageFrontPath && (
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
                <SvgView>
                  <CameraIcon></CameraIcon>
                </SvgView>
              </DniContainer>
            </TouchableOpacity>

            <TouchableOpacity
              style={{padding: 10}}
              onPress={() => goTakePhoto('BACK')}>
              <DniContainer>
                <DniContainerTitle>Dorso</DniContainerTitle>
                {context.documentImageBackPath && (
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
                <SvgView>
                  <CameraIcon></CameraIcon>
                </SvgView>
              </DniContainer>
            </TouchableOpacity>
          </View>
        </InfoPanel>
        <ActionPanel>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              paddingLeft: 16,
              paddingRight: 16,
            }}>
            <Button
              label="Verificar mi identidad"
              colors={buttonColor}
              onPress={goToRegisterDniUserData}></Button>
          </View>
        </ActionPanel>
      </Container>
    </ShowStatusBarLayout>
  );
};

RegisterDniScanPage.navigationOptions = {
  title: '',
};

export default RegisterDniScanPage;
