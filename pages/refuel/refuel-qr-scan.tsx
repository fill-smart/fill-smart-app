import React, { Component, useState, Fragment, useEffect, useRef } from 'react';

import { useNavigation } from 'react-navigation-hooks';
import { getRoutePath, HOME_ROUTE } from '../../routing/routes';
import { Modal, View, Dimensions, Text, Alert } from 'react-native';
import THEME_COLORS from '../../styles/theme.styles';
import Animated, { Easing } from "react-native-reanimated";
import QrTopLeft from '../../assets/icons/qr_top_left.svg';
import QrTopRight from '../../assets/icons/qr_top_right.svg';
import QrBottomLeft from '../../assets/icons/qr_bottom_left.svg';
import QrBottomRight from '../../assets/icons/qr_bottom_right.svg';
import styled from 'styled-components/native';
import { withNavigationFocus } from 'react-navigation';
import { QRModel } from '../../models/qr.model';
import ErrorPage from '../error-page';
import QRScanner from '../../components/QRScanner';
import crashlytics from '@react-native-firebase/crashlytics';
import { RNCamera } from 'react-native-camera';

const Title = styled.Text`
  text-align: center;    
  font-size: 16px;
  font-family: "LibreFranklin-Regular";
  color: ${THEME_COLORS.FONT_REGULAR};  
`;

const TitleContainer = styled.View`
  align-items: center;
  justify-content: center;
  height: 100px;
  width: 100%;
  background-color: ${THEME_COLORS.INFO_LIGHT};
  position: absolute;
  top: 0;
  left: 0;
  z-index:999;
`;

let isReadingQr: boolean = false;

const RefuelQrScan = () => {
  const navigation = useNavigation();
  const [invalidOperationError, setInvalidOperationError] = useState(false);
  const [scannerMargin, setScannerMargin] = useState(new Animated.Value(-100))
  const widthQrWindow = Dimensions.get('window').width / 2 + Dimensions.get('window').width / 6;

  //For tests
  // setTimeout(() => {
  //   navigation.navigate<{pumpId: number}>(
  //     getRoutePath(HOME_ROUTE.RefuelConfirmQr, HOME_ROUTE),
  //     {pumpId: 3},
  //   );
  // }, 3000);

  const onRead = ({ type, data }: { type: string, data: string }) => {
    if (isReadingQr) {
      return;
    }
    isReadingQr = true;
    try {
      if (type !== "QR_CODE" && type !== "qr" && type != "org.iso.QRCode") {
        return
      }

      const qrData: QRModel = JSON.parse(data);

      if (qrData.operationType !== "refuel") {
        setInvalidOperationError(true);
        return;
      }

      navigation.navigate<{ pumpId: string }>(
        getRoutePath(HOME_ROUTE.RefuelConfirmQr, HOME_ROUTE),
        { pumpId: qrData.pumpId },
      );
      isReadingQr = false;
    }
    catch (error) {
      crashlytics().recordError(error);
      Alert.alert("Error al leer código QR", "Ocurrió un error al leer el código QR. Intente nuevamente.", [
        {
          text: 'OK',
          onPress: () => {isReadingQr = false}
        }
      ]);
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

  if (invalidOperationError) {
    isReadingQr = false;
    return (<ErrorPage
      buttonLabel="Aceptar"
      errorMsg="El QR que esta escaneando no es válido"
      descriptionMsg="Por favor intente nuevamente"
      onPress={goBack} />);
  }

  return (
    <Fragment>
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
    </Fragment>

  );
};

RefuelQrScan.navigationOptions = {
  title: 'Escanear QR',
};

export default RefuelQrScan;
