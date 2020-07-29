import React from 'react';
import { withNavigationFocus } from 'react-navigation'
import Loader from './loader.component';
import { StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';

const styles = StyleSheet.create({
    preview: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    }
});

const QRScanner = (props: any) => {
    const { isFocused } = props;
    if (isFocused) {
        return (<RNCamera {...props}
            style={styles.preview}
            type={RNCamera.Constants.Type.back}
            flashMode={RNCamera.Constants.FlashMode.off}
            captureAudio={false}
            androidCameraPermissionOptions={{
                title: 'Permitir acceso a la camara',
                message: 'Para escanear códigos QR, debes permitir el acceso a la cámara',
                buttonPositive: 'Aceptar',
                buttonNegative: 'Cancelar',
            }}
        />
        )
    }
    else {
        return <Loader />;
    }
}
export default withNavigationFocus(QRScanner)