import React from 'react';
import styled from 'styled-components/native';
import THEME_COLORS from '../styles/theme.styles';
import { TouchableOpacity, GestureResponderEvent, TouchableWithoutFeedback } from 'react-native';


const TextButton = ({
  label,
  colors,
  onPress,
}: {
  label: string;
  colors?: {
    text?: string;
  };
  onPress?: (event: GestureResponderEvent) => void;
}) => {
  const textColor = colors?.text ?? THEME_COLORS.PRIMARY;

  const View = styled.View``;

  const Text = styled.Text`
    color: ${textColor};
    font-family: "LibreFranklin-Regular";
    font-size: 12px;
    text-align: center;
    padding: 8px 0px;
  `;

  return (
    <View style={{ elevation: 1 }}>
      <TouchableWithoutFeedback onPress={onPress ?? undefined}>
        <Text>{label}</Text>
      </TouchableWithoutFeedback >
    </View>

  );
};

export default TextButton;
