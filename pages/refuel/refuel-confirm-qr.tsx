import React, { useContext, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import RefuelConfirmQrCard from '../../components/refuel-confirm-qr-card.component';
import ShowStatusBarLayout from '../../layouts/show-status-bar.layout';
import { useNavigation } from 'react-navigation-hooks';
import useLastOperation from '../../hooks/use-pump-last-operation.hook';
import { RefuelContext, REFUEL_ACTIONS } from '../../contexts/refuel.context';
import Loader from '../../components/loader.component';

const styles = StyleSheet.create({
  container: {
    padding: 25,
  },
});

const RefuelConfirmQrPage = () => {
  const navigation = useNavigation();
  const [refuelState, dispatch] = useContext(RefuelContext);

  const pumpId = navigation.getParam('pumpId');
  const { loading, pump } = useLastOperation(pumpId);

  const lastExternalOperation = pump?.lastExternalOperation;

  useEffect(() => {
    dispatch({
      type: REFUEL_ACTIONS.SET_OPERATION,
      payload: { operation: pump }
    });
  }, [pump]);


  if (loading) {
    return <Loader />;
  }

  if (!pump || !lastExternalOperation) {
    throw 'No operation';
  }


  return (
    <ShowStatusBarLayout>
      <View style={styles.container}>
        <RefuelConfirmQrCard
          fuel={lastExternalOperation.fuelType.name}
          litres={lastExternalOperation.litres}
          money={
            lastExternalOperation.litres *
            lastExternalOperation.fuelType.currentPrice.price
          }
          location={pump.gasStation.name}
          sublocation={'Surtidor ' + pump.externalId}
        />
      </View>
    </ShowStatusBarLayout>
  );
};

RefuelConfirmQrPage.navigationOptions = {
  title: 'Cargar',
};

export default RefuelConfirmQrPage;
