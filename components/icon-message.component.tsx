import React from 'react';
import styled from 'styled-components/native';
import {SvgProps} from 'react-native-svg';
import THEME_COLORS from '../styles/theme.styles';

const SvgView = styled.View``;

const Title = styled.Text`
  text-align: center;    
  font-size: 16px;
  font-family: "LibreFranklin-Regular";
  color: ${THEME_COLORS.FONT_REGULAR};
  margin-top: 24px;
  margin-bottom: 3px;
`;

const Subtitle = styled.Text`
  text-align: center;    
  font-size: 14px;
  font-family: "LibreFranklin-Regular";
  color: ${THEME_COLORS.FONT_NORMAL};
`;

const View = styled.View`
  align-items: center;
`;

const IconMessage = ({
  title,
  text,
  icon,
  iconStyle,
}: {
  icon?: Element;
  title?: string;
  text?: string;
  iconStyle?: {
    paddingLeft?: number,
    paddingRight?: number,
    paddingTop?: number,
    paddingBottom?: number,
    marginLeft?: number,
    marginRight?: number,
    marginTop?: number,
    marginBottom?: number,
  };
}) => (
  <React.Fragment>
    <View>
      <View style={{paddingLeft: iconStyle?.paddingLeft, 
          paddingRight: iconStyle?.paddingRight, 
          paddingTop: iconStyle?.paddingTop, 
          paddingBottom: iconStyle?.paddingBottom, 
          marginLeft: iconStyle?.marginLeft, 
          marginRight: iconStyle?.marginRight, 
          marginTop: iconStyle?.marginTop,
          marginBottom: iconStyle?.marginBottom}}>
        <SvgView>{icon}</SvgView>
      </View>
      {title ? <Title>{title}</Title> : null}
      {text ? <Subtitle>{text}</Subtitle>: null}
    </View>
  </React.Fragment>
);

export default IconMessage;

