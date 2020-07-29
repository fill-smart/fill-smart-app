import React, { useContext, useRef, useState, SVGProps } from 'react';
import styled from 'styled-components/native';
import ShowStatusBarLayout from '../../layouts/show-status-bar.layout';
import {
  MeasureOnSuccessCallback,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform,
  ImageCropData,
} from 'react-native';
import CameraIcon from '../../assets/icons/ic_camera.svg';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import { RNCamera, TakePictureOptions, Orientation } from 'react-native-camera';
import THEME_COLORS from '../../styles/theme.styles';
import { withNavigationFocus } from 'react-navigation';
import {
  RegisterContext,
  REGISTER_ACTIONS,
} from '../../contexts/register-user.context';
import { getRoutePath, REGISTER_ROUTES } from '../../routing/routes';
import QrTopLeft from '../../assets/icons/qr_top_left.svg';
import QrTopRight from '../../assets/icons/qr_top_right.svg';
import QrBottomLeft from '../../assets/icons/qr_bottom_left.svg';
import QrBottomRight from '../../assets/icons/qr_bottom_right.svg';
import crashlytics from '@react-native-firebase/crashlytics';
import ImgToBase64 from 'react-native-image-base64';
import ImageEditor from "@react-native-community/image-editor";

const Container = styled.View`
  background-color: white;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const styles = StyleSheet.create({
  preview: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-evenly',
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
    transform: [{ rotate: '90deg' }],
  },
});



const RegisterCamera = ({ isFocused }: { isFocused: boolean }) => {
  const navigation = useNavigation();
  const imageType: 'FRONT' | 'BACK' = useNavigationParam('type');
  const [_, dispatch] = useContext(RegisterContext);

  const widthQrWindow = //204;
    Dimensions.get('window').width / 2 + Dimensions.get('window').width / 6;
  const heightQrWindow = //322;
    Dimensions.get('window').height - Dimensions.get('window').height / 2;

  const widhtPage = Dimensions.get('window').width;
  const heightPage = Dimensions.get('window').height;

  const dniPortraitView = useRef<View>(null);
  const [dniPortrait, setDniPortrait] = useState({ xPos: 0, yPos: 0 });



  // const goToRegisterAccountActivatedPage = () => {
  //     navigation.navigate(getRoutePath(REGISTER_ROUTES.RegisterAccountActivated, REGISTER_ROUTES));
  // };

  const takePicture = async (camera: RNCamera) => {
    if (camera) {

      const options: TakePictureOptions = {
        //base64: true,
        quality: 0.6,
        width: heightPage,
        exif: true,
        fixOrientation: true,
        forceUpOrientation: true,
        orientation: 'landscapeLeft',
      };

      const data = await camera.takePictureAsync(options);

      const [xPos, yPos, vWidth, vHeight] = await new Promise<[number, number, number, number]>((resolve, reject) => {
        dniPortraitView.current?.measure((x, y, width, height, px, py) => {
          resolve([px, py, width, height]);
        });
      })

      const deltaY = (xPos + vWidth) / widhtPage;
      const newX = yPos - 10; //10 pixels to adjust +- on left side
      const newY = (data.height - (xPos + vWidth)) * deltaY - 10; //Divided by aspect ratio of image
      const newWidth = vHeight + 20;//20pxs to adjust +- to adjust left and rigth side
      const newHeight = vWidth * deltaY + 20;


      const cropData: ImageCropData = {
        offset: { x: newX, y: newY },
        size: { width: newWidth, height: newHeight },
      };

      try {
        const imageUri = (Platform.OS === "android") ? await ImageEditor.cropImage(data.uri, cropData) : data.uri;
        const imageBase64 = await ImgToBase64.getBase64String(imageUri);

        // console.log("Page Width:", widhtPage, "Pag Height:", heightPage);
        // console.log("Frame X:", xPos, "Y:", yPos, "Width: ", vWidth, "Height:", vHeight);

        // console.log("Image size width: ", data.width, "height:", data.height);
        // console.log(JSON.stringify(cropData));
        // console.log("Original Image: ", data.uri);
        // console.log("Cropped IMage: ", croppedImageUri);

        if (imageBase64) {
          dispatch({
            type: REGISTER_ACTIONS.SET_DOCUMENT_IMAGE,
            payload: { type: imageType, documentImage: imageBase64 },
          });
          navigation.navigate(
            getRoutePath(REGISTER_ROUTES.RegisterDniScanConfirm, REGISTER_ROUTES),
            { type: imageType },
          );
        }

      }
      catch (error) {
        //crashlytics().recordError(error);
        console.log(error);
        Alert.alert("Error al capturar la foto.");
        return;
      }
      // if (data.base64) {
      //   const base64 = data.base64;
      //   dispatch({
      //     type: REGISTER_ACTIONS.SET_DOCUMENT_IMAGE,
      //     payload: { type: imageType, documentImage: base64 },
      //   });
      //   navigation.navigate(
      //     getRoutePath(REGISTER_ROUTES.RegisterDniScanConfirm, REGISTER_ROUTES),
      //     { type: imageType },
      //   );
      // }
    }
  };

  return (
    <ShowStatusBarLayout>
      <>
        {isFocused ? (
          <RNCamera
            style={styles.preview}
            type={RNCamera.Constants.Type.back}
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
                <View style={{ flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                  {/* <View
                    style={{width: widthQrWindow, flex: 1, marginVertical: 40}}> */}
                  <View ref={dniPortraitView} onLayout={
                    (e) => setDniPortrait({ xPos: e.nativeEvent.layout.x, yPos: e.nativeEvent.layout.y })
                  }
                    style={{ width: widthQrWindow, height: heightQrWindow, }}>
                    {Platform.OS === "android" ?
                      <>
                      <QrTopLeft
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          marginTop: 0,
                          marginLeft: 0,
                        }}
                      />
                      <QrTopRight
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          marginTop: 0,
                          marginRight: 0,
                        }}
                      />
                      <QrBottomLeft
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          marginBottom: 0,
                          marginLeft: 0,
                        }}
                      />
                      <QrBottomRight
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          marginBottom: 0,
                          marginRight: 0,
                        }}
                      />
                      </>
                    : null}
                  </View>
                  <View
                    style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity
                      onPress={() => takePicture(camera)}
                      style={styles.capture}>
                      <CameraIcon></CameraIcon>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          </RNCamera>
        ) : null}
      </>
    </ShowStatusBarLayout>
  );
};

RegisterCamera.navigationOptions = {
  title: 'Tomar foto de DNI',
};

export default withNavigationFocus(RegisterCamera);
