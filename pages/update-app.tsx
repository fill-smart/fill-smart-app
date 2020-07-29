import React from 'react';
import { Text, Platform, View, Linking } from 'react-native';
import styled from 'styled-components/native';
import Splash from '../assets/icons/Splash.svg';
import Logo from '../assets/icons/ic_logo.svg';
import UpdateIcon from '../assets/icons/ic_update_app.svg';

import THEME_COLORS from '../styles/theme.styles';
import Button from '../components/button.component';
import Card from '../components/card-component';
import Environment from '../environment/environment';


const MainView = styled.View`
  background-color: white;
  flex: 1;  
  justify-content: center;
`;

const UpdateCard = styled(Card)`    
  margin:16px;      
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const UpdateText = styled.Text`
    color: ${THEME_COLORS.FONT_NORMAL};
    font-size: 18px;    
    font-family: 'LibreFranklin-Regular';
`;

export const UpdateApp = () => {

  const goUpdateApp = () => {
    if (Platform.OS === "android") {
      Linking.openURL(Environment.playStoreLink);
    }
    else {
      Linking.openURL(Environment.appStoreLink);
    }
  }

  return (
    <MainView>
      <Splash style={{ position: "absolute", left: 0, top: 0 }} />
      <UpdateCard>
        <Logo style={{ marginVertical: 20, }} />
        <UpdateIcon style={{ marginVertical: 20, }} />
        <UpdateText style={{ marginVertical: 20, textAlign: "center" }}>Hay una nueva versión disponible y es necesario actualizar para utilizar la app</UpdateText>
        <View style={{ width: '100%' }}>
          <Button label="Actualizar" onPress={goUpdateApp} style={{ marginVertical: 20, width: '100%' }}></Button>
        </View>
      </UpdateCard>
    </MainView>
  );
};

export default UpdateApp;
