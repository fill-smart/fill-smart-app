import React, { useEffect, useContext, useState } from 'react';
import styled from 'styled-components/native';
import ShowStatusBarLayout from '../../layouts/show-status-bar.layout';
import { View } from 'react-native';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import {
  getRoutePath,
  HOME_ROUTE,
} from '../../routing/routes';
import LottieView from 'lottie-react-native';
import THEME_COLORS from '../../styles/theme.styles';
import useFcmNotifications from '../../hooks/use-fcm-notification.hook';
import {
  PushNotificationTypesEnum,
  FcmContext,
} from '../../contexts/fcm.context';
import useOperations from '../../hooks/use-operations';
import OperationTimeExceededModal from '../../components/operation-time-exceeded.modal.component';
import useAuthorizationStatus from '../../hooks/use-authorization-status.hook';

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

const CenteredContainer = styled.View`
  flex: 1;
  justify-content: center;
`;
const Title = styled.Text`
  text-align: center;
  font-size: 16px;
  font-family: 'LibreFranklin-Regular';
  color: ${THEME_COLORS.FONT_REGULAR};
  margin-top: 24px;
  margin-bottom: 3px;
`;

const Subtitle = styled.Text`
  text-align: center;
  font-size: 14px;
  font-family: 'LibreFranklin-Regular';
  color: ${THEME_COLORS.FONT_NORMAL};
`;

const LottieWrapper = styled.View`
  height: 220px;
`;

const WithdrawalVerifyDniPage = () => {
  const navigation = useNavigation();
  const operationId: string = useNavigationParam('operationId');
  const authorizationId: string = useNavigationParam('authorizationId');
  const grantedNotification = useFcmNotifications<{ id: number }>(
    PushNotificationTypesEnum.AuthorizationGranted,
  );
  const rejectedNotification = useFcmNotifications<{ id: number }>(
    PushNotificationTypesEnum.AuthorizationRejected,
  );

  const [showTimeExceededModal, setShowTimeExcededModal] = useState(false);
  const [countTimerExceeded, setCountTimerExceeded] = useState(0);
  const { getAuthorizationStatusById, data: authorization, loading, error } = useAuthorizationStatus();

  useEffect(() => {
    const _timer = setTimeout(() => {
      if (countTimerExceeded === 4) {
        navigation.goBack();
      } else {
        setShowTimeExcededModal(true)
      }
    }, 120000);
    return () => clearTimeout(_timer);
  }, [countTimerExceeded]);

  useEffect(() => {
    if (
      grantedNotification.notification &&
      authorizationId === grantedNotification.notification.id.toString()
    ) {
      goOperationComplete();
    }
  }, [grantedNotification.notification]);

  useEffect(() => {
    if (
      rejectedNotification.notification &&
      authorizationId === rejectedNotification.notification.id.toString()
    ) {
      goOperationRejected();
    }
  }, [rejectedNotification.notification]);

  useEffect(() => {
    if (authorization?.authorizationById.status === "AUTHORIZED") {
      goOperationComplete();
      return;
    }

    if (authorization?.authorizationById.status === "REJECTED") {
      goOperationRejected();
      return;
    }

    if (authorization?.authorizationById.status === "PENDING") {
      setCountTimerExceeded(countTimerExceeded + 1);
    }
  }, [authorization]);

  const goOperationComplete = () => {
    navigation.navigate(
      getRoutePath(HOME_ROUTE.WithdrawalOperationComplete, HOME_ROUTE),
      { operationId: operationId },
    );
  };

  const goOperationRejected = () => {
    navigation.navigate(
      getRoutePath(HOME_ROUTE.WithdrawalDniRejected, HOME_ROUTE),
    );
  };

  const refreshOperation = () => {
    getAuthorizationStatusById(authorizationId);
    setShowTimeExcededModal(false);
  };

  return (
    <ShowStatusBarLayout>
      <Container>
        <InfoPanel>
          <CenteredContainer style={{ flex: 1, justifyContent: 'center' }}>
            <View>
              <View>
                <LottieWrapper>
                  <LottieView
                    source={require('../../lottie/dni_alt.json')}
                    autoPlay
                    loop
                  />
                </LottieWrapper>
              </View>
              <Title>Presente su DNI</Title>
              <Subtitle>
                Para su seguridad, necesitamos verificar su identidad, le
                solicitamos presente su DNI al playero. Una vez verificada su
                identidad podra continuar con su carga.
              </Subtitle>
            </View>
          </CenteredContainer>
        </InfoPanel>
        <OperationTimeExceededModal isModalVisible={showTimeExceededModal} onClose={() => refreshOperation()} />
      </Container>
    </ShowStatusBarLayout>
  );
};

WithdrawalVerifyDniPage.navigationOptions = {
  header: null,
};

export default WithdrawalVerifyDniPage;
