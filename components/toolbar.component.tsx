import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import RingIcon from '../assets/icons/ic_ring.svg';
import HelpIcon from '../assets/icons/ic_help.svg';
import { useNavigation } from 'react-navigation-hooks';
import { HOME_ROUTE, getRoutePath } from '../routing/routes';

const Toolbar = () => {
  const navigation = useNavigation();

  const routesNotRenderToolbar = [
    getRoutePath(HOME_ROUTE.Help, HOME_ROUTE),
    getRoutePath(HOME_ROUTE.Notifications, HOME_ROUTE),
    getRoutePath(HOME_ROUTE.NotificationDetail, HOME_ROUTE)
  ];

  if (routesNotRenderToolbar.includes(navigation.state.routeName)) {
    return null;
  }

  return (
    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity onPress={() => navigation.navigate(getRoutePath(HOME_ROUTE.Notifications, HOME_ROUTE))}>
        <RingIcon style={{ marginHorizontal: 20 }} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate(getRoutePath(HOME_ROUTE.Help, HOME_ROUTE))}>
        <HelpIcon style={{ marginHorizontal: 10 }} />
      </TouchableOpacity>
    </View>
  );
}

export default Toolbar;