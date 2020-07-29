import Animated from 'react-native-reanimated';
import React from 'react';
import styled from 'styled-components/native';
import THEME_MEASUREMENTS from '../styles/measurements.styles';

const Card = styled(Animated.View)`
  position: relative;
  border-radius: ${THEME_MEASUREMENTS.BORDER_RADIUS.CARDS};
  background-color: white;
  padding: 10px;
  elevation: 2;
`;

export default Card;
