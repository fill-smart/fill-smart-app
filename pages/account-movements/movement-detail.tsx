import React from 'react';
import { View } from 'react-native';
import MovementDetail from '../../components/movement-detail.component';
import { useNavigationParam } from 'react-navigation-hooks';

const MovementDetailPage = () => {
    const item = useNavigationParam('item');
    return (
        <View style={{ margin: 25 }}>
            <MovementDetail item={item}/>
        </View>
    );
};

MovementDetailPage.navigationOptions = {              
    title: 'Detalle de movimiento',    
  };

export default MovementDetailPage;