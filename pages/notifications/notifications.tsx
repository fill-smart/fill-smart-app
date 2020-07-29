import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components/native';
import NoNotificationIcon from '../../assets/icons/ic_no_notification.svg';
import { useNavigation } from 'react-navigation-hooks';
import { getRoutePath, APP_ROUTES, HOME_ROUTE } from '../../routing/routes';
import { StackActions, NavigationActions } from 'react-navigation';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import THEME_COLORS from '../../styles/theme.styles';
import useNotifications from '../../hooks/use-notifications';
import Loader from '../../components/loader.component';
import moment from 'moment';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { INotificationModel } from '../../models/notification.model';


const MainView = styled.View`
  background-color: white;
  flex: 1;  
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

const Title = styled.Text`
  margin: 12px 0px;
  color: ${THEME_COLORS.FONT_REGULAR};
  font-size: 16px;
  font-family: "LibreFranklin-Regular";
  text-align: center;
`;

const Subtitle = styled.Text`
  color: ${THEME_COLORS.FONT_NORMAL};
  font-size: 14px;
  font-family: "LibreFranklin-Regular";
  text-align: center;
`;


const NoNotifications = () => {
  return (
    <MainView>
      <NoNotificationIcon />
      <Title>No tienes notificaciones nuevas.</Title>
      <Subtitle>Cuando tengas una nueva notificación o alerta, las mismas aparecerán aquí.</Subtitle>
    </MainView>
  );
}

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
`

const trim = (text: string, length: number) => {
  if (text.length > length) {
    return text.substr(0, length) + "..."
  } else return text
}


export const NotificationsPage = () => {
  const navigation = useNavigation();
  const { loading, notifications } = useNotifications(50);
  if (loading) {
    return <Loader></Loader>
  }
  if (!notifications || notifications.length === 0) {
    return <NoNotifications />
  }

  const goNotificationDetail = (item: Pick<INotificationModel, "title" | "text" | "created" | "id">) => {
    navigation.navigate(getRoutePath(HOME_ROUTE.NotificationDetail, HOME_ROUTE), { notification: item });
  }


  return (
    <Container>
      <FlatList data={notifications} keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) =>
          <TouchableOpacity onPress={() => goNotificationDetail(item)}>
            <NotificationCard>
              <NotificationTitle>{item.title}</NotificationTitle>
              <NotificationText>{trim(item.text, 100)}</NotificationText>
              <NotificationDate>{moment(item.created).format('DD/MM/YYYY')}</NotificationDate>
            </NotificationCard>
          </TouchableOpacity>
        }
        showsVerticalScrollIndicator={false}
      />
    </Container>
  )

};

NotificationsPage.navigationOptions = {
  title: 'Notificaciones',
};

export default NotificationsPage;
