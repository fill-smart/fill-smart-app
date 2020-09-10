import React from 'react';
import { View } from "react-native";
import { useNavigation } from 'react-navigation-hooks';
import { StackNavigationProp } from 'react-navigation-stack/lib/typescript/src/vendor/types';
import styled from "styled-components/native";
import CheckIcon from "../../assets/icons/ic_check.svg";
import Button from '../../components/button.component';
import IconMessage from "../../components/icon-message.component";
import ShowStatusBarLayout from "../../layouts/show-status-bar.layout";
import { PROFILE_ROUTES, getRoutePath } from '../../routing/routes';
import { StackActions, NavigationActions } from 'react-navigation';


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

const ChangePasswordCompletePage = () => {
    const navigation = useNavigation() as StackNavigationProp;
    
    const goToProfilePage = () => {   
        navigation.reset([
          NavigationActions.navigate({ routeName: getRoutePath(PROFILE_ROUTES.Profile, PROFILE_ROUTES) })
        ], 0);
    };

    return (
        <ShowStatusBarLayout>
          <Container>
            <InfoPanel>
                <View style={{flex: 1, justifyContent: "center"}}>
                    <IconMessage icon={<CheckIcon/>} title="¡Contraseña modificada con éxito!" text="Tenés una nueva contraseña"/>
                </View>
            </InfoPanel>
            <ActionPanel>
                <Button label="Aceptar" onPress={goToProfilePage}/>
            </ActionPanel>
          </Container>
        </ShowStatusBarLayout>
    );
};

ChangePasswordCompletePage.navigationOptions = {              
    title: '', 
  };

export default ChangePasswordCompletePage;
