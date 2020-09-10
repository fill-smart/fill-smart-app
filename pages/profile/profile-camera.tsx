import React, { useEffect } from 'react';
import styled from 'styled-components/native';
import ShowStatusBarLayout from '../../layouts/show-status-bar.layout';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import CameraIcon from '../../assets/icons/ic_camera.svg';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import { RNCamera, TakePictureOptions, Orientation } from 'react-native-camera';
import THEME_COLORS from '../../styles/theme.styles';
import { withNavigationFocus, NavigationActions, StackActions } from 'react-navigation';
import { getRoutePath, PROFILE_ROUTES } from '../../routing/routes';
import Jimp from 'jimp';
import useProfileUploadImage from '../../hooks/use-profile-upload-image';
import useProfile from '../../hooks/use-profile';
import Loader from '../../components/loader.component';
import crashlytics from '@react-native-firebase/crashlytics';


const styles = StyleSheet.create({
  preview: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    width: 64,
    height: 64,
    borderRadius: 64 / 2,
    borderColor: THEME_COLORS.PRIMARY,
    borderWidth: 2,
    backgroundColor: '#fff',
    padding: 20,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
});

let loading = false;

const ProfileCameraPage = ({ isFocused }: { isFocused: boolean }) => {
  const navigation = useNavigation();
  const { customerId, error, executeUploadImage } = useProfileUploadImage();
  const refetch = useNavigationParam("refetch");

  useEffect(() => {
    if (customerId) {
      fetchNewDataAndGoBack();
    }
  }, [customerId, error]);

  const fetchNewDataAndGoBack = async () => {
    await refetch();
    navigation.goBack();
    loading = false;
  }

  const takePicture = async (camera: RNCamera) => {
    if (camera) {
      const options: TakePictureOptions = {
        base64: true,
        quality: 0.6,
        width: 700,
        exif: true,
        fixOrientation: true,
        forceUpOrientation: true,
        orientation: 'portrait',
      };
      const data = await camera.takePictureAsync(options);
      if (data.base64) {
        loading = true;
        const base64 = data.base64;
        try {
          executeUploadImage({ image: base64 });
        }
        catch (error) {
          crashlytics().recordError(error);
          Alert.alert('Error', "Ocurrió un error", error);
        }
      }
    }
  };

  return (
    <ShowStatusBarLayout>
      <>
        {isFocused ? (
          <RNCamera
            style={styles.preview}
            type={RNCamera.Constants.Type.front}
            flashMode={RNCamera.Constants.FlashMode.auto}
            captureAudio={false}
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
              buttonPositive: 'Aceptar',
              buttonNegative: 'Cancelar',
            }}>
            {({ camera, status }) => {
              if (status !== 'READY') return null;
              return (
                <TouchableOpacity
                  onPress={() => takePicture(camera)}
                  style={styles.capture}>
                  {loading ? <Loader /> : <CameraIcon />}
                </TouchableOpacity>
              );
            }}
          </RNCamera>
        ) : null}
      </>
    </ShowStatusBarLayout>
  );
};

ProfileCameraPage.navigationOptions = {
  header: null,
};

export default withNavigationFocus(ProfileCameraPage);
