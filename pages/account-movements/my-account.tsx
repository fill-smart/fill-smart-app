import React, { useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import THEME_COLORS from '../../styles/theme.styles';
import ShowStatusBarLayout from '../../layouts/show-status-bar.layout';
import IconSeparator from '../../components/icon-separator.component';
import Pump from '../../assets/icons/ic_pump_primary.svg';
import MyAccountSummary from '../../components/my-account-summary.component';
import MyAccountItem from '../../components/my-account-item.component';
import Button from '../../components/button.component';
import { useNavigation } from 'react-navigation-hooks';
import {
  getRoutePath, HOME_ROUTE,
} from '../../routing/routes';
import useWallets from '../../hooks/use-wallets';
import Loader from '../../components/loader.component';
import crashlytics from '@react-native-firebase/crashlytics';

const Page = styled.View`
  background-color: ${THEME_COLORS.BACKGROUND_DARK};
  flex: 1;
  padding-right: 24px;
  padding-left: 24px;
`;

const SeparatorView = styled.View`
  margin-top: 8px;
  margin-bottom: 8px;
`;

const ActionPanel = styled.View`
  height: 90px;
  background-color: ${THEME_COLORS.BACKGROUND_DARK};
  padding: 24px;
  elevation: 2;
`;

const MyAccount = () => {
  const navigation = useNavigation();
  const { wallets, total, loading, error } = useWallets();

  if (loading) {
    return <Loader></Loader>;
  }

  if (error) {
    crashlytics().recordError(error);
    //TODO handle error query
    console.log('useWallets:', error);
  }

  return (
    <ShowStatusBarLayout>
      <ScrollView>
        <Page>
          <MyAccountSummary />

          <SeparatorView>
            <IconSeparator text="Mis litros" icon={<Pump />} />
          </SeparatorView>

          {wallets?.map(wallet => (
            <MyAccountItem wallet={wallet} />
          ))}
        </Page>
      </ScrollView>
      <ActionPanel>
        <Button
          label="Movimientos"
          onPress={() =>
            navigation.navigate(
              getRoutePath(HOME_ROUTE.MyAccountMovements, HOME_ROUTE),
            )
          }></Button>
      </ActionPanel>
    </ShowStatusBarLayout>
  );
};

MyAccount.navigationOptions = {
  title: 'Mi Cuenta',
};

export default MyAccount;
