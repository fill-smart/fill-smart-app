import React from 'react';
import { StatusBar, SafeAreaView, View } from 'react-native';
import THEME_COLORS from '../styles/theme.styles';
const ShowStatusBarLayout = ({ children }: { children: Element }) => {
  return (
    <View style={{ flex: 1, backgroundColor: THEME_COLORS.BACKGROUND_DARK }}>
      <StatusBar backgroundColor={THEME_COLORS.WHITE} barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
    </View>
  );
};

export default ShowStatusBarLayout;
