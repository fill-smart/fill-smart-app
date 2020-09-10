import React from 'react';
import WebView from 'react-native-webview';

const PurchasePaymentMP = () => {
  return (
    <React.Fragment>
      <WebView 
        androidHardwareAccelerationDisabled={true}
        source={{uri: 'https://www.mercadopago.com'}}
      ></WebView>
    </React.Fragment>
  );
};

PurchasePaymentMP.navigationOptions = {
  title: 'MercadoPago',
};

export default PurchasePaymentMP;
