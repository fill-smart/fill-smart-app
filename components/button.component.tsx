import React from 'react';
import styled from 'styled-components/native';
import THEME_COLORS from '../styles/theme.styles';
import {
  TouchableOpacity,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';
import LottieView from 'lottie-react-native';


const Button = ({
  label,
  loading = false,
  colors,
  onPress,
  style,
}: {
  label: string;
  loading?: boolean;
  colors?: {
    text?: string;
    background?: string;
    border?: string;
  };
  onPress?: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
}) => {
  const backgroundColor = colors?.background ?? THEME_COLORS.PRIMARY;
  const textColor = colors?.text ?? 'white';

  const View = styled.View`
    ${colors?.border ? 'border: 1px solid ' + colors?.border : ''};
    border-radius: 5px;
    background-color: ${backgroundColor};
    height: 40px;
  `;

  const Text = styled.Text`
    color: ${textColor};
    font-family: LibreFranklin-Medium;
    font-weight: 700;
    font-size: 16px;
    text-align: center;
    padding-top: 8px;
  `;

  const textStyle = Object.assign({elevation: 1}, style);
  const content = loading ? (
    <View style={textStyle}>
      <LottieView
        source={require('../lottie/loader_alt.json')}
        autoPlay
        loop></LottieView>
    </View>
  ) : (
    <View style={textStyle}>
      <Text>{label}</Text>
    </View>
  );


  return (
    <TouchableOpacity onPress={onPress ?? undefined} activeOpacity={onPress ? undefined : 1}>
      {content}
    </TouchableOpacity>
  );
};

export default Button;
