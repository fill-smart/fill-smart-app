import React, { useEffect, useContext, useState } from 'react';
import { View, Alert, Platform } from 'react-native';
import IconMessage from '../components/icon-message.component';
import Button from '../components/button.component';
import User from '../assets/icons/ic_user.svg';

import ButtonOutline from '../components/button-outline.component';
import ShowStatusBarLayout from '../layouts/show-status-bar.layout';
import styled from 'styled-components/native';
import { useNavigation } from 'react-navigation-hooks';
import { getRoutePath, APP_ROUTES } from '../routing/routes';
import THEME_COLORS from '../styles/theme.styles';
import { PERMISSIONS, RESULTS, requestNotifications, checkNotifications, request, check, Permission } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import LocationPermissionDeniedModal from '../components/location-permission-denied-modal.component';
import LocationUnavailableModal from '../components/location-unavailable-modal.component';
import useGasStationInRadio from '../hooks/use-gas-station-in-radio.hook';
import crashlytics from '@react-native-firebase/crashlytics';

const Container = styled.View`
  background-color: white;
  padding: 25px;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const InfoPanel = styled.View`
  flex: 1;
  width: 100%;
  flex-grow: 1;
`;

const ActionPanel = styled.View`
  width: 100%;
  height: 150px;
`;

type Rationale = {
  title: string;
  message: string;
  buttonPositive?: string;
  buttonNegative?: string;
  buttonNeutral?: string;
};

const WelcomePage = () => {
  const navigation = useNavigation();
  const [locationPermission, setLocationPermission] = useState("");
  const [isLocationModalVisible, setLocationModalVisible] = useState(false);
  const [isLocationDeniedModalVisible, setLocationDeniedModalVisible] = useState(false);
  const { loading, error, data: GasStationInRadioResult, executeQuery: isGasStationInRadio } = useGasStationInRadio();

  //Handle Notifications Permissions
  useEffect(() => {
    // if (Platform.OS !== 'ios') {
    //   checkLocationPermission();
    //   return;
    // }
    checkNotifications().then(({ status, settings }) => {
      if (status !== RESULTS.GRANTED) {
        requestNotifications(['alert', 'sound']).then(({ status, settings }) => {
          console.log("Notification Permisssion: ", status);
          checkLocationPermission();
        });
      }
      else {
        checkLocationPermission();
      }
    });
  }, []);

  //Effect to watch location permission changes
  // useEffect(() => {
  //   if (locationPermission === RESULTS.GRANTED) {
  //     checkGasStationsInLocation();
  //   }
  //   // else {
  //   //   checkLocationPermission();
  //   // }
  // }, [locationPermission]);

  useEffect(() => {
    if (GasStationInRadioResult && !GasStationInRadioResult.isGasStationInRadio) {
      setLocationModalVisible(true);
    }
  }, [GasStationInRadioResult]);

  //Handle Geolocation Permissions
  const checkLocationPermission = () => {
    const platformPersmission = Platform.select({
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    });

    check(platformPersmission!)
      .then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log('This feature is not available (on this device / in this context)');
            setLocationDeniedModalVisible(true);
            break;
          case RESULTS.DENIED:
            console.log('The permission has not been requested / is denied but requestable');
            requestLocationPermission(platformPersmission!);
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            //setLocationPermission(RESULTS.GRANTED);
            checkGasStationsInLocation();
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            setLocationDeniedModalVisible(true);
            break;
        }
      })
      .catch((error) => {
        crashlytics().recordError(error);
        console.log('Error requesting permission', error);
      });
  }

  const requestLocationPermission = (permission: Permission) => {
    request(permission).then((result) => {
      if (locationPermission === RESULTS.GRANTED) {
        //setLocationPermission(RESULTS.GRANTED);
        checkGasStationsInLocation();
      }
      else {
        checkLocationPermission();
      }
    });
  }

  const checkGasStationsInLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log("GPS position: ", position);
        isGasStationInRadio(position.coords.latitude, position.coords.longitude, 50);
      },
      (error) => {
        // See error code charts below.
        setLocationModalVisible(true);
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 10000, showLocationDialog: true, forceRequestLocation: true }
    );
  };

  const goToRegisterDniPage = () => {
    navigation.navigate(getRoutePath(APP_ROUTES.Register));
  };

  const goToLoginPage = () => {
    navigation.navigate(getRoutePath(APP_ROUTES.Login));
  };

  return (
    <ShowStatusBarLayout>
      <Container>
        <InfoPanel>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <IconMessage
              icon={<User />}
              title="¡Bienvenido a Fill Smart!"
              text="Para empezar, tenés que registrarte o ingresar a tu cuenta"></IconMessage>
          </View>
        </InfoPanel>
        <ActionPanel>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-start',
              paddingLeft: 16,
              paddingRight: 16,
            }}>
            <Button
              label="Registrarme"
              style={{ marginBottom: 15 }}
              onPress={goToRegisterDniPage}></Button>
            <ButtonOutline
              label="Ya tengo cuenta"
              colors={{
                text: THEME_COLORS.PRIMARY,
              }}
              onPress={goToLoginPage}></ButtonOutline>
          </View>
        </ActionPanel>

        <LocationUnavailableModal isModalVisible={isLocationModalVisible} onClose={() => { setLocationModalVisible(false) }} />
        <LocationPermissionDeniedModal isModalVisible={isLocationDeniedModalVisible} onClose={() => { setLocationDeniedModalVisible(false) }} />
      </Container>
    </ShowStatusBarLayout>
  );
};

export default WelcomePage;
