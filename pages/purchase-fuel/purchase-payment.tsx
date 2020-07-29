import React, { useEffect, useState, useContext } from 'react';
import WebView from 'react-native-webview';
import useRequestAddFuelToWallet from '../../hooks/use-request-add-fuel-to-wallet.hook';
import { ActivityIndicator } from 'react-native';
import {
  FcmContext,
  PushNotificationTypesEnum,
  FCM_ACTIONS,
} from '../../contexts/fcm.context';
import Button from '../../components/button.component';
import THEME_COLORS from '../../styles/theme.styles';
import styled from 'styled-components/native';
import { useNavigation } from 'react-navigation-hooks';
import { getRoutePath, HOME_ROUTE } from '../../routing/routes';
import Loader from '../../components/loader.component';
import ErrorPage from '../error-page';
import crashlytics from '@react-native-firebase/crashlytics';

const Container = styled.View`
  padding: 25px;
`;
const PurchasePayment = () => {
  const { sendRequest, loading, purchase, error } = useRequestAddFuelToWallet();
  const [notification, dispatch] = useContext(FcmContext);
  const navigation = useNavigation();
  const isOperationSuccessful =
    notification.notification?.type ===
    PushNotificationTypesEnum.PurchaseSuccess;
  const isOperationRejected =
    notification.notification?.type ===
    PushNotificationTypesEnum.PurchaseRejected;
  useEffect(() => {
    dispatch({
      type: FCM_ACTIONS.CLEAR_NOTIFICATION,
    });
    sendRequest();
  }, []);
  if (loading || !purchase || !purchase.preferenceUrl) {
    return <Loader />;
  }

  const goResult = () => {
    navigation.navigate(getRoutePath(HOME_ROUTE.PurchaseResult, HOME_ROUTE), { operationId: purchase.id });
  };

  const goBack = () => {
    navigation.navigate(getRoutePath(HOME_ROUTE.PurchaseConfirm, HOME_ROUTE));
  };

  const ContinueButton = isOperationSuccessful ? (
    <Container>
      <Button
        onPress={() => goResult()}
        label="Finalizar"
        colors={{
          background: THEME_COLORS.PRIMARY,
          text: THEME_COLORS.WHITE,
        }} loading={loading}></Button>
    </Container>
  ) : null;

  if (error) {
    crashlytics().recordError(error);
    return (<ErrorPage
      buttonLabel="Aceptar"
      errorMsg="Ocurrió un error inesperado"
      descriptionMsg="Por favor intente nuevamente"
      onPress={goBack} />);
  }

  return (
    <React.Fragment>
      <WebView
        style={{
          marginTop: -60,
        }}
        renderLoading={() => <Loader />}
        startInLoadingState
        source={{ uri: purchase?.preferenceUrl! }}></WebView>
      {ContinueButton}
    </React.Fragment>
  );
};

PurchasePayment.navigationOptions = {
  title: 'Pagar',
};

export default PurchasePayment;
