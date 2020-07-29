import React from 'react';
import styled from "styled-components/native";
import ErrorIcon from "../assets/icons/ic_error.svg";
import ShowStatusBarLayout from "../layouts/show-status-bar.layout";
import { View, Text, StyleSheet } from "react-native";
import IconMessage from "../components/icon-message.component";
import THEME_COLORS from '../styles/theme.styles';
import Button from '../components/button.component';

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

const ErrorPage = ({errorMsg, descriptionMsg, buttonLabel, onPress}: {errorMsg:string; descriptionMsg:string; buttonLabel:string; onPress: ()=> void }) => {   
    return (
        <ShowStatusBarLayout>
          <Container>
            <InfoPanel>
                <View style={{flex: 1, justifyContent: "center"}}>
                    <IconMessage icon={<ErrorIcon/>} title={errorMsg} text={descriptionMsg}/>
                </View>
            </InfoPanel>
            <ActionPanel>
                <Button label={buttonLabel} onPress={onPress}/>
            </ActionPanel>
          </Container>
        </ShowStatusBarLayout>
    );
};

export default ErrorPage;
