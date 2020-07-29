import React from 'react';
import styled from 'styled-components/native';
import THEME_COLORS from '../styles/theme.styles';

const Text = styled.Text`
  color: ${THEME_COLORS.FONT_REGULAR};
  font-family: LibreFranklin-Regular;
  font-size: 16px;
  margin-left: 10px;
  line-height: 20px;
`;

const View = styled.View`
  flex-direction: row;
  margin: 10px 0px;
`;

const IconSeparator = ({icon, text}: {icon: any; text: string}) => {
  return (
    <View>
      {icon}
      <Text>{text}</Text>
    </View>
  );
};

export default IconSeparator;
