import React from 'react';
import { View, Text, StyleSheet, TouchableOpacityComponent, GestureResponderEvent } from 'react-native';
import THEME_COLORS from '../styles/theme.styles';
import Toolbar from './toolbar.component';
import HamburguerMenuIcon from '../assets/icons/ic_hamburguer_menu.svg';
import { TouchableOpacity } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
    header: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 80
    },
    title: {
        flex: 1,
        fontFamily: 'LibreFranklin-Medium',
        fontSize: 16,
        color: THEME_COLORS.FONT_REGULAR,
    },

});

const HeaderBar = ({ title, onPress }: { title: string; onPress?: (event: GestureResponderEvent) => void;}) => {
    return (
        <View style={styles.header}>
            <View>
                <TouchableOpacity onPress={onPress}>
                    <HamburguerMenuIcon />
                </TouchableOpacity>
            </View>
            <Text>{title}</Text>
            <Toolbar />
        </View>
    );
};

export default HeaderBar;