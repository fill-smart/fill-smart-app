import React, { Component, useState, useContext, useEffect, Fragment, useRef } from 'react';
import { useNavigation } from 'react-navigation-hooks';
import { getRoutePath, HOME_ROUTE } from '../../routing/routes';
import useRequestAddFuelToWallet from '../../hooks/use-request-add-fuel-to-wallet.hook';
import Loader from '../../components/loader.component';
import styled from 'styled-components/native';
import THEME_COLORS from '../../styles/theme.styles';
import { View, Dimensions, Alert } from 'react-native';
import QrTopLeft from '../../assets/icons/qr_top_left.svg';
import QrTopRight from '../../assets/icons/qr_top_right.svg';
import QrBottomLeft from '../../assets/icons/qr_bottom_left.svg';
import QrBottomRight from '../../assets/icons/qr_bottom_right.svg';
import Animated, { Easing } from 'react-native-reanimated';
import ErrorPage from '../error-page';
import { withNavigationFocus, NavigationActions } from 'react-navigation';
import { StackNavigationProp } from 'react-navigation-stack/lib/typescript/src/vendor/types';
import { QRModel } from '../../models/qr.model';
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
  background-color: ${THEME_COLORS.INFO_LIGHT};
  position: absolute;
  top: 0;
  left: 0;
  z-index:999;
`;

const PurchaseQrScanPage = () => {
  const navigation = useNavigation() as StackNavigationProp;
  const [errorRead, setErrorRead] = useState(false);
  const [qrShowLine, setQRShowLine] = useState(true);
  const { sendRequest, purchase, loading, error } = useRequestAddFuelToWallet()
  const [scannerMargin, setScannerMargin] = useState(new Animated.Value(-100))
  const widthQrWindow = Dimensions.get('window').width / 2 + Dimensions.get('window').width / 6;




  useEffect(() => {
    if (purchase) {
      navigation.reset([
        NavigationActions.navigate({ routeName: getRoutePath(HOME_ROUTE.Home, HOME_ROUTE) }),
        NavigationActions.navigate({ routeName: getRoutePath(HOME_ROUTE.PurchaseVerifyDni, HOME_ROUTE), params: { operationId: purchase.id, authorizationId: purchase.authorization.id } })
      ], 1);

      //const navigated = navigation.navigate(getRoutePath(HOME_ROUTE.PurchaseVerifyDni, HOME_ROUTE),
      //  { operationId: purchase.id, authorizationId: purchase.authorization.id });
      // if (navigated) {
      //   scanner?.reactivate();
      // }
    }
  }, [purchase]);

  const onRead = ({ type, data }: { type: string, data: string }) => {
    setQRShowLine(false);
    try {
      if (type !== "QR_CODE" && type !== "qr" && type != "org.iso.QRCode") {
        return
      }

      const qrData: QRModel = JSON.parse(data);

      if (qrData.operationType !== "purchase") {
        setErrorRead(true);
        return;
      }

      sendRequest(qrData.gasStationId);
    }
    catch (error) {
      crashlytics().recordError(error);
      Alert.alert("Error al leer código QR", "Ocurrió un error al leer el código QR. Intente nuevamente.");
      setQRShowLine(true);
    }

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
  }, [])

  const goBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return (<Loader />);
  }

  if (error) {
    crashlytics().recordError(error);
    return (<ErrorPage
      buttonLabel="Aceptar"
      errorMsg="Ocurrió un error inesperado"
      descriptionMsg="Por favor intente nuevamente"
      onPress={goBack} />);
  }

  if (errorRead) {
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
            {qrShowLine && <Animated.View style={{ borderBottomWidth: 5, borderBottomColor: THEME_COLORS.SECONDARY, marginHorizontal: -30, zIndex: 999, marginBottom: scannerMargin }}></Animated.View>}
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

PurchaseQrScanPage.navigationOptions = {
  title: 'Comprar',
};

export default PurchaseQrScanPage;
