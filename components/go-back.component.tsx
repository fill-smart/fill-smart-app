import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import BackIcon from '../assets/icons/ic_back.svg';
import { useNavigation } from 'react-navigation-hooks';

const BackButton = () => {
    const navigation = useNavigation();

    return (

        <TouchableOpacity onPress={() => navigation.goBack()}>
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", margin: 20 }}>
                <BackIcon width="24" height="24" />
            </View>
        </TouchableOpacity >


    );
}

export default BackButton;