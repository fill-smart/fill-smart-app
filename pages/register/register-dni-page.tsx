import React, { useState, useContext } from 'react';
import { View } from 'react-native';
import IconMessage from '../../components/icon-message.component';
import Button from '../../components/button.component';
import DniIcon from '../../assets/icons/ic_dni.svg';
import ShowStatusBarLayout from '../../layouts/show-status-bar.layout';
import styled from 'styled-components/native';
import { getRoutePath, REGISTER_ROUTES } from '../../routing/routes';
import { useNavigation } from 'react-navigation-hooks';
import { RegisterContext, REGISTER_ACTIONS } from '../../contexts/register-user.context';

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

const RegisterDniPage = () => {
  const navigation = useNavigation();
  const [state, dispatch] = useContext(RegisterContext);
  

  const goToRegisterDniScanPage = () => {
    dispatch({ type: REGISTER_ACTIONS.CLEAN_STORE });
    navigation.navigate(getRoutePath(REGISTER_ROUTES.RegisterDniScan, REGISTER_ROUTES));
  }

  return (
    <ShowStatusBarLayout>
      <Container>
        <InfoPanel>

          <View style={{ flex: 4, marginBottom: 22, justifyContent: 'center' }}>
            <IconMessage
              icon={<DniIcon />}
              title="DNI"
              text="Vamos a validar tus datos con RENAPER para un registro mas ágil y seguro"></IconMessage>
          </View>


        </InfoPanel>
        <ActionPanel>

          <View style={{ flex: 1, justifyContent: 'flex-start', paddingLeft: 16, paddingRight: 16 }}>
            <Button label="Siguiente" onPress={goToRegisterDniScanPage}></Button>
          </View>

        </ActionPanel>
      </Container>
    </ShowStatusBarLayout>
  );
};

RegisterDniPage.navigationOptions = {              
  title: '', 
};

export default RegisterDniPage;
