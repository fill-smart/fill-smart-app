import React from 'react';
import styled from 'styled-components/native';
import { useNavigationParam } from 'react-navigation-hooks';
import THEME_COLORS from '../../styles/theme.styles';
import moment from 'moment';
import { ScrollView } from 'react-native-gesture-handler';

const NotificationCard = styled.View`
  background-color: ${THEME_COLORS.WHITE};
  border-radius: 10px;
  padding: 11px 14px;   
  margin: 15px 25px; 
  elevation: 2;
  padding-bottom: 7px;  
`
const NotificationTitle = styled.Text`
  font-family: "LibreFranklin-Regular";
  font-size:16px;
  color: ${THEME_COLORS.FONT_REGULAR};
  margin-bottom:3px;
`

const NotificationText = styled.Text`
  font-family: "LibreFranklin-Thin";
  font-size:14px;
  color: ${THEME_COLORS.FONT_REGULAR};
  margin-bottom:11px;
`
const NotificationDate = styled.Text`
  text-align:right;
  font-family:"LibreFranklin-Thin";
  font-size:12px;

`
const Container = styled.View`
    flex: 1;
    justify-content: flex-start;
`



export const NotificationDetailPage = () => {
    const item = useNavigationParam('notification');

    return (
        <Container>
            <ScrollView>
                <NotificationCard>
                    <NotificationTitle>{item.title}</NotificationTitle>
                    <NotificationText>{item.text}</NotificationText>
                    <NotificationDate>{moment(item.created).format('DD/MM/YYYY')}</NotificationDate>
                </NotificationCard>
            </ScrollView>
        </Container>
    )

};

NotificationDetailPage.navigationOptions = {
    title: 'Notificaciones',
};

export default NotificationDetailPage;
