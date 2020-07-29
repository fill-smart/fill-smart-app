import React from 'react';
import styled from 'styled-components/native';
import THEME_COLORS from '../styles/theme.styles';
import {TouchableOpacity  , StyleProp, ViewStyle} from 'react-native';

const ButtonOutline = ({
  label,
  colors,
  style,
  onPress,
}: {
  label: string;
  colors?: {
    text?: string;
    border?: string;
  };
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) => {
  const textColor = colors?.text ?? 'white';

  const View = styled.View`
    ${colors?.border
      ? 'border: 1px solid ' + colors?.border
      : 'border: 1px solid ' + THEME_COLORS.PRIMARY};
    border-radius: 5px;
    background-color: ${THEME_COLORS.WHITE};
    font-size: 16px;
    font-family: "LibreFranklin-Regular";
    height: 40px;
  `;

  const Text = styled.Text`
    color: ${textColor};
    font-family: "LibreFranklin-Regular";
    font-size: 16px;
    text-align: center;
    padding-top: 8px;
  `;

  const textStyle = Object.assign({elevation: 1}, style);

  return (
    <React.Fragment>
      <TouchableOpacity  onPress={onPress ?? undefined}>
        <View style={textStyle}>
          <Text>{label}</Text>
        </View>
      </TouchableOpacity >
    </React.Fragment>
  );
};

export default ButtonOutline;
