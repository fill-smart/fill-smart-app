import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import { defNavigationOptions } from '../../routing/routes';

const MercadoPago = () => {
    return (
        <WebView
            
            source={{ uri: 'https://www.silentiumapps.com' }}
            style={{ marginTop: 20 }}
        />
    );
}

MercadoPago.navigationOptions = {
    title: 'Pagar',
    ...defNavigationOptions
  };

export default MercadoPago;