import React, { Component, useState, Fragment, useEffect, useRef } from 'react';
import { useNavigation } from 'react-navigation-hooks';
import { getRoutePath, HOME_ROUTE } from '../../routing/routes';
import { View, Dimensions, Alert } from 'react-native';
import THEME_COLORS from '../../styles/theme.styles';
import Animated, { Easing } from "react-native-reanimated";
import QrTopLeft from '../../assets/icons/qr_top_left.svg';
import QrTopRight from '../../assets/icons/qr_top_right.svg';
import QrBottomLeft from '../../assets/icons/qr_bottom_left.svg';
import QrBottomRight from '../../assets/icons/qr_bottom_right.svg';
import styled from 'styled-components/native';
import { withNavigationFocus, StackActions, NavigationActions } from 'react-navigation';
import { StackNavigationProp } from 'react-navigation-stack/lib/typescript/src/vendor/types';
import { QRModel } from '../../models/qr.model';
import ErrorPage from '../error-page';
import QRScanner from '../../components/QRScanner';
import crashlytics from '@react-native-firebase/crashlytics';

const Title = styled.Text`
  text-align: center;    
  font-size: 16px;
  font-family: "LibreFranklin-Regular";
  color: ${THEME_COLORS.FONT_REGULAR};  
`;

const TitleContainer = styled.View`
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100px;
  background-color: ${THEME_COLORS.INFO_LIGHT};
  position: absolute;
  top: 0;
  left: 0;
  z-index:999;
`;

const Container = styled.View`
    background-color: white;
    flex: 1;    
    justify-content: center;
    align-items: center;
`;

const PaymentInStoreQrScan = () => {
  const navigation = useNavigation() as StackNavigationProp;
  const [errorRead, setErrorRead] = useState(false);
  const [scannerMargin, setScannerMargin] = useState(new Animated.Value(-100))
  const widthQrWindow = Dimensions.get('window').width / 2 + Dimensions.get('window').width / 6;

  //For tests
  // setTimeout(() => {
  //   navigation.navigate<{ gasStationId: number }>(
  //     getRoutePath(HOME_ROUTE.PaymentInStoreAmountSelection, HOME_ROUTE),
  //     { gasStationId: 1 },
  //   );
  // }, 3000);

  const onRead = ({ type, data }: { type: string, data: string }) => {
    try {
      if (type !== "QR_CODE" && type !== "qr" && type != "org.iso.QRCode") {
        return
      }
      const qrData: QRModel = JSON.parse(data);

      if (qrData.operationType !== "shop_purchase") {
        setErrorRead(true);
        return;
      }

      navigation.navigate<{ gasStationId: string }>(
        getRoutePath(HOME_ROUTE.PaymentInStoreAmountSelection, HOME_ROUTE),
        { gasStationId: qrData.gasStationId }
      );
    }
    catch (error) {
      crashlytics().recordError(error);
      Alert.alert("Error al leer código QR", "Ocurrió un error al leer el código QR. Intente nuevamente.");
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  const animationDuration = 1500;
  const animateToTop = () => {
    Animated.timing(scannerMargin, {
      toValue: widthQrWindow / 2,
      duration: animationDuration,
      easing: Easing.inOut(Easing.cubic)
    }).start(() => {
      animateToBottom()
    })
  }

  const animateToBottom = () => {
    Animated.timing(scannerMargin, {
      toValue: -1 * (widthQrWindow / 2),
      duration: animationDuration,
      easing: Easing.inOut(Easing.cubic)
    }).start(() => animateToTop())
  }
  useEffect(() => {
    animateToTop()
  }, []);

  if (errorRead) {
    return (<ErrorPage
      buttonLabel="Aceptar"
      errorMsg="El QR que esta escaneando no es válido"
      descriptionMsg="Por favor intente nuevamente"
      onPress={goBack} />);
  }

  return (
    <Container>

      <QRScanner
        onBarCodeRead={(e: any) => onRead(e)}
      />

      <TitleContainer>
        <Title style={{ paddingHorizontal: 16 }}>Para continuar el proceso, escanee el código QR provisto por el playero</Title>
      </TitleContainer>


      <View style={{ flex: 1, position: "absolute", left: 0, top: 0, width: "100%", height: "100%" }}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
        </View>


        <View style={{ flexDirection: "row" }}>

          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}>
          </View>

          <View style={{ width: widthQrWindow, height: widthQrWindow, justifyContent: "center", zIndex: 999 }}>
            <QrTopLeft style={{ position: "absolute", top: 0, left: 0, marginTop: -3, marginLeft: -3 }} />
            <QrTopRight style={{ position: "absolute", top: 0, right: 0, marginTop: -3, marginRight: -3 }} />
            <QrBottomLeft style={{ position: "absolute", bottom: 0, left: 0, marginBottom: -3, marginLeft: -3 }} />
            <QrBottomRight style={{ position: "absolute", bottom: 0, right: 0, marginBottom: -3, marginRight: -3 }} />
            <Animated.View style={{ borderBottomWidth: 5, borderBottomColor: THEME_COLORS.SECONDARY, marginHorizontal: -30, zIndex: 999, marginBottom: scannerMargin }}></Animated.View>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}>
          </View>

        </View>


        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
        </View>
      </View>



    </Container>

  );
}

PaymentInStoreQrScan.navigationOptions = {
  title: 'Escanear QR',
};

export default PaymentInStoreQrScan;
