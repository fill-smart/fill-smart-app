import React, { useContext } from 'react';
import styled from "styled-components/native";
import CheckIcon from "../../assets/icons/ic_check.svg";
import ShowStatusBarLayout from "../../layouts/show-status-bar.layout";
import { View, Text, StyleSheet } from "react-native";
import IconMessage from "../../components/icon-message.component";
import { useNavigation } from 'react-navigation-hooks';
import { getRoutePath, APP_ROUTES, DIRECT_ROUTES } from '../../routing/routes';
import THEME_COLORS from '../../styles/theme.styles';
import Button from '../../components/button.component';
import { StackNavigationProp } from 'react-navigation-stack/lib/typescript/src/vendor/types';
import { NavigationActions, StackActions } from 'react-navigation';
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

const RegisterRegistrationCompletePage = () => {
    const navigation = useNavigation() as StackNavigationProp;
    const [state, dispatch] = useContext(RegisterContext);
    
    const goToLoginPage = () => {   
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: getRoutePath(APP_ROUTES.Main, APP_ROUTES),
              }),
            ],
          });
          navigation.dispatch(resetAction);

        // navigation.reset([
        //     NavigationActions.navigate({ routeName:  getRoutePath(DIRECT_ROUTES.Welcome, DIRECT_ROUTES) }),
        //     NavigationActions.navigate({ routeName:  getRoutePath(APP_ROUTES.Main, APP_ROUTES)})
        // ], 1);  
        //navigation.navigate(getRoutePath(APP_ROUTES.Login));
    };

    return (
        <ShowStatusBarLayout>
          <Container>
            <InfoPanel>
                <View style={{flex: 1, justifyContent: "center"}}>
                    <IconMessage icon={<CheckIcon/>} title="¡Ya estás registrado!" text="Ya podés disfrutar de todos los beneficios de Fill Smart"/>
                </View>
            </InfoPanel>
            <ActionPanel>
                <Button label="Ingresar" onPress={goToLoginPage}/>
            </ActionPanel>
          </Container>
        </ShowStatusBarLayout>
    );
};

RegisterRegistrationCompletePage.navigationOptions = {              
    title: '', 
  };

export default RegisterRegistrationCompletePage;
