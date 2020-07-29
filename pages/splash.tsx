import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components/native';
import Splash from '../assets/icons/Splash.svg';
import { useNavigation } from 'react-navigation-hooks';
import { getRoutePath, APP_ROUTES, HOME_ROUTE } from '../routing/routes';
import useLogin from '../hooks/use-login.hook';
import { StackActions, NavigationActions } from 'react-navigation';
import { SecurityContext } from '../contexts/security.context';
import useApiInfo from '../hooks/use-api-info-hook';
import { compareMajorVersion } from '../utils/api-version.utils';

const MainView = styled.View`
  background-color: white;
  flex: 1;  
  justify-content: center;
`;


export const SplashPage = () => {
    const navigation = useNavigation();
    const [state, _] = useContext(SecurityContext);
    const { apiVersion, loading, error } = useApiInfo();

    useEffect(() => {
        if (state.loading || loading) {
            return;
        }


        console.log("ApiVersion: ", apiVersion);
        if (apiVersion) {
            console.log("Compare Verisosn:" + compareMajorVersion(apiVersion));
        }

        //Check if we have to force update the app because of a major version api 
        if (apiVersion && compareMajorVersion(apiVersion) === 1) {
            const resetAction = StackActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({
                        routeName: getRoutePath(APP_ROUTES.UpdateApp, APP_ROUTES),
                    }),
                ],
            });
            navigation.dispatch(resetAction);
            return;
        }

        if (state.token !== '') {
            if (state.user?.customer.status === 'INACTIVE') {
                goActivateAccount();
            } else {
                goUserAuthentticated()
            }
        } else {
            goUserNotAuthenticated()
        }

    }, [state.token, state.loading, apiVersion, loading]);

    const goUserAuthentticated = () => {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({
                    routeName: getRoutePath(APP_ROUTES.Main, APP_ROUTES),
                }),
            ],
        });
        navigation.dispatch(resetAction);
    }

    const goActivateAccount = () => {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({
                    routeName: getRoutePath(APP_ROUTES.RegisterEnterCode, APP_ROUTES),
                }),
            ],
        });
        navigation.dispatch(resetAction);
    }

    const goUserNotAuthenticated = () => {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: getRoutePath(APP_ROUTES.Welcome) }),
            ],
        });
        navigation.dispatch(resetAction);
    }


    return (
        <MainView>
            <Splash />
        </MainView>
    );
};

export default SplashPage;
